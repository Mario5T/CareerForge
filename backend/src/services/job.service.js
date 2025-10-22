const { prisma } = require('../config/db');
const { AppError } = require('../utils/errorHandler');

// Create job
exports.createJob = async (jobData) => {
  const { companyId, createdById } = jobData;

  // Verify company exists and user owns it
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.userId !== createdById) {
    throw new AppError('Not authorized to create job for this company', 403);
  }

  const job = await prisma.job.create({
    data: jobData,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          location: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return job;
};

// Get all jobs
exports.getAllJobs = async (filters = {}) => {
  const {
    search,
    location,
    jobType,
    experienceLevel,
    companyId,
    page = 1,
    limit = 10,
  } = filters;

  const where = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (location) {
    where.location = { contains: location, mode: 'insensitive' };
  }

  if (jobType) {
    where.jobType = jobType;
  }

  if (experienceLevel) {
    where.experienceLevel = experienceLevel;
  }

  if (companyId) {
    where.companyId = companyId;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: parseInt(limit),
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
            location: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

// Get job by ID
exports.getJobById = async (jobId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          location: true,
          website: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  return job;
};

// Update job
exports.updateJob = async (jobId, updateData, userId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.company.userId !== userId) {
    throw new AppError('Not authorized to update this job', 403);
  }

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: updateData,
    include: {
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          location: true,
        },
      },
    },
  });

  return updatedJob;
};

// Delete job
exports.deleteJob = async (jobId, userId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.company.userId !== userId) {
    throw new AppError('Not authorized to delete this job', 403);
  }

  await prisma.job.delete({
    where: { id: jobId },
  });
};

// Apply to job
exports.applyToJob = async (jobId, applicantId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job || !job.isActive) {
    throw new AppError('Job not found or inactive', 404);
  }

  // Check if already applied
  const existingApplication = await prisma.application.findUnique({
    where: {
      applicantId_jobId: {
        applicantId,
        jobId,
      },
    },
  });

  if (existingApplication) {
    throw new AppError('You have already applied to this job', 400);
  }

  const application = await prisma.application.create({
    data: {
      applicantId,
      jobId,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return application;
};

// Get applications for a job
exports.getJobApplications = async (jobId, userId) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true },
  });

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  if (job.company.userId !== userId) {
    throw new AppError('Not authorized to view applications', 403);
  }

  const applications = await prisma.application.findMany({
    where: { jobId },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          bio: true,
          skills: true,
          resume: true,
          profilePhoto: true,
        },
      },
    },
    orderBy: { appliedAt: 'desc' },
  });

  return applications;
};

// Update application status
exports.updateApplicationStatus = async (applicationId, status, userId) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!application) {
    throw new AppError('Application not found', 404);
  }

  if (application.job.company.userId !== userId) {
    throw new AppError('Not authorized to update this application', 403);
  }

  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return updatedApplication;
};
