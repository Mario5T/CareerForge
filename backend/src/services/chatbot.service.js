const { prisma } = require('../config/db');
const { AppError } = require('../utils/errorHandler');

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

  // intent: applications stats
  if (/how many|count.*apply|applications?\s*(have|did)\s*i/.test(text)) {
    const stats = await this.applicationStats(userId);
    return { type: 'stats', stats };
  }

  // intent: list my applications
  if (/show.*applications|my applications|applied jobs/.test(text)) {
    const apps = await this.userApplications(userId);
    return { type: 'applications', applications: apps };
  }

  // intent: jobs at company X
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

  // intent: entry-level roles
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

  // default: match jobs for me
  if (/match|jobs for me|recommend|suggest/.test(text) || text.trim().length > 0) {
    const result = await this.matchJobs(userId, {});
    return { type: 'jobList', jobs: result.jobs };
  }

  return { type: 'text', message: "Sorry, I didn't understand that." };
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
