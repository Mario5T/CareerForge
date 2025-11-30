const { prisma } = require('../config/db');
const { AppError } = require('../utils/errorHandler');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

if (!config.GROQ_API_KEYS || !config.GROQ_API_KEYS.length) {
  console.error('GROQ_API_KEY is not set in environment variables!');
  console.error('Please add GROQ_API_KEY to your .env file');
  process.exit(1);
}

console.log(`GROQ_API_KEY variants found: ${config.GROQ_API_KEYS.length}`);

const groqClients = config.GROQ_API_KEYS.map((apiKey, index) => {
  try {
    return new Groq({ apiKey });
  } catch (err) {
    console.error(`Failed to initialize Groq client for key index ${index}:`, err.message);
    return null;
  }
}).filter(Boolean);

let currentGroqClientIndex = 0;

async function callGroqWithRotation(payloadBuilder) {
  if (!groqClients.length) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  let lastError;

  for (let i = 0; i < groqClients.length; i++) {
    const index = (currentGroqClientIndex + i) % groqClients.length;
    const client = groqClients[index];

    try {
      const payload = typeof payloadBuilder === 'function' ? payloadBuilder() : payloadBuilder;
      const completion = await client.chat.completions.create(payload);
      currentGroqClientIndex = index;
      return completion;
    } catch (error) {
      lastError = error;
      const code = error?.code || error?.error?.code;
      const status = error?.status;

      console.error(`Groq LLM Error (key index ${index}):`, error.message);

      if (status === 413 || code === 'rate_limit_exceeded') {
        console.warn(`Groq rate/size limit hit on key index ${index}, trying next key if available...`);
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error('All Groq API keys failed');
}

let documentationContext = '';
try {
  const docPath = path.join(__dirname, '../../WEBSITE_DOCUMENTATION.md');
  
  if (fs.existsSync(docPath)) {
    documentationContext = fs.readFileSync(docPath, 'utf-8');
    console.log('Documentation loaded for LLM context.');
  } else {
    console.warn('Documentation file not found at:', docPath);
  }
} catch (err) {
  console.error('Failed to load documentation:', err);
}


function buildLimitedDocumentationContext() {
  if (!documentationContext) return '';
  const maxChars = 8000;
  if (documentationContext.length <= maxChars) return documentationContext;
  return documentationContext.slice(0, maxChars);
}

function truncateMessageContent(content, maxChars = 2000) {
  if (!content) return '';
  if (content.length <= maxChars) return content;
  return content.slice(0, maxChars);
}


function parseYears(ym) {
  if (!ym) return null;
  const [y, m] = ym.split('-').map(Number);
  if (!y) return null;
  const month = m && m >= 1 && m <= 12 ? m - 1 : 0;
  return new Date(y, month, 1);
}

function yearsBetween(start, end) {
  if (!start) return 0;
  const e = end || new Date();
  return Math.max(0, (e - start) / (1000 * 60 * 60 * 24 * 365.25));
}

function deriveExperienceLevel(totalYears) {
  if (totalYears < 2) return 'ENTRY';
  if (totalYears < 5) return 'MID';
  if (totalYears < 9) return 'SENIOR';
  return 'LEAD';
}

async function computeUserSignals(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      skills: true,
      experience: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);

  let totalYears = 0;
  if (user.experience && user.experience.length) {
    totalYears = user.experience.reduce((sum, exp) => {
      const s = parseYears(exp.startDate);
      const e = exp.currentlyWorking ? new Date() : parseYears(exp.endDate);
      return sum + yearsBetween(s, e);
    }, 0);
  }
  const expLevel = deriveExperienceLevel(totalYears);

  return {
    skills: user.skills || [],
    experienceLevel: expLevel,
  };
}

function scoreJob(job, userSkills) {
  const req = job.requirements || [];
  if (!req.length || !userSkills.length) return 0;
  const set = new Set(userSkills.map((s) => s.toLowerCase()));
  let overlap = 0;
  for (const r of req) {
    if (set.has(String(r).toLowerCase())) overlap += 1;
  }
  return overlap;
}

exports.handleMessage = async (userId, message) => {
  const text = (message || '').toLowerCase();


  if (/how many|count.*apply|applications?\s*(have|did)\s*i/.test(text)) {
    const stats = await this.applicationStats(userId);
    return { type: 'stats', stats };
  }

  if (/show.*applications|my applications|applied jobs/.test(text)) {
    const apps = await this.userApplications(userId);
    return { type: 'applications', applications: apps };
  }

  const companyMatch = text.match(/(jobs|roles) (at|in) ([a-z0-9 ._-]+)/i);
  if (companyMatch) {
    const company = companyMatch[3].trim();
    const { skills, experienceLevel } = await computeUserSignals(userId);
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        experienceLevel,
        company: { name: { contains: company, mode: 'insensitive' } },
        OR: skills.length ? [{ requirements: { hasSome: skills } }] : undefined,
      },
      include: {
        company: { select: { id: true, name: true, logo: true } },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    const sorted = jobs
      .map((j) => ({ job: j, score: scoreJob(j, skills) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.job);
    return { type: 'jobList', jobs: sorted };
  }

  if (/entry[- ]level/.test(text)) {
    const { skills } = await computeUserSignals(userId);
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        experienceLevel: 'ENTRY',
        OR: skills.length ? [{ requirements: { hasSome: skills } }] : undefined,
      },
      include: { company: { select: { id: true, name: true, logo: true } } },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    const sorted = jobs
      .map((j) => ({ job: j, score: scoreJob(j, skills) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((x) => x.job);
    return { type: 'jobList', jobs: sorted };
  }

  if (/match|recommend|suggest/.test(text) && !text.includes('how')) {
    const result = await this.matchJobs(userId, {});
    return { type: 'jobList', jobs: result.jobs };
  }

  try {
    console.log('Calling Groq LLM for general query...');
    const limitedDoc = buildLimitedDocumentationContext();
    const limitedUserMessage = truncateMessageContent(message);

    const completion = await callGroqWithRotation({
      messages: [
        {
          role: 'system',
          content: `You are the CareerForge AI Assistant, a helpful and friendly bot for the CareerForge job portal.
          
          Your goal is to assist users by answering questions about the platform, features, and how to use it.
          
          Use the following documentation as your PRIMARY source of truth:
          =========================================
          ${limitedDoc}
          =========================================
          
          Guidelines:
          1. Be concise and friendly.
          2. If the user asks about their specific data (like "my applications"), politely suggest they use the specific command "show my applications" or "my stats".
          3. Format your response with Markdown (bolding key terms, using lists).
          4. If the answer is not in the documentation, say you don't know but offer to help with general job search advice.
          5. Do NOT make up features that don't exist in the documentation.
          `
        },
        {
          role: 'user',
          content: limitedUserMessage
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 768,
    });

    const llmResponse = completion.choices[0]?.message?.content;
    console.log('Groq LLM response received');
    
    if (llmResponse) {
      return { type: 'text', message: llmResponse };
    }
  } catch (error) {
    console.error('Groq LLM Error:', error.message);
    console.error('Error details:', {
      name: error.name,
      status: error.status,
      message: error.message
    });
    return { 
      type: 'text', 
      message: "I'm having a little trouble connecting to my brain right now. Please try again in a moment!" 
    };
  }

  return { type: 'text', message: "I'm not sure about that. Try asking about jobs, your applications, or how to use the platform!" };
};

exports.matchJobs = async (userId, query = {}) => {
  const { skills, experienceLevel, jobType, location, limit = 10 } = query;
  const signals = await computeUserSignals(userId);
  const userSkills = skills && skills.length ? skills : signals.skills;
  const expLevel = experienceLevel || signals.experienceLevel;

  const where = {
    isActive: true,
    experienceLevel: expLevel,
  };
  if (jobType) where.jobType = jobType;
  if (location) where.location = { contains: location, mode: 'insensitive' };
  if (userSkills && userSkills.length) {
    where.OR = [{ requirements: { hasSome: userSkills } }];
  }

  const jobs = await prisma.job.findMany({
    where,
    include: { company: { select: { id: true, name: true, logo: true } } },
    take: Number(limit) || 10,
    orderBy: { createdAt: 'desc' },
  });

  const ranked = jobs
    .map((j) => ({ job: j, score: scoreJob(j, userSkills) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.job);

  return { jobs: ranked.slice(0, Number(limit) || 10) };
};

exports.jobDetails = async (jobId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          website: true,
          location: true,
          industry: true,
          companySize: true,
        },
      },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { applications: true } },
    },
  });
  if (!job) throw new AppError('Job not found', 404);
  return job;
};

exports.userApplications = async (userId) => {
  const apps = await prisma.application.findMany({
    where: { applicantId: userId },
    include: {
      job: { include: { company: { select: { id: true, name: true, logo: true } } } },
    },
    orderBy: { appliedAt: 'desc' },
  });
  return apps;
};

exports.applicationStats = async (userId) => {
  const [total, pending, accepted, rejected] = await Promise.all([
    prisma.application.count({ where: { applicantId: userId } }),
    prisma.application.count({ where: { applicantId: userId, status: 'PENDING' } }),
    prisma.application.count({ where: { applicantId: userId, status: 'ACCEPTED' } }),
    prisma.application.count({ where: { applicantId: userId, status: 'REJECTED' } }),
  ]);
  return { total, pending, accepted, rejected };
};
