# API Testing Guide

## Database Seeded Successfully! ✅

The database has been populated with dummy data for testing.

## Test Accounts

### Admin
- **Email:** admin@careerforge.com
- **Password:** password123

### Recruiters
1. **John Recruiter** (TechCorp Inc.)
   - Email: john@techcorp.com
   - Password: password123

2. **Sarah HR** (InnovateLabs)
   - Email: sarah@innovate.com
   - Password: password123

### Job Seekers
1. **Alice Developer**
   - Email: alice@example.com
   - Password: password123

2. **Bob Designer**
   - Email: bob@example.com
   - Password: password123

## Test Data Created

- ✅ 5 Users (1 Admin, 2 Recruiters, 2 Job Seekers)
- ✅ 3 Companies (TechCorp Inc., InnovateLabs, Creative Design Studio)
- ✅ 6 Jobs (various positions and types)
- ✅ 3 Applications

## API Endpoints Testing

### 1. Public Job Endpoints (No Auth Required)

#### Get All Jobs
```bash
curl http://10.254.202.92:5001/api/v1/jobs
```

#### Filter by Job Type
```bash
curl "http://10.254.202.92:5001/api/v1/jobs?jobType=FULL_TIME"
curl "http://10.254.202.92:5001/api/v1/jobs?jobType=REMOTE"
curl "http://10.254.202.92:5001/api/v1/jobs?jobType=INTERNSHIP"
```

#### Search Jobs
```bash
curl "http://10.254.202.92:5001/api/v1/jobs?search=developer"
curl "http://10.254.202.92:5001/api/v1/jobs?search=designer"
```

#### Filter by Location
```bash
curl "http://10.254.202.92:5001/api/v1/jobs?location=Remote"
curl "http://10.254.202.92:5001/api/v1/jobs?location=San Francisco"
```

#### Filter by Experience Level
```bash
curl "http://10.254.202.92:5001/api/v1/jobs?experienceLevel=SENIOR"
curl "http://10.254.202.92:5001/api/v1/jobs?experienceLevel=MID"
curl "http://10.254.202.92:5001/api/v1/jobs?experienceLevel=ENTRY"
```

#### Get Job by ID
```bash
# Replace JOB_ID with actual job ID from the list
curl http://10.254.202.92:5001/api/v1/jobs/JOB_ID
```

### 2. Authentication Endpoints

#### Register
```bash
curl -X POST http://10.254.202.92:5001/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

#### Login
```bash
curl -X POST http://10.254.202.92:5001/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

### 3. Protected Endpoints (Require Authentication)

#### Apply to Job
```bash
# First login to get token, then:
curl -X POST http://10.254.202.92:5001/api/v1/jobs/JOB_ID/apply \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get My Applications
```bash
curl http://10.254.202.92:5001/api/v1/jobs/applications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Recruiter Endpoints (Require RECRUITER role)

#### Get My Jobs
```bash
# Login as recruiter first
curl http://10.254.202.92:5001/api/v1/employer/jobs \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

#### Create Job
```bash
curl -X POST http://10.254.202.92:5001/api/v1/employer/jobs \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Backend Developer",
    "description": "We are looking for a skilled backend developer...",
    "requirements": ["Node.js", "PostgreSQL", "REST APIs"],
    "salaryMin": 100000,
    "salaryMax": 130000,
    "salaryCurrency": "USD",
    "location": "Remote",
    "jobType": "FULL_TIME",
    "experienceLevel": "MID",
    "positions": 2
  }'
```

#### Update Job
```bash
curl -X PUT http://10.254.202.92:5001/api/v1/employer/jobs/JOB_ID \
  -H "Authorization: Bearer RECRUITER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Backend Developer",
    "salaryMin": 120000
  }'
```

#### Delete Job
```bash
curl -X DELETE http://10.254.202.92:5001/api/v1/employer/jobs/JOB_ID \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

#### Get Job Applicants
```bash
curl http://10.254.202.92:5001/api/v1/employer/jobs/JOB_ID/applicants \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

## Frontend Testing

### Access the Application
1. **Frontend:** http://localhost:3000
2. **Backend API:** http://10.254.202.92:5001

### Test Flows

#### As Job Seeker:
1. Browse jobs at `/jobs`
2. Search and filter jobs
3. Click on a job to view details
4. Login with: alice@example.com / password123
5. Apply to jobs
6. View applications in dashboard

#### As Recruiter:
1. Login with: john@techcorp.com / password123
2. Go to `/employer/jobs` to manage jobs
3. Click "Post New Job" to create a job
4. View applicants for your jobs
5. Update or delete jobs

#### As Admin:
1. Login with: admin@careerforge.com / password123
2. Access all features
3. Manage users and companies

## Jobs Available for Testing

1. **Senior Full Stack Developer** - TechCorp Inc. (Full-time, Senior)
2. **Frontend Developer** - TechCorp Inc. (Remote, Mid)
3. **Mobile App Developer** - InnovateLabs (Full-time, Mid)
4. **UI/UX Designer** - Creative Design Studio (Full-time, Mid)
5. **DevOps Engineer** - TechCorp Inc. (Full-time, Senior)
6. **Software Engineering Intern** - InnovateLabs (Internship, Entry)

## Verified Working ✅

- ✅ GET /api/v1/jobs - Returns 6 jobs
- ✅ GET /api/v1/jobs?jobType=FULL_TIME - Returns 4 jobs
- ✅ GET /api/v1/jobs?search=developer - Returns 4 jobs
- ✅ GET /api/v1/jobs/:id - Returns job details with company info
- ✅ Database properly seeded with relationships
- ✅ CORS configured for frontend access

## Next Steps

1. Test the frontend at http://localhost:3000/jobs
2. Login with test accounts
3. Try applying to jobs
4. Test recruiter features (post/edit/delete jobs)
5. Verify all routes are working correctly
