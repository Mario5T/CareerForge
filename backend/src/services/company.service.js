const { prisma } = require('../config/db');
const { AppError } = require('../utils/errorHandler');

// Create company
exports.createCompany = async (companyData) => {
  const { name, userId } = companyData;

  // Check if company name already exists
  const existingCompany = await prisma.company.findUnique({
    where: { name },
  });

  if (existingCompany) {
    throw new AppError('Company with this name already exists', 400);
  }

  const company = await prisma.company.create({
    data: companyData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      jobs: {
        where: { isActive: true },
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
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.userId !== userId) {
    throw new AppError('Not authorized to update this company', 403);
  }

  const updatedCompany = await prisma.company.update({
    where: { id: companyId },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedCompany;
};

// Delete company
exports.deleteCompany = async (companyId, userId) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError('Company not found', 404);
  }

  if (company.userId !== userId) {
    throw new AppError('Not authorized to delete this company', 403);
  }

  await prisma.company.delete({
    where: { id: companyId },
  });
};
