const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.employer.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@careerforge.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+1234567890',
      bio: 'System Administrator',
    },
  });

  // Create COMPANY role users (company owners)
  const companyOwner1 = await prisma.user.create({
    data: {
      name: 'Michael TechCorp CEO',
      email: 'ceo@techcorp.com',
      password: hashedPassword,
      role: 'COMPANY',
      phone: '+1234567891',
      bio: 'CEO & Founder of TechCorp Inc.',
    },
  });

  const companyOwner2 = await prisma.user.create({
    data: {
      name: 'Emma InnovateLabs Founder',
      email: 'founder@innovate.com',
      password: hashedPassword,
      role: 'COMPANY',
      phone: '+1234567892',
      bio: 'Founder of InnovateLabs',
    },
  });

  const companyOwner3 = await prisma.user.create({
    data: {
      name: 'David Design Director',
      email: 'director@designstudio.com',
      password: hashedPassword,
      role: 'COMPANY',
      phone: '+1234567893',
      bio: 'Creative Director at Design Studio',
    },
  });

  // Create RECRUITER role users
  const recruiter1 = await prisma.user.create({
    data: {
      name: 'John Recruiter',
      email: 'john@techcorp.com',
      password: hashedPassword,
      role: 'RECRUITER',
      phone: '+1234567894',
      bio: 'Senior Recruiter at TechCorp',
    },
  });

  const recruiter2 = await prisma.user.create({
    data: {
      name: 'Sarah HR',
      email: 'sarah@innovate.com',
      password: hashedPassword,
      role: 'RECRUITER',
      phone: '+1234567895',
      bio: 'HR Manager at InnovateLabs',
    },
  });

  const jobSeeker1 = await prisma.user.create({
    data: {
      name: 'Alice Developer',
      email: 'alice@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1234567896',
      bio: 'Full Stack Developer with 5 years experience',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    },
  });

  const jobSeeker2 = await prisma.user.create({
    data: {
      name: 'Bob Designer',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'USER',
      phone: '+1234567897',
      bio: 'UI/UX Designer passionate about user experience',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    },
  });

  console.log('✅ Users created');

  // Create companies with owners
  const techCorp = await prisma.company.create({
    data: {
      name: 'TechCorp Inc.',
      description: 'Leading technology company specializing in cloud solutions and AI',
      website: 'https://techcorp.example.com',
      location: 'San Francisco, CA',
      logo: 'https://via.placeholder.com/150',
      industry: 'Technology',
      companySize: 'SIZE_201_500',
      ownerId: companyOwner1.id,
    },
  });

  const innovateLabs = await prisma.company.create({
    data: {
      name: 'InnovateLabs',
      description: 'Innovative startup building the future of mobile applications',
      website: 'https://innovatelabs.example.com',
      location: 'New York, NY',
      logo: 'https://via.placeholder.com/150',
      industry: 'Software',
      companySize: 'SIZE_51_200',
      ownerId: companyOwner2.id,
    },
  });

  const designStudio = await prisma.company.create({
    data: {
      name: 'Creative Design Studio',
      description: 'Award-winning design agency creating beautiful digital experiences',
      website: 'https://designstudio.example.com',
      location: 'Austin, TX',
      logo: 'https://via.placeholder.com/150',
      industry: 'Design',
      companySize: 'SIZE_11_50',
      ownerId: companyOwner3.id,
    },
  });

  console.log('✅ Companies created');

  // Create employers (link recruiters to companies)
  const employer1 = await prisma.employer.create({
    data: {
      userId: recruiter1.id,
      companyId: techCorp.id,
    },
  });

  const employer2 = await prisma.employer.create({
    data: {
      userId: recruiter2.id,
      companyId: innovateLabs.id,
    },
  });

  console.log('✅ Employers created');

  // Create jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Full Stack Developer',
      description: 'We are looking for an experienced Full Stack Developer to join our growing team. You will be responsible for building scalable web applications using modern technologies.',
      requirements: [
        '5+ years of experience with React and Node.js',
        'Strong understanding of TypeScript',
        'Experience with PostgreSQL or similar databases',
        'Knowledge of AWS or cloud platforms',
        'Excellent problem-solving skills',
      ],
      salaryMin: 120000,
      salaryMax: 160000,
      salaryCurrency: 'USD',
      location: 'San Francisco, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      positions: 2,
      isActive: true,
      companyId: techCorp.id,
      employerId: employer1.id,
      createdById: recruiter1.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Frontend Developer',
      description: 'Join our team to build beautiful and responsive user interfaces. We use the latest frontend technologies and follow best practices.',
      requirements: [
        '3+ years of React experience',
        'Proficiency in HTML, CSS, JavaScript',
        'Experience with state management (Redux, Context API)',
        'Understanding of responsive design',
        'Good communication skills',
      ],
      salaryMin: 90000,
      salaryMax: 120000,
      salaryCurrency: 'USD',
      location: 'Remote',
      jobType: 'REMOTE',
      experienceLevel: 'MID',
      positions: 3,
      isActive: true,
      companyId: techCorp.id,
      employerId: employer1.id,
      createdById: recruiter1.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: 'Mobile App Developer',
      description: 'Build cutting-edge mobile applications for iOS and Android. Work with a talented team on exciting projects.',
      requirements: [
        'Experience with React Native or Flutter',
        'Knowledge of mobile app architecture',
        'Published apps on App Store or Play Store',
        'Understanding of RESTful APIs',
        'Team player with good communication',
      ],
      salaryMin: 100000,
      salaryMax: 140000,
      salaryCurrency: 'USD',
      location: 'New York, NY',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      positions: 2,
      isActive: true,
      companyId: innovateLabs.id,
      employerId: employer2.id,
      createdById: recruiter2.id,
    },
  });

  const job4 = await prisma.job.create({
    data: {
      title: 'UI/UX Designer',
      description: 'Create stunning user interfaces and delightful user experiences. Work closely with developers to bring designs to life.',
      requirements: [
        'Strong portfolio demonstrating UI/UX skills',
        'Proficiency in Figma and Adobe Creative Suite',
        'Understanding of design systems',
        'Experience with user research and testing',
        'Attention to detail',
      ],
      salaryMin: 80000,
      salaryMax: 110000,
      salaryCurrency: 'USD',
      location: 'Austin, TX',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      positions: 1,
      isActive: true,
      companyId: designStudio.id,
      employerId: employer2.id,
      createdById: recruiter2.id,
    },
  });

  const job5 = await prisma.job.create({
    data: {
      title: 'DevOps Engineer',
      description: 'Help us build and maintain our cloud infrastructure. Automate deployments and ensure high availability.',
      requirements: [
        'Experience with AWS, Azure, or GCP',
        'Knowledge of Docker and Kubernetes',
        'CI/CD pipeline experience',
        'Scripting skills (Python, Bash)',
        'Problem-solving mindset',
      ],
      salaryMin: 110000,
      salaryMax: 150000,
      salaryCurrency: 'USD',
      location: 'San Francisco, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      positions: 1,
      isActive: true,
      companyId: techCorp.id,
      employerId: employer1.id,
      createdById: recruiter1.id,
    },
  });

  const job6 = await prisma.job.create({
    data: {
      title: 'Software Engineering Intern',
      description: 'Great opportunity for students to gain real-world experience. Work on meaningful projects with mentorship from senior engineers.',
      requirements: [
        'Currently pursuing CS degree or related field',
        'Basic knowledge of programming (any language)',
        'Eagerness to learn',
        'Good problem-solving skills',
        'Available for 3-6 months',
      ],
      salaryMin: 25,
      salaryMax: 35,
      salaryCurrency: 'USD',
      location: 'Remote',
      jobType: 'INTERNSHIP',
      experienceLevel: 'ENTRY',
      positions: 5,
      isActive: true,
      companyId: innovateLabs.id,
      employerId: employer2.id,
      createdById: recruiter2.id,
    },
  });

  const job7 = await prisma.job.create({
    data: {
      title: 'Backend Engineer',
      description: 'Build robust backend systems and APIs. Work with microservices, databases, and cloud infrastructure.',
      requirements: [
        '4+ years of backend development experience',
        'Proficiency in Node.js, Python, or Java',
        'Experience with RESTful APIs and GraphQL',
        'Database design and optimization skills',
        'Understanding of system design principles',
      ],
      salaryMin: 110000,
      salaryMax: 150000,
      salaryCurrency: 'USD',
      location: 'San Francisco, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      positions: 2,
      isActive: true,
      companyId: techCorp.id,
      employerId: employer1.id,
      createdById: recruiter1.id,
    },
  });

  const job8 = await prisma.job.create({
    data: {
      title: 'Product Manager',
      description: 'Lead product strategy and development. Work with cross-functional teams to deliver amazing products.',
      requirements: [
        '5+ years of product management experience',
        'Strong analytical and communication skills',
        'Experience with agile methodologies',
        'Data-driven decision making',
        'Track record of successful product launches',
      ],
      salaryMin: 130000,
      salaryMax: 180000,
      salaryCurrency: 'USD',
      location: 'New York, NY',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      positions: 1,
      isActive: true,
      companyId: innovateLabs.id,
      employerId: employer2.id,
      createdById: recruiter2.id,
    },
  });

  const job9 = await prisma.job.create({
    data: {
      title: 'QA Engineer',
      description: 'Ensure quality of our products through comprehensive testing. Develop test strategies and automation frameworks.',
      requirements: [
        '3+ years of QA experience',
        'Experience with automated testing frameworks',
        'Knowledge of testing methodologies',
        'Bug tracking and reporting skills',
        'Attention to detail',
      ],
      salaryMin: 80000,
      salaryMax: 110000,
      salaryCurrency: 'USD',
      location: 'Remote',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      positions: 2,
      isActive: true,
      companyId: techCorp.id,
      employerId: employer1.id,
      createdById: recruiter1.id,
    },
  });

  const job10 = await prisma.job.create({
    data: {
      title: 'Data Scientist',
      description: 'Analyze complex datasets and build machine learning models. Drive data-driven insights for business decisions.',
      requirements: [
        '3+ years of data science experience',
        'Proficiency in Python and R',
        'Machine learning and statistical analysis skills',
        'Experience with big data tools',
        'Strong communication skills',
      ],
      salaryMin: 120000,
      salaryMax: 160000,
      salaryCurrency: 'USD',
      location: 'San Francisco, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      positions: 1,
      isActive: true,
      companyId: techCorp.id,
      employerId: employer1.id,
      createdById: recruiter1.id,
    },
  });

  const job11 = await prisma.job.create({
    data: {
      title: 'Graphic Designer',
      description: 'Create visually stunning graphics and designs. Collaborate with marketing and product teams.',
      requirements: [
        '2+ years of graphic design experience',
        'Proficiency in Adobe Creative Suite',
        'Strong portfolio',
        'Understanding of design principles',
        'Attention to detail',
      ],
      salaryMin: 70000,
      salaryMax: 95000,
      salaryCurrency: 'USD',
      location: 'Austin, TX',
      jobType: 'FULL_TIME',
      experienceLevel: 'MID',
      positions: 1,
      isActive: true,
      companyId: designStudio.id,
      employerId: employer2.id,
      createdById: recruiter2.id,
    },
  });

  const job12 = await prisma.job.create({
    data: {
      title: 'Security Engineer',
      description: 'Protect our systems and data. Implement security best practices and conduct vulnerability assessments.',
      requirements: [
        '5+ years of security engineering experience',
        'Knowledge of network security and cryptography',
        'Experience with penetration testing',
        'Understanding of compliance standards',
        'Problem-solving mindset',
      ],
      salaryMin: 130000,
      salaryMax: 170000,
      salaryCurrency: 'USD',
      location: 'San Francisco, CA',
      jobType: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      positions: 1,
      isActive: true,
      companyId: techCorp.id,
      employerId: employer1.id,
      createdById: recruiter1.id,
    },
  });

  console.log('✅ Jobs created');

  // Create some applications
  await prisma.application.create({
    data: {
      jobId: job1.id,
      applicantId: jobSeeker1.id,
      status: 'PENDING',
    },
  });

  await prisma.application.create({
    data: {
      jobId: job2.id,
      applicantId: jobSeeker1.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.application.create({
    data: {
      jobId: job4.id,
      applicantId: jobSeeker2.id,
      status: 'PENDING',
    },
  });

  console.log('✅ Applications created');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📧 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:');
  console.log('  Email: admin@careerforge.com');
  console.log('  Password: password123');
  console.log('\nCompany Owners (COMPANY role):');
  console.log('  Email: ceo@techcorp.com');
  console.log('  Password: password123');
  console.log('  Company: TechCorp Inc.');
  console.log('');
  console.log('  Email: founder@innovate.com');
  console.log('  Password: password123');
  console.log('  Company: InnovateLabs');
  console.log('');
  console.log('  Email: director@designstudio.com');
  console.log('  Password: password123');
  console.log('  Company: Creative Design Studio');
  console.log('\nRecruiters (RECRUITER role):');
  console.log('  Email: john@techcorp.com');
  console.log('  Password: password123');
  console.log('  Company: TechCorp Inc.');
  console.log('');
  console.log('  Email: sarah@innovate.com');
  console.log('  Password: password123');
  console.log('  Company: InnovateLabs');
  console.log('\nJob Seekers (USER role):');
  console.log('  Email: alice@example.com');
  console.log('  Password: password123');
  console.log('');
  console.log('  Email: bob@example.com');
  console.log('  Password: password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`\n📊 Created:`);
  console.log(`  - 8 Users (1 Admin, 3 Company Owners, 2 Recruiters, 2 Job Seekers)`);
  console.log(`  - 3 Companies (each owned by a COMPANY role user)`);
  console.log(`  - 2 Employer relationships (Recruiters linked to Companies)`);
  console.log(`  - 12 Jobs`);
  console.log(`  - 3 Applications`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
