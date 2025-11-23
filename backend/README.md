# CareerForge Backend API

Backend API for CareerForge job portal built with Node.js, Express, Prisma, and PostgreSQL.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (User, Recruiter, Admin)
- **Company Management**: CRUD operations for companies
- **Job Management**: Create, read, update, delete job postings
- **Application System**: Apply to jobs and manage applications
- **PostgreSQL Database**: Using Prisma ORM for type-safe database access

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Winston** - Logging
- **Express Validator** - Input validation

## Prerequisites

- Node.js >= 16.0.0
- PostgreSQL >= 13
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Set up the database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed the database
npm run prisma:seed
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user

### Users
- `GET /api/v1/users/profile` - Get user profile (Protected)
- `PUT /api/v1/users/profile` - Update user profile (Protected)
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Companies
- `GET /api/v1/companies` - Get all companies
- `GET /api/v1/companies/:id` - Get company by ID
- `POST /api/v1/companies` - Create company (Recruiter/Admin)
- `PUT /api/v1/companies/:id` - Update company (Recruiter/Admin)
- `DELETE /api/v1/companies/:id` - Delete company (Recruiter/Admin)

### Jobs
- `GET /api/v1/jobs` - Get all jobs
- `GET /api/v1/jobs/:id` - Get job by ID
- `POST /api/v1/jobs` - Create job (Recruiter/Admin)
- `PUT /api/v1/jobs/:id` - Update job (Recruiter/Admin)
- `DELETE /api/v1/jobs/:id` - Delete job (Recruiter/Admin)
- `POST /api/v1/jobs/:id/apply` - Apply to job (Protected)
- `GET /api/v1/jobs/:id/applications` - Get job applications (Recruiter/Admin)
- `PATCH /api/v1/jobs/applications/:applicationId` - Update application status (Recruiter/Admin)

## Database Schema

The application uses the following main models:
- **User**: User accounts with authentication
- **Company**: Company profiles
- **Job**: Job postings
- **Application**: Job applications

See [`prisma/schema.prisma`](./prisma/schema.prisma) for the complete schema definition.

Below is the visual ER model representing all entities and relationships:

![Database Schema](./assets/database-schema.svg)

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Push schema changes without migrations
npm run prisma:push

# Open Prisma Studio (Database GUI)
npm run prisma:studio
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── .env                 # Environment variables
├── package.json
└── README.md
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/careerforge
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## Error Handling

The API uses a centralized error handling mechanism with custom error classes. All errors are logged using Winston and returned in a consistent format.

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Helmet.js for security headers
- CORS configuration
- Input validation using express-validator

## License

ICSE
