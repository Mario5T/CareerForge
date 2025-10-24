const { prisma } = require('../config/db');
const { AppError } = require('../utils/errorHandler');

// Create company profile for employer
exports.createCompanyProfile = async (userId, data) => {
  // Check if user already has an employer profile
  const existingEmployer = await prisma.employer.findUnique({
    where: { userId },
  });
  if (existingEmployer) throw new AppError('You already have an employer profile', 400);

  // Create or find company
  let company;
  const existingCompany = await prisma.company.findUnique({
    where: { name: data.companyName },
  });

  if (existingCompany) {
    company = existingCompany;
  } else {
    company = await prisma.company.create({
      data: {
        name: data.companyName,
        description: data.companyDescription,
        website: data.companyWebsite,
        location: data.companyLocation,
        logo: data.companyLogo,
        industry: data.companyIndustry,
        companySize: data.companySize,
      },
    });
  }

  // Create employer profile
  const employer = await prisma.employer.create({
    data: {
      userId,
      companyId: company.id,
      title: data.title,
      department: data.department,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          description: true,
          website: true,
          location: true,
          logo: true,
          industry: true,
          companySize: true,
        },
      },
    },
  });

  return employer;
};

// Update company profile
exports.updateCompanyProfile = async (userId, data) => {
  const employer = await prisma.employer.findUnique({
    where: { userId },
    include: { company: true },
  });
  if (!employer) throw new AppError('Employer profile not found', 404);

  // Update employer details
  const updatedEmployer = await prisma.employer.update({
    where: { userId },
    data: {
      title: data.title,
      department: data.department,
    },
  });

  // Update company details if provided
  if (data.companyName || data.companyDescription || data.companyWebsite || data.companyLocation || data.companyLogo || data.companyIndustry || data.companySize) {
    await prisma.company.update({
      where: { id: employer.companyId },
      data: {
        ...(data.companyName && { name: data.companyName }),
        ...(data.companyDescription && { description: data.companyDescription }),
        ...(data.companyWebsite && { website: data.companyWebsite }),
        ...(data.companyLocation && { location: data.companyLocation }),
        ...(data.companyLogo && { logo: data.companyLogo }),
        ...(data.companyIndustry && { industry: data.companyIndustry }),
        ...(data.companySize && { companySize: data.companySize }),
      },
    });
  }

  return updatedEmployer;
};

// Get employer's company profile
exports.getMyCompany = async (userId) => {
  const employer = await prisma.employer.findUnique({
    where: { userId },
    include: {
      company: {
        include: {
          employers: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          jobs: {
            where: { isActive: true },
            include: {
              employer: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!employer) throw new AppError('Employer profile not found', 404);
  return employer;
};

// Get jobs created by this employer
exports.getMyJobs = async (userId) => {
  const employer = await prisma.employer.findUnique({
    where: { userId },
    include: {
      company: {
        select: { name: true, logo: true },
      },
      jobs: {
        include: {
          _count: { select: { applications: true } },
          company: { select: { name: true, logo: true } },
        },
      },
    },
  });
  if (!employer) throw new AppError('Employer profile not found', 404);

  return employer.jobs;
};

// Get applicants for a job
exports.getApplicantsForJob = async (jobId, userId) => {
  // Check if user is an employer for the company that owns this job
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true, employer: true },
  });

  if (!job) throw new AppError('Job not found', 404);

  // Check if user is an employer of the same company
  const userEmployer = await prisma.employer.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId: job.companyId,
      },
    },
  });

  if (!userEmployer) throw new AppError('Not authorized to view applicants for this job', 403);

  const applicants = await prisma.application.findMany({
    where: { jobId },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          skills: true,
          resume: true,
          profilePhoto: true,
        },
      },
    },
  });

  return applicants;
};

// Create job for employer
exports.createJob = async (userId, jobData) => {
  // Get employer's company
  const employer = await prisma.employer.findUnique({
    where: { userId },
    include: { company: true },
  });

  if (!employer) throw new AppError('Employer profile not found', 404);

  const job = await prisma.job.create({
    data: {
      ...jobData,
      companyId: employer.companyId,
      employerId: employer.id,
      createdById: userId,
    },
    include: {
      employer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return job;
};

// Update job
exports.updateJob = async (jobId, userId, updateData) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new AppError('Job not found', 404);
  if (job.createdById !== userId) throw new AppError('Not authorized to update this job', 403);

  const updatedJob = await prisma.job.update({
    where: { id: jobId },
    data: updateData,
    include: {
      employer: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      company: {
        select: {
          id: true,
          name: true,
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
  });

  if (!job) throw new AppError('Job not found', 404);
  if (job.createdById !== userId) throw new AppError('Not authorized to delete this job', 403);

  await prisma.job.delete({
    where: { id: jobId },
  });
};

// Get all jobs for employer's company
exports.getCompanyJobs = async (userId) => {
  const employer = await prisma.employer.findUnique({
    where: { userId },
    include: {
      company: {
        include: {
          jobs: {
            where: { isActive: true },
            include: {
              employer: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  });

  if (!employer) throw new AppError('Employer profile not found', 404);

  return employer.company.jobs;
};
