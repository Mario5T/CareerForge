const { prisma } = require('../config/db');
const { AppError } = require('../utils/errorHandler');

// Create company
exports.createCompany = async (companyData) => {
  const { name, description, website, location, logo, industry, companySize } = companyData;

  // Check if company name already exists
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
    },
  });

  return company;
};

// Get all companies
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

// Get company by ID
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
        select: {
          id: true,
          title: true,
          location: true,
          jobType: true,
          experienceLevel: true,
          createdAt: true,
        },
      },
    },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  return company;
};

// Update company
exports.updateCompany = async (companyId, updateData, userId) => {
  // Check if user is an employer of this company
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

// Delete company
exports.deleteCompany = async (companyId, userId) => {
  // Check if user is an employer of this company
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

// Add new functions for employer management
exports.addEmployerToCompany = async (companyId, userId, employerData) => {
  // Check if company exists
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  // Check if user already exists as employer for this company
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
  // Check if user is an employer of this company
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
