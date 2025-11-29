const { prisma } = require('../config/db');
const { AppError } = require('../utils/errorHandler');
exports.createCompany = async (companyData, ownerId) => {
  const { name, description, website, location, logo, industry, companySize } = companyData;

  const existingOwned = await prisma.company.findFirst({
    where: { ownerId },
  });

  if (existingOwned) {
    throw new AppError('You already own a company. Each user can own only one company.', 400);
  }

  const existingCompany = await prisma.company.findUnique({
    where: { name },
  });

  if (existingCompany) {
    throw new AppError('Company with this name already exists', 400);
  }

  const company = await prisma.company.create({
    data: {
      name,
      description,
      website,
      location,
      logo,
      industry,
      companySize,
      ownerId,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return company;
};

exports.getAllCompanies = async (filters = {}) => {
  const { search, industry, companySize, page = 1, limit = 10 } = filters;

  const where = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (industry) {
    where.industry = industry;
  }

  if (companySize) {
    where.companySize = companySize;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: parseInt(limit),
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
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.company.count({ where }),
  ]);

  return {
    companies,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

exports.getCompanyById = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
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
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  return company;
};

exports.updateCompany = async (companyId, updateData, userId) => {
  const employer = await prisma.employer.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!employer) {
    throw new AppError('Not authorized to update this company', 403);
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: updateData,
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
    },
  });

  return updatedCompany;
};

exports.deleteCompany = async (companyId, userId) => {
  const employer = await prisma.employer.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!employer) {
    throw new AppError('Not authorized to delete this company', 403);
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  await prisma.company.delete({
    where: { id: companyId },
  });
};

exports.addEmployerToCompany = async (companyId, userId, employerData) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  const existingEmployer = await prisma.employer.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (existingEmployer) {
    throw new AppError('User is already an employer for this company', 400);
  }

  const employer = await prisma.employer.create({
    data: {
      userId,
      companyId,
      ...employerData,
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
        },
      },
    },
  });

  return employer;
};

exports.removeEmployerFromCompany = async (companyId, userId) => {
  const employer = await prisma.employer.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!employer) {
    throw new AppError('User is not an employer for this company', 404);
  }

  await prisma.employer.delete({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });
};

exports.getCompanyEmployers = async (companyId) => {
  const employers = await prisma.employer.findMany({
    where: {
      companyId,
      isActive: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: { joinedAt: 'desc' },
  });

  return employers;
};

exports.getCompanyByOwnerId = async (ownerId) => {
  const company = await prisma.company.findFirst({
    where: { ownerId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      employers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          _count: {
            select: {
              jobs: true,
            },
          },
        },
        orderBy: {
          joinedAt: 'desc',
        },
      },
      jobs: {
        include: {
          _count: {
            select: {
              applications: true,
            },
          },
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
          applications: {
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
            orderBy: {
              appliedAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: {
        select: { 
          jobs: true,
          employers: true,
        },
      },
    },
  });

  return company;
};

exports.updateCompanyByOwner = async (ownerId, updateData) => {
  const company = await prisma.company.findFirst({
    where: { ownerId },
  });

  if (!company) {
    throw new AppError('Company not found or you do not own any company', 404);
  }

  if (updateData.name && updateData.name !== company.name) {
    const existingCompany = await prisma.company.findUnique({
      where: { name: updateData.name },
    });

    if (existingCompany) {
      throw new AppError('Company with this name already exists', 400);
    }
  }

  const updatedCompany = await prisma.company.update({
    where: { id: company.id },
    data: updateData,
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      _count: {
        select: { 
          jobs: true,
          employers: true,
        },
      },
    },
  });

  return updatedCompany;
};

exports.getProfileCompletion = (company) => {
  const requiredFields = ['name', 'description', 'website', 'location', 'logo', 'industry', 'companySize'];
  const completedFields = requiredFields.filter(field => company[field] && company[field].length > 0);
  
  const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
  
  const missingFields = requiredFields.filter(field => !company[field] || company[field].length === 0);
  
  return {
    percentage,
    completedFields: completedFields.length,
    totalFields: requiredFields.length,
    missingFields,
    isComplete: percentage === 100,
  };
};
