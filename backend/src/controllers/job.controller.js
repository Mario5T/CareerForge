const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const logger = require('../utils/logger');

exports.getAllJobs = async (req, res, next) => {
  try {
    const { 
      search, 
      location, 
      jobType, 
      experienceLevel,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 20
    } = req.query;

    const where = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } },
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

    if (salaryMin) {
      where.salaryMin = { gte: parseInt(salaryMin) };
    }
    if (salaryMax) {
      where.salaryMax = { lte: parseInt(salaryMax) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
              location: true,
              industry: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.job.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Error fetching jobs:', error);
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
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
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    logger.error('Error fetching job:', error);
    next(error);
  }
};

exports.applyToJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      });
    }

    if (!job.isActive) {
      return res.status(400).json({
        success: false,
        error: 'This job is no longer accepting applications',
      });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: id,
        applicantId: userId,
      },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        error: 'You have already applied to this job',
      });
    }

    const application = await prisma.application.create({
      data: {
        jobId: id,
        applicantId: userId,
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  } catch (error) {
    logger.error('Error applying to job:', error);
    next(error);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const applications = await prisma.application.findMany({
      where: {
        applicantId: userId,
      },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
      orderBy: {
        appliedAt: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    logger.error('Error fetching applications:', error);
    next(error);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

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
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      });
    }

    if (req.user.role !== 'ADMIN') {
      const isRecruiter = await prisma.company.findFirst({
        where: {
          id: application.job.companyId,
          employers: {
            some: {
              id: userId,
            },
          },
        },
      });

      if (!isRecruiter) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to update this application',
        });
      }
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
            resume: true,
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

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication,
    });
  } catch (error) {
    logger.error('Error updating application status:', error);
    next(error);
  }
};
