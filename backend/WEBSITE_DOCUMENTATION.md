# CareerForge - Complete Website Documentation

**Last Updated:** 2025-11-29  
**Purpose:** Comprehensive documentation for training LLM chatbot and providing complete website context

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Getting Started](#getting-started)
4. [Authentication & Account](#authentication--account)
5. [Job Seeker Guide](#job-seeker-guide)
6. [Recruiter Guide](#recruiter-guide)
7. [Company Guide](#company-guide)
8. [Features & Functionality](#features--functionality)
9. [FAQ](#faq)
10. [Technical Information](#technical-information)
11. [How to Apply for Jobs](#how-to-apply-for-jobs)
12. [Chatbot Guide](#chatbot-guide)

---

## Platform Overview

**CareerForge** is a full-stack Job Application and Recruitment Portal built with the MERN stack. It connects **job seekers, employers, and companies** on a single platform, offering a seamless hiring experience.

### Mission
To create a comprehensive platform that connects talented professionals with great opportunities while providing companies with the tools they need to find the perfect candidates.

### Key Value Propositions
- **For Job Seekers:** Find your dream job with personalized recommendations based on your skills
- **For Recruiters:** Post jobs and manage applications efficiently 
- **For Companies:** Manage your recruitment team and oversee the entire hiring process
- **For Everyone:** Google OAuth integration for quick sign-up, intuitive interface, and real-time job matching

---

## User Roles & Permissions

CareerForge supports three distinct user roles, each with specific capabilities:

### 1. **USER (Job Seeker)**
**Description:** Individuals searching for employment opportunities

**Permissions:**
- Create and manage personal profile
- Upload and update resume
- Search and browse job listings
- Apply for jobs (one-click application)
- Save jobs for later review
- View application status
- Track application history
- Receive personalized job recommendations based on skills
- Add skills, experience, and education to profile
- View company profiles

**Dashboard Features:**
- Application tracking
- Saved jobs
- Interview schedules
- Profile completion status
- Personalized job recommendations with match percentage

### 2. **RECRUITER (Employer)**
**Description:** Professionals who post jobs and manage hiring on behalf of companies

**Permissions:**
- Create and edit job postings
- Manage job applicants
- Review applications and resumes
- Update application status (pending, accepted, rejected)
- View applicant profiles
- Post jobs for their associated company
- Manage their recruiter profile

**Dashboard Features:**
- Active job listings
- Pending applications
- Recruiter profile management
- Job posting analytics

**Note:** Recruiters are associated with a specific company and can only post jobs for that company.

### 3. **COMPANY**
**Description:** Organizations managing their overall recruitment process

**Permissions:**
- Create and manage company profile
- Add/remove recruiters
- Oversee all job postings from company recruiters
- View all applications across company jobs
- Manage company information (logo, description, website, location)
- Monitor recruitment activities

**Dashboard Features:**
- Active jobs count
- Total applications across all jobs
- Number of recruiters
- Profile completion percentage
- Quick access to recruiter management
- Company profile setup

**Important:** Company users cannot directly post jobs - they must assign recruiters to handle job postings.

---

## Getting Started

### Creating an Account

There are two ways to sign up for CareerForge:

#### Method 1: Email & Password Registration

1. Navigate to the **Register** page
2. Enter your details:
   - **Full Name:** Your full name
   - **Email:** A valid email address (will be used for login)
   - **Password:** Minimum 6 characters
   - **Confirm Password:** Must match your password
   - **Account Type:** Choose your role (Job Seeker, Recruiter, or Company)

3. **Account Type Details:**
   - **Job Seeker:** For individuals looking to find and apply to jobs
   - **Recruiter:** For HR professionals who post jobs and manage hiring
   - **Company:** For organizations managing recruiters and overseeing recruitment

4. Click **"Create Account"**
5. You'll be automatically logged in and redirected to the home page

#### Method 2: Google OAuth (Quick Sign-up)

1. Click **"Continue with Google"** on the register or login page
2. Select your Google account
3. Grant necessary permissions
4. You'll be automatically logged in
5. Complete your profile with additional details

### First Steps After Registration

**For Job Seekers:**
1. Complete your profile with skills, experience, and education
2. Upload your resume
3. Browse available jobs
4. Start applying!

**For Recruiters:**
1. Complete your recruiter profile
2. Make sure you're associated with a company
3. Start posting jobs

**For Companies:**
1. Complete your company profile (logo, description, website)
2. Invite or add recruiters to your team
3. Monitor recruitment activities

### Setup Checklist

All users see a setup checklist on their home page to guide them through initial setup:

**Company Setup Checklist:**
- ✓ Create your account
- ⚠️ Complete company profile (add company details and logo)
- ⚠️ Invite recruiters (add team members to help with hiring)

**Job Seeker Setup:**
- ✓ Create your account  
- Complete your profile (add bio, skills, experience)
- Upload your resume
- Browse and apply for jobs

---

## Authentication & Account

### Login

**How to Sign In:**
1. Go to the **Login** page
2. Enter your email and password
3. Click **"Sign In"**
4. Alternative: Click **"Continue with Google"** for OAuth login

**Forgot Password:**
- Click "Forgot password?" link on the login page
- (Note: This feature redirects to a password reset flow)

### Login Help
- **Email:** Use the email address you registered with
- **Password:** Minimum 6 characters
- If you signed up with Google, use the Google login option

### Account Security
- Passwords are securely hashed using bcryptjs
- JWT tokens are used for secure session management
- Sessions expire after 7 days for security

### Logout
- Click your profile icon/name in the navigation
- Select **"Logout"** from the dropdown menu

---

## Job Seeker Guide

### Building Your Profile

#### Profile Sections

**1. Basic Information**
- **Name:** Your full professional name
- **Email:** Contact email (from registration)
- **Phone:** Contact phone number
- **Bio:** Brief professional summary (showcase your expertise)
- **Location:** Your city/region
- **Profile Photo:** Upload a professional photo

**2. Skills**
Add relevant technical and soft skills. The platform uses these for job recommendations.

**Tip:** Add specific skills like "React", "JavaScript", "Python", "Project Management", etc. The more accurate your skills, the better your job recommendations.

**3. Work Experience**
Add your professional experience:
- **Job Title:** Your position
- **Company Name:**  Where you worked
- **Location:** Office location
- **Employment Type:** Full-time, Part-time, Contract, etc.
- **Start Date:** Format YYYY-MM
- **End Date:** Format YYYY-MM (or check "Currently Working")
- **Description:** Your responsibilities and achievements
- **Skills Used:** Technologies/skills used in this role
- **Certificate:** Upload proof of employment (optional)

**4. Education**
Add your academic background:
- **Degree:** e.g., Bachelor of Science, Master of Technology
- **University/Institution:** School name
- **Field of Study:** Your major/specialization
- **Start Year:** Year you started
- **End Year:** Year you graduated (or check "Is Present")
- **Grade:** Your CGPA or percentage
- **Description:** Additional details, honors, coursework
- **Certificate:** Upload degree certificate (optional)

**5. Resume**
Upload your resume in PDF or DOC format. This will be shared with recruiters when you apply for jobs.

### Finding Jobs

#### Browse Jobs Page

**Search & Filter Options:**
- **Search Bar:** Search by job title, company name, or keywords
- **Location Filter:** Filter jobs by location
- **Job Type Filter:**
  - Full-time
  - Part-time  
  - Contract
  - Internship
  - Remote
- **Experience Level Filter:**
  - Entry Level
  - Mid Level
  - Senior Level
  - Lead

**Search automatically updates as you type** (300ms debounce for fast results)

#### Job Listing Information
Each job card displays:
- **Job Title**
- **Company Name**
- **Location**
- **Job Type** (Full-time, Remote, etc.)
- **Salary Range** (if provided)
- **Posted Date**
- **Required Skills** (up to 5 shown, with "+X more" indicator)
- **Save/Bookmark Button** (heart icon)
- **View Details Button**

#### Job Recommendations

CareerForge provides personalized job recommendations based on your profile skills:

**How It Works:**
1. Add skills to your profile
2. The system calculates a match score for each job based on your skills
3. Jobs are ranked by match percentage
4. View your personalized recommendations on the home page

**Match Score Calculation:**
- System compares your skills with job requirements and description
- Shows match percentage (e.g., "75% match")
- Green progress bar indicates match strength
- Jobs with 0% match are not shown

**Benefits:**
- Save time by seeing the most relevant jobs first
- Understand which jobs align with your skillset
- Focus applications on high-match opportunities

### Viewing Job Details

**Job Details Page Includes:**

**Overview Section:**
- Job Title
- Company Name
- Location
- Job Type badge
- Experience Level badge
- Remote indicator (if applicable)
- Posted date
- Salary range

**Main Content:**
- **Job Description:** Detailed role information
- **Requirements:** List of qualifications and skills needed
- **About the Company:** Company description and website link
- **Application Process:** 3-step visual guide
  1. Apply - Submit your application
  2. Review - Company reviews your application
  3. Interview - Schedule an interview

**Sidebar Information:**
- Job Type
- Salary Range
- Location
- Posted Date
- Experience Level
- Number of Positions Available
- Required Skills (extracted from requirements)

**Actions Available:**
- **Save Job:** Bookmark for later review
- **Apply Now:** Submit application (one-click)
- **Share Job:** Share via native share or copy link
- **Report Job:** Flag inappropriate postings

**Similar Jobs:**
See 3 related jobs from the same company or of similar type

### Applying for Jobs

**Application Process:**

1. **Click "Apply Now"** on job details page
2. **Login Check:** If not logged in, you'll be redirected to login
3. **Automatic Submission:** Your profile and resume are automatically sent
4. **Confirmation:** Success message appears
5. **Track Status:** View application in your dashboard

**Application Status Types:**
- **PENDING:** Application submitted, awaiting review
- **ACCEPTED:** Company accepted your application
- **REJECTED:** Application was not successful

**Important Notes:**
- You can only apply once per job
- Once applied, the button shows "Applied" with a checkmark
- Update your profile before applying to make the best impression
- Ensure your resume is up-to-date

### Saving Jobs

**How to Save Jobs:**
1. Click the **Bookmark icon** on any job card or job details page
2. The icon fills in to show it's saved
3. Access saved jobs from your dashboard or profile

**Why Save Jobs:**
- Review jobs later when you have more time
- Build a shortlist of positions you're interested in
- Compare multiple opportunities before applying

**Managing Saved Jobs:**
- View all saved jobs in the "Saved Jobs" tab on your dashboard
- Click the bookmark icon again to remove from saved jobs

### Dashboard

**Your Job Seeker Dashboard Shows:**

**Overview Tab:**
- **Applications:** Total number of applications submitted
- **Interviews:** Scheduled interviews
- **Saved Jobs:** Number of bookmarked positions
- **Profile Completion:** Percentage (with progress bar)
- **Recent Applications:** List of recent job applications
- **Upcoming Interviews:** Interview schedule with dates and times

**Applications Tab:**
- Track all your job applications
- See application status for each job
- Filter and sort applications

**Saved Jobs Tab:**
- Quick access to all bookmarked jobs
- Apply directly from saved jobs

**Messages Tab:**
- Future feature for communication with employers

### Profile Page

**Public Profile:**
- Share your public profile URL with recruiters
- Includes your bio, skills, experience, and education
- Optional: Add social media links (GitHub, LinkedIn, portfolio)

**Privacy:**
- Your contact information is only shared when you apply to jobs
- Control what information is visible on your public profile

---

## Recruiter Guide

### Posting a Job

**Step-by-Step Process:**

1. **Navigate to Post a Job:**
   - Click "Post a Job" on homepage (if recruiter role)
   - Or go to Employer menu → "Post Job"

2. **Fill in Job Details Section:**

   **Job Title*** (required)
   - Example: "Senior Frontend Developer"
   - Be specific and clear

   **Job Description*** (required)
   - Describe the role, responsibilities, and what makes the position exciting
   - Be detailed about day-to-day activities
   - Mention team structure and growth opportunities
   - Minimum 6 rows provided for detailed description

   **Requirements*** (required)
   - Enter each requirement on a **new line**
   - Examples:
     - "5+ years of React experience"
     - "Strong TypeScript skills"
     - "Experience with REST APIs"
   - Be specific with years of experience and technologies
   - System will extract technical skills automatically

   **Job Type*** (required)
   - Full-time
   - Part-time
   - Contract
   - Internship
   - Remote

   **Experience Level*** (required)
   - Entry Level: 0-2 years
   - Mid Level: 2-5 years  
   - Senior Level: 5-10 years
   - Lead: 10+ years

   **Location*** (required)
   - City and state/country
   - Or "Remote" for fully remote positions
   - Example: "San Francisco, CA" or "Remote"

   **Number of Positions** (optional)
   - Default: 1
   - Specify if hiring multiple people for same role

3. **Fill in Compensation Section:**

   **Currency** (default: USD)
   - USD ($)
   - EUR (€)
   - GBP (£)
   - INR (₹)

   **Minimum Salary** (optional)
   - Annual base salary minimum
   - Example: 80000

   **Maximum Salary** (optional)
   - Annual base salary maximum
   - Example: 120000

   **Note:** Salary is optional but highly recommended. Jobs with salary information get more applications.

4. **Submit:**
   - Click "Post Job" button
   - Job will be posted immediately
   - You'll be redirected to "Manage Jobs" page

**Best Practices:**
- Use clear, concise job titles
- Write comprehensive descriptions
- List specific requirements (not just "good communication skills")
- Include salary range to attract more candidates
- Update job postings regularly to keep them fresh
- Highlight unique benefits and company culture

### Managing Job Posts

**Access Your Jobs:**
- Navigate to Employer → "Manage Jobs"

**Job Management Options:**
- **View Applications:** See all applicants for a job
- **Edit Job:** Update job details (title, description, requirements, salary)
- **Delete Job:** Remove job posting
- **Toggle Active Status:** Activate/deactivate job posting

**Job Status:**
- **Active:** Job is visible to job seekers
- **Inactive:** Job is hidden from search results

### Reviewing Applications

**Access Applications:**
1. Go to "Manage Jobs"
2. Click on a job to view applicants
3. Or navigate to "Job Applicants" directly

**Application Information Shown:**
- **Applicant Name**
- **Email**
- **Applied Date**
- **Application Status**
- **Resume:** Download or view applicant's resume
- **Profile:** View complete candidate profile (skills, experience, education)

**Application Actions:**
- **Accept:** Move applicant forward in hiring process
- **Reject:** Decline application
- **Pending:** Keep for further review

**Application Status Guide:**
- **PENDING:** Newly submitted, awaiting your review
- **ACCEPTED:** You've approved this application
- **REJECTED:** Application declined

**Recruiter Dashboard:**
- Overview of all active jobs
- Total applications across all jobs
- Quick access to manage jobs and applications

---

## Company Guide

### Company Profile Setup

**Important:** Company users must complete their profile before recruiters can post jobs.

**Required Information:**

**Basic Details:**
- **Company Name*** (required, unique)
- **Description:** About your company, mission, culture
- **Website:** Company website URL
- **Location:** Headquarters or main office location
- **Industry:** Your business sector

**Branding:**
- **Logo:** Upload company logo (recommended for brand recognition)

**Company Size:**
- 1-10 employees
- 11-50 employees
- 51-200 employees
- 201-500 employees
- 501-1000 employees
- 1000+ employees

**How to Access:**
1. From Dashboard, click "Complete Company Profile"
2. Or navigate to Company → "Company Profile"
3. Fill in all details
4. Click "Save" or "Update Profile"

**Profile Completion:**
- Dashboard shows profile completion percentage
- Aim for 100% completion for better company visibility
- Complete profile increases recruiter trust

### Managing Recruiters

**Adding Recruiters:**

**Option 1: Invite Existing Users**
1. Go to Company → "Manage Recruiters"
2. Click "Add Recruiter" or "Invite Recruiter"
3. Enter recruiter's email (must be an existing CareerForge user with RECRUITER role)
4. Send invitation

**Option 2: User Creates Recruiter Account**
1. User registers with RECRUITER role
2. Company associates them via email or user ID

**Recruiter Permissions:**
Recruiters associated with your company can:
- Post jobs on behalf of your company
- Manage applications for jobs they posted
- Edit their own job postings
- View applicant information

**Recruiter Management:**
- View all recruiters on your team
- See recruiter details (name, email, join date, department)
- Remove recruiters if needed
- Track number of jobs posted by each recruiter

### Company Dashboard

**Dashboard Overview:**

**Key Metrics:**
1. **Active Jobs:** Number of currently open positions
2. **Total Applications:** All applications across all company jobs
3. **Recruiters:** Number of team members
4. **Profile Status:** Profile completion percentage

**Quick Actions:**
- **Complete Company Profile:** Update company information
- **Manage Recruiters:** Add or remove team members

**Setup Checklist:**
- ✓ Create your account
- ⚠️ Complete company profile (add details and logo)
- ⚠️ Invite recruiters (add team members who will post jobs)

**Note:** Company users cannot post jobs directly. You must assign recruiters to handle job postings.

---

## Features & Functionality

### Home Page

**For Non-Logged In Users:**
- Hero section with call-to-action
- "Find Your Dream Job or Top Talent" headline
- "Find Jobs" button → Browse job listings
- "Post a Job" button (for recruiters)
- **Featured Jobs Section:** Shows 6 latest jobs
- **How It Works:** 3-step process explanation
  1. Create a Profile
  2. Find Opportunities  
  3. Apply or Hire

**For Logged In Job Seekers:**
- Personalized welcome with profile card
- Profile summary (name, email, location, bio, skills preview)
- Quick stats (skills count, experience count, education count)
- **Featured Jobs:** First 6 jobs
- **Recommended Jobs:** Personalized matches based on skills
  - Match percentage badge
  - Match score progress bar
  - Only shows jobs with >0% match
- Edit Profile button

**For Companies:**
- Company Dashboard view
- Key metrics and stats
- Quick action buttons
- Setup checklist

### Job Search & Filtering

**Search Features:**
- **Real-time Search:** Results update as you type
- **Keyword Search:** Search by job title, company name, keywords
- **Location Filter:** Find jobs in specific locations
- **Job Type Filter:** Full-time, Part-time, Contract, Internship, Remote
- **Experience Level Filter:** Entry, Mid, Senior, Lead
- **Pagination:** 10 jobs per page with page navigation

**Search Tips:**
- Use specific keywords (e.g., "React Developer" instead of "Developer")
- Combine filters for precise results
- Save searches by bookmarking jobs
- Check "Recommended Jobs" for best matches

### Application Tracking

**For Job Seekers:**
- View all applications in one place
- See application status for each job
- Track interview schedules
- Application history with dates

**For Recruiters:**
- Manage all applications per job
- Update application status
- Download applicant resumes
- View applicant profiles

**Status Workflow:**
1. **PENDING:** Initial submission
2. **ACCEPTED:** Application approved → Interview stage
3. **REJECTED:** Application declined

### Company Profiles

**Public Company Page:**
- Accessible to all users
- Shows company information
- Lists all active jobs from that company
- Company description, website, location

**Benefits:**
- Job seekers can learn about companies before applying
- Increases company brand visibility
- Showcases company culture and values

### Saved Jobs

**Functionality:**
- Bookmark jobs for later review
- Quick access from dashboard
- Remove jobs from saved list anytime
- No limit on number of saved jobs

**Use Cases:**
- Building a job shortlist
- Comparing multiple opportunities
- Saving jobs to apply later
- Researching companies and roles

### Smart Job Recommendations

**How It Works:**

1. **Profile Analysis:** System analyzes your skills
2. **Job Matching:** Compares your skills with job requirements and descriptions
3. **Scoring:** Calculates match percentage for each job
4. **Ranking:** Sorts jobs by match score (highest first)
5. **Display:** Shows top 6 recommended jobs on home page

**Match Calculation:**
- Skills mentioned in job requirements: Higher weight
- Skills mentioned in job description: Medium weight
- Exact skill matches: Best score
- Partial skill matches: Good score
- No match: 0% (not shown)

**Benefits:**
- Discover relevant opportunities faster
- Understand job-fit before applying
- Increase application success rate
- Save time in job search

**Improving Recommendations:**
- Add more skills to your profile
- Be specific with skill names
- Include both technical and soft skills
- Keep skills updated as you learn new technologies

### Chatbot Assistant

**CareerForge Assistant Features:**

**How to Access:**
- Look for the "Chat" button in the bottom-right corner
- Click to open the chatbot window

**What the Chatbot Can Do:**

1. **Answer Questions About:**
   - Jobs and job listings
   - Companies and company information
   - Your applications and their status
   - How to use the platform
   - Account and profile help

2. **Interactive Features:**
   - Browse jobs directly in chat
   - View job details in preview
   - Check application statistics
   - Click to open jobs in new tab

3. **Sample Questions:**
   - "Show me jobs"
   - "What jobs are available?"
   - "Show my applications"
   - "What's my application status?"
   - "Tell me about [Company Name]"
   - "How do I apply for jobs?"
   - "What are the job requirements for [Job Title]?"

**Chat Interface:**
- Type your question in the input field
- Press Enter or click "Send"
- Receive instant responses
- Interactive job cards for easy browsing
- Minimize/maximize chat window anytime

**Response Types:**
- **Text Messages:** Answers to questions
- **Job Listings:** Browse jobs with company name, title, preview, and open links
- **Application Data:** Your application stats (total, pending, accepted, rejected)
- **Statistics:** Application metrics and insights

**Tips:**
- Ask specific questions for better results
- Use natural language - the bot understands context
- Click "Open" on job cards to view full details
- Login required for personal data (applications, saved jobs)

---

## FAQ

### General Questions

**Q: What is CareerForge?**
A: CareerForge is a full-stack job portal connecting job seekers with employers and companies. It offers features like job search, one-click applications, recruiter job posting, and AI-powered chatbot assistance.

**Q: Is CareerForge free to use?**
A: Yes, CareerForge is completely free for all users - job seekers, recruiters, and companies.

**Q: What makes CareerForge different from other job boards?**
A: CareerForge offers:
- Personalized job recommendations based on your skills
- Match percentage for each job
- One-click applications with profile auto-fill
- AI chatbot for instant help
- Integrated company and recruiter management
- Google OAuth for quick sign-up

### Account & Login

**Q: I forgot my password. How do I reset it?**
A: Click "Forgot password?" on the login page and follow the password reset process.

**Q: Can I change my email address?**
A: Email addresses are currently fixed at registration. Contact support if you need to change your email.

**Q: Can I have multiple accounts?**
A: Each email address can only have one account. However, you can update your role by contacting support.

**Q: Can I switch between roles (Job Seeker, Recruiter, Company)?**
A: Roles are set at registration. Contact support if you need to change your role.

**Q: What if I signed up with Google but want to add a password?**
A: OAuth accounts don't require passwords. You can always login with your Google account.

### For Job Seekers

**Q: How do I apply for a job?**
A: Simply click "Apply Now" on any job details page. If you're logged in, your application is automatically submitted with your profile and resume.

**Q: Can I apply to the same job multiple times?**
A: No, you can only apply once per job. Once applied, the button shows "Applied."

**Q: How do I know if my application was successful?**
A: You'll see a success message immediately. Check your dashboard to track application status.

**Q: What does "Match Percentage" mean?**
A: It shows how well your skills align with job requirements. Higher percentages mean better fit.

**Q: How can I improve my job recommendations?**
A: Add more relevant skills to your profile. The more accurate your skills, the better recommendations you'll receive.

**Q: Can I withdraw an application?**
A: Application withdrawal is not currently available. Contact the company directly if needed.

**Q: Do I need a resume to apply?**
A: While not strictly required, uploading a resume significantly improves your application chances.

**Q: How do I save a job for later?**
A: Click the bookmark icon on any job card or job details page.

**Q: Can companies see my profile without me applying?**
A: Your public profile is visible, but contact information is only shared when you apply.

### For Recruiters

**Q: How do I post a job?**
A: Go to Employer → Post Job, fill in job details, compensation, and requirements, then click "Post Job."

**Q: Can I edit a job after posting?**
A: Yes, go to "Manage Jobs," find your job, and click "Edit."

**Q: How do I see who applied to my job?**
A: Go to "Manage Jobs" and click on the job to view all applicants.

**Q: Can I post jobs for multiple companies?**
A: Recruiters are associated with one company. Contact the company admin to change your association.

**Q: What happens when I accept or reject an application?**
A: The application status updates and the job seeker can see the change in their dashboard.

**Q: Can I deactivate a job without deleting it?**
A: Yes, toggle the job's active status. Inactive jobs are hidden from search but data is preserved.

**Q: Is there a limit on how many jobs I can post?**
A: No, you can post unlimited jobs.

### For Companies

**Q: What's the difference between a Company and Recruiter account?**
A: Companies manage recruiters and overall recruitment strategy. Recruiters post jobs and handle applications. Company accounts cannot post jobs directly.

**Q: How do I add recruiters to my company?**
A: Go to Company → Manage Recruiters and invite users with RECRUITER role accounts.

**Q: Can I remove a recruiter?**
A: Yes, go to "Manage Recruiters" and remove them. Their posted jobs won't be deleted.

**Q: What happens to jobs if I remove a recruiter?**
A: Jobs remain active under your company. The recruiter loses access to manage those jobs.

**Q: Can I post jobs as a Company user?**
A: No, company users manage recruiters. Recruiters post jobs on behalf of the company.

**Q: How many recruiters can I have?**
A: No limit - add as many recruiters as needed for your hiring needs.

### Technical Questions

**Q: What browsers are supported?**
A: CareerForge works on all modern browsers: Chrome, Firefox, Safari, Edge.

**Q: Is there a mobile app?**
A: Not yet, but the website is fully responsive and works great on mobile browsers.

**Q: How is my data protected?**
A: We use industry-standard encryption, secure authentication (JWT), and follow best practices for data security.

**Q: Can I download my data?**
A: Contact support for data export requests.

**Q: What file formats are supported for resumes?**
A: PDF, DOC, and DOCX formats are supported.

**Q: How long do applications stay visible?**
A: Applications remain visible indefinitely unless deleted by recruiters or admins.

---

## Technical Information

### Tech Stack

**Frontend:**
- **React.js:** UI library
- **React Router:** Navigation and routing
- **Tailwind CSS:** Styling and responsive design
- **Lucide React:** Icon library
- **Redux Toolkit:** State management

**Backend:**
- **Node.js:** Runtime environment
- **Express.js:** Web framework
- **Passport.js:** Authentication middleware
- **Google OAuth 2.0:** Social authentication

**Database:**
- **PostgreSQL:** Relational database
- **Prisma ORM:** Type-safe database access

**Authentication:**
- **JWT:** JSON Web Tokens for session management
- **bcryptjs:** Password hashing
- **Express Session:** Session management

**Development Tools:**
- **Vite:** Frontend build tool
- **Nodemon:** Backend development server

### Database Schema

**User Model:**
- id (UUID, primary key)
- name, email (unique), password (optional for OAuth), role (enum)
- phone, bio, skills (array)
- resume, resumeOriginalName, profilePhoto
- OAuth fields: googleId (unique), provider, avatar
- Relations: employers, jobs created, applications, companies owned, experience, education, saved jobs

**Company Model:**
- id (UUID), name (unique), description, website, location, logo, industry
- companySize (enum), isActive
- Relations: owner, employers, jobs

**Employer Model:**
- Joins User and Company
- title, department, isActive, joinedAt
- Relations: user, company, jobs

**Job Model:**
- id, title, description, requirements (array)
- salaryMin, salaryMax, salaryCurrency, location
- jobType (enum), experienceLevel (enum), positions, isActive
- Relations: company, employer, creator, applications, saved by users

**Application Model:**
- id, status (enum: PENDING, ACCEPTED, REJECTED)
- appliedAt, updatedAt
- Relations: applicant (user), job

**WorkExperience Model:**
- jobTitle, company, location, employmentType
- startDate, endDate, currentlyWorking
- description, skillsUsed (array), certificate
- Relations: user

**Education Model:**
- degree, university, fieldOfStudy
- startYear, endYear, isPresent, grade
- description, certificate
- Relations: user

**Enums:**
- **Role:** USER, RECRUITER, COMPANY, ADMIN
- **CompanySize:** SIZE_1_10, SIZE_11_50, SIZE_51_200, SIZE_201_500, SIZE_501_1000, SIZE_1000_PLUS
- **JobType:** FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE
- **ExperienceLevel:** ENTRY, MID, SENIOR, LEAD
- **ApplicationStatus:** PENDING, ACCEPTED, REJECTED

### API Endpoints

**Authentication:**
- POST `/api/v1/users/register` - Register new user
- POST `/api/v1/users/login` - Login user
- GET `/api/v1/auth/google` - Google OAuth login

**Users:**
- GET `/api/v1/users/profile` - Get user profile (Protected)
- PUT `/api/v1/users/profile` - Update user profile (Protected)
- DELETE `/api/v1/users/:id` - Delete user (Admin only)
- GET `/api/v1/users/saved-jobs` - Get saved jobs
- POST `/api/v1/users/saved-jobs/:jobId` - Save a job
- DELETE `/api/v1/users/saved-jobs/:jobId` - Remove saved job

**Companies:**
- GET `/api/v1/companies` - Get all companies
- GET `/api/v1/companies/:id` - Get company by ID
- POST `/api/v1/companies` - Create company (Recruiter/Admin)
- PUT `/api/v1/companies/:id` - Update company (Recruiter/Admin)
- DELETE `/api/v1/companies/:id` - Delete company (Recruiter/Admin)

**Jobs:**
- GET `/api/v1/jobs` - Get all jobs (with search/filter params)
- GET `/api/v1/jobs/:id` - Get job by ID
- POST `/api/v1/jobs` - Create job (Recruiter/Admin)
- PUT `/api/v1/jobs/:id` - Update job (Recruiter/Admin)
- DELETE `/api/v1/jobs/:id` - Delete job (Recruiter/Admin)
- POST `/api/v1/jobs/:id/apply` - Apply to job (Protected)
- GET `/api/v1/jobs/:id/applications` - Get job applications (Recruiter/Admin)
- PATCH `/api/v1/jobs/applications/:applicationId` - Update application status (Recruiter/Admin)

### Environment Variables

**Backend (.env):**
```
NODE_ENV=development
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/careerforge
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend:**
- API Base URL: `http://localhost:5001/api/v1`
- OAuth Redirect: `http://localhost:5001/api/v1/auth/google`

---

## How to Apply for Jobs

This section provides a complete step-by-step guide for job seekers on how to find and apply for jobs on CareerForge.

### Step 1: Create and Complete Your Profile

**Why It's Important:**
Your profile is your digital resume. A complete profile increases your chances of getting hired.

**What to Include:**
1. **Personal Information:**
   - Full name
   - Email address
   - Phone number
   - Location
   - Professional bio (2-3 sentences about your expertise)
   - Profile photo (optional but recommended)

2. **Skills:** (CRITICAL for job recommendations)
   - Add all relevant technical skills (e.g., JavaScript, Python, React, SQL)
   - Include soft skills (e.g., Leadership, Communication, Project Management)
   - Be specific - use industry-standard terminology
   - Add 5-15 skills for best results

3. **Work Experience:**
   - List all relevant work experience
   - Include job title, company, dates, and description
   - Highlight key achievements and responsibilities
   - Add skills used in each role
   - Upload employment certificates (optional)

4. **Education:**
   - Add degrees and certifications
   - Include university, field of study, and dates
   - Mention GPA if it's strong
   - Upload degree certificates (optional)

5. **Resume:**
   - Upload a well-formatted PDF resume
   - Make sure it's up-to-date
   - Keep file size under 5MB
   - Use a clear, professional format

**How to Access Your Profile:**
- Click "Profile" in the navigation menu
- Or click "Edit Profile" from the home page

### Step 2: Browse Available Jobs

**Method 1: Browse All Jobs**
1. Click "Find Jobs" button on the home page
2. Or click "Jobs" in the navigation menu
3. Scroll through the job listings

**Method 2: Use Search & Filters**
1. Go to the Jobs page
2. Use the search bar to search by:
   - Job title (e.g., "Frontend Developer")
   - Company name (e.g., "Google")
   - Keywords (e.g., "React", "Remote")
3. Apply filters:
   - **Location:** Filter by city or "Remote"
   - **Job Type:** Full-time, Part-time, Contract, Internship, Remote
   - **Experience Level:** Entry, Mid, Senior, Lead
4. Click "Search Jobs" or just wait (auto-search enabled)

**Method 3: Check Personalized Recommendations**
1. Scroll to "Recommended Jobs for You" on home page
2. These jobs match your skills best
3. See match percentage for each job
4. Higher percentage = better fit

### Step 3: Review Job Details

**Before Applying, Review:**
1. **Job Title & Company:** Is this role right for you?
2. **Description:** Understand the responsibilities
3. **Requirements:** Do you meet the qualifications?
4. **Required Skills:** Match with your skillset
5. **Salary Range:** Within your expectations?
6. **Location:** Can you work from this location?
7. **Job Type:** Full-time, part-time, remote?
8. **Experience Level:** Does it match your experience?
9. **Company Info:** Learn about the employer

**Job Details Page Layout:**
- **Top:** Job title, company, location, type, and action buttons
- **Left Column:** 
  - Full job description
  - Detailed requirements list
  - About the company
  - Application process timeline
- **Right Sidebar:**
  - Job overview (type, salary, location, posted date)
  - Required skills
  - Share and save options
- **Bottom:** Similar jobs

### Step 4: Save Jobs for Later (Optional)

If you're not ready to apply immediately:

1. **Click the Bookmark Icon** (on job card or details page)
2. Icon fills in to show it's saved
3. **Access Saved Jobs:**
   - Dashboard → "Saved Jobs" tab
   - Or your Profile page

**Why Save Jobs:**
- Build a shortlist of positions
- Compare multiple opportunities
- Apply when you have time to review requirements
- Research companies before applying

### Step 5: Apply for the Job

**Quick Application Process:**

1. **Click "Apply Now"** button on job details page

2. **Login Check:**
   - If not logged in → Redirected to login page
   - After login → Redirected back to job page

3. **Automatic Submission:**
   - Your profile data is automatically sent
   - Your uploaded resume is attached
   - Application timestamp is recorded
   - Application status set to "PENDING"

4. **Confirmation:**
   - Success message appears on screen
   - "Apply Now" button changes to "Applied ✓"
   - Button becomes disabled (can't apply twice)

5. **What Happens Next:**
   - Recruiter receives your application
   - You can track status in your dashboard
   - Recruiter will review your profile and resume
   - Status updates to ACCEPTED or REJECTED

**Important Notes:**
- ✓ You can only apply **once per job**
- ✓ Application is **instant** - no forms to fill
- ✓ Your **latest profile data** is used
- ✓ Make sure your **resume is uploaded** 
- ✓ Update profile **before applying** for best impression

### Step 6: Track Your Applications

**Dashboard Application Tracking:**

1. **Go to Your Dashboard:**
   - Click "Dashboard" in navigation menu

2. **Overview Tab Shows:**
   - Total number of applications
   - Pending, accepted, rejected counts
   - Recent applications list

3. **Applications Tab:**
   - View all applications in one place
   - See details for each:
     - Job title and company
     - Application submission date
     - Current status (PENDING, ACCEPTED, REJECTED)

4. **Application Status Meanings:**
   - **PENDING:** Application submitted, awaiting recruiter review
   - **ACCEPTED:** Company is interested - expect interview contact
   - **REJECTED:** Unfortunately not selected for this role

**What to Do While Waiting:**
- Keep applying to other relevant jobs
- Update your profile if you learn new skills
- Check for new job recommendations regularly
- Save interesting jobs to apply later

### Step 7: Prepare for Next Steps

**If Application is ACCEPTED:**
1. **Check Your Email:** Recruiter may contact you
2. **Prepare for Interview:**
   - Research the company
   - Review the job requirements
   - Prepare questions to ask
   - Update your portfolio/projects
3. **Check Dashboard:** Look for interview schedules

**If Application is REJECTED:**
- Don't be discouraged - keep applying
- Review and update your profile
- Apply to other similar positions
- Consider adding new skills or certifications

**If Application is PENDING:**
- Be patient - review can take a few days
- Continue applying to other jobs
- Keep your profile updated
- Check dashboard regularly for status updates

### Tips for Successful Applications

**Profile Optimization:**
- ✓ Complete all profile sections (aim for 100%)
- ✓ Add at least 5-10 relevant skills
- ✓ Write a compelling bio (showcase your unique value)
- ✓ Upload a professional resume (PDF format)
- ✓ Keep information up-to-date
- ✓ Use industry-standard terminology

**Job Search Strategy:**
- ✓ Apply to jobs with 50%+ match score
- ✓ Read full job descriptions before applying
- ✓ Apply to 5-10 jobs per week
- ✓ Check "Recommended Jobs" daily
- ✓ Set aside time for job search daily
- ✓ Don't just apply - also save jobs to build pipeline

**Application Best Practices:**
- ✓ Tailor your profile to highlight relevant skills
- ✓ Apply early (jobs posted recently get more attention)
- ✓ Apply even if you don't meet 100% of requirements
- ✓ Use the chatbot for quick company/job information
- ✓ Follow up if status stays PENDING for >2 weeks

**Common Mistakes to Avoid:**
- ✗ Applying without uploading a resume
- ✗ Leaving profile incomplete
- ✗ Not reading job requirements
- ✗ Applying to too many unrelated jobs
- ✗ Not updating skills and experience
- ✗ Generic bio without personality

---

## Chatbot Guide

### Introduction to CareerForge Assistant

The CareerForge Assistant is an AI-powered chatbot designed to help you navigate the platform, find jobs, check applications, and get instant answers to your questions.

**Key Features:**
- 24/7 availability
- Instant responses
- Browse jobs without leaving chat
- Check application status
- Get platform help and guidance

### How to Use the Chatbot

**Opening the Chat:**
1. Look for the purple "Chat" button in the bottom-right corner
2. Click the button to open the chat window
3. The assistant greets you automatically

**Sending Messages:**
1. Type your question in the input field at the bottom
2. Press **Enter** or click the **"Send"** button
3. Wait for the assistant's response
4. Responses appear in white bubbles on the left

**Minimizing the Chat:**
- Click the **×** button in the top-right of the chat window
- Chat history is preserved when you reopen

### What You Can Ask

**Job Search Questions:**
- "Show me jobs"
- "What jobs are available?"
- "Find jobs for me"
- "Show remote jobs"
- "What React developer jobs are there?"
- "Jobs in San Francisco"

**Application Questions:**
- "Show my applications"
- "What's my application status?"
- "How many applications have I submitted?"
- "Did I get accepted anywhere?"
- "Show pending applications"

**Company Information:**
- "Tell me about [Company Name]"
- "What jobs does [Company Name] have?"
- "Show companies"

**Platform Help:**
- "How do I apply for jobs?"
- "How do I create a profile?"
- "What are the job requirements for [Job Title]?"
- "How does job matching work?"
- "What does match percentage mean?"

**Account Questions:**
- "How do I update my profile?"
- "How do I save jobs?"
- "Can I apply for the same job twice?"

### Understanding Chatbot Responses

**Response Types:**

**1. Text Responses:**
Simple text answers to your questions displayed in chat bubbles.

**2. Job Listings:**
When you ask about jobs, you get interactive job cards showing:
- Job title
- Company name
- "Open" link (opens job details page in new tab)
- "Preview" button (shows quick job info in chat)

**3. Application Data:**
When you ask about applications, you see:
- Job title and company for each application
- Application status (PENDING, ACCEPTED, REJECTED)
- Submission date

**4. Application Statistics:**
Summary of your applications:
- Total applications submitted
- Pending applications
- Accepted applications
- Rejected applications

### Chatbot Tips & Tricks

**Best Practices:**
- ✓ Use natural language - no need for keywords
- ✓ Ask specific questions for better results
- ✓ Be clear and concise
- ✓ One question at a time for clarity
- ✓ Click "Open" on job cards to see full details

**What the Chatbot Can Do:**
- ✓ Search and filter jobs
- ✓ Display your application history
- ✓ Provide application statistics
- ✓ Answer common questions
- ✓ Guide you through platform features
- ✓ Show company information

**What the Chatbot Cannot Do:**
- ✗ Submit applications (use "Apply Now" on job page)
- ✗ Edit your profile (go to Profile page)
- ✗ Delete applications
- ✗ Contact recruiters directly
- ✗ Reset passwords

**Sample Conversations:**

**Example 1: Finding Jobs**
```
You: Show me jobs
Bot: Here are some roles for you:
     [Job cards with titles, companies, and links]

You: Tell me more about the Frontend Developer job
Bot: [Job details including company and requirements]
```

**Example 2: Checking Applications**
```
You: What's my application status?
Bot: Your applications:
     - Frontend Developer at TechCorp - Status: PENDING
     - Backend Engineer at StartupXYZ - Status: ACCEPTED
     
You: How many applications are pending?
Bot: Your application stats:
     Total: 5
     Pending: 3
     Accepted: 1
     Rejected: 1
```

**Example 3: Getting Help**
```
You: How do I apply for jobs?
Bot: To apply for jobs:
     1. Browse jobs on the Jobs page
     2. Click on a job to view details
     3. Click "Apply Now" button
     Your profile and resume are automatically submitted!
```

### Troubleshooting

**Chatbot Not Responding:**
- Check your internet connection
- Refresh the page
- Try closing and reopening the chat
- Make sure you're logged in (for personal data)

**"Failed to fetch" Error:**
- You may need to log in
- Check internet connection
- Try refreshing the page

**No Jobs Shown:**
- There may be no jobs matching your query
- Try asking "Show me all jobs"
- Check the Jobs page directly

**Login Required Message:**
- Some features (applications, saved jobs) require login
- Log in and try again

### Privacy & Data

**What the Chatbot Knows:**
- Your profile information (when logged in)
- Your applications (when logged in)
- Public job listings
- Public company information

**What the Chatbot Doesn't Store:**
- Passwords
- Payment information (none collected)
- Private messages to recruiters

**Data Security:**
- All chatbot interactions are secure
- No personal data is shared with third parties
- Login required for personal application data

---

## Additional Information

### Profile Visibility

**Public Information:**
- Name
- Bio
- Skills
- Work experience
- Education
- Profile photo

**Private Information (shared only when you apply):**
- Email address
- Phone number
- Resume file
- Full contact details

**Controlling Visibility:**
- Complete profile sections to increase discoverability
- Keep profile updated for accurate job matches
- Optional: Add social media links (GitHub, LinkedIn, portfolio URL)

### Job Posting Guidelines for Recruiters

**Do:**
- ✓ Write clear, specific job titles
- ✓ Provide detailed job descriptions
- ✓ List specific requirements and qualifications
- ✓ Include salary range (improves application rate)
- ✓ Mention remote work options
- ✓ Highlight company culture and benefits
- ✓ Update job posts regularly
- ✓ Respond to applications promptly

**Don't:**
- ✗ Use vague job titles (e.g., "Ninja" or "Rockstar")
- ✗ Copy-paste generic descriptions
- ✗ List every possible skill as "required"
- ✗ Hide important details (location, salary, job type)
- ✗ Post duplicate jobs
- ✗ Leave jobs active when position is filled

### Application Status Guide

**For Job Seekers:**

**PENDING:**
- Your application was successfully submitted
- Recruiter has not yet reviewed it
- Typical review time: 3-7 business days
- No action needed from you

**ACCEPTED:**
- Company is interested in moving forward
- Expect contact via email or phone
- Prepare for potential interview
- Research the company and role

**REJECTED:**
- Application was not successful for this role
- Keep applying to other positions
- Update profile and try again
- Don't take it personally - keep going!

**For Recruiters:**

**Use PENDING when:**
- Application just received
- Waiting to review candidate
- Need more time for decision
- Shortlisting candidates

**Use ACCEPTED when:**
- Candidate meets requirements
- Moving to interview stage
- Ready to contact candidate
- Serious interest in hiring

**Use REJECTED when:**
- Candidate doesn't meet requirements
- Position filled
- Not moving forward with candidate
- Clear decision made

### Security & Privacy

**Account Security:**
- Use strong passwords (8+ characters, mix of letters, numbers, symbols)
- Don't share your password
- Log out on shared computers
- Use Google OAuth for added security

**Data Protection:**
- All passwords are encrypted (bcryptjs)
- Secure database storage (PostgreSQL)
- JWT tokens for authentication
- HTTPS encryption (in production)

**Privacy Policy Highlights:**
- Your data is never sold to third parties
- Email used only for notifications and support
- Profile data shared only when you apply
- You control what's visible on your public profile

### Platform Limitations

**Current Limitations:**
- No direct messaging between users and recruiters yet
- No advanced resume builder (planned feature)
- No ATS resume checker (planned feature)
- No email notifications for application status changes (planned)
- No interview scheduling tool (planned)
- No mobile app (web-only, but responsive)

**Workarounds:**
- Check dashboard regularly for status updates
- Save company websites to contact them directly
- Use external resume builders for now
- Add CareerForge to phone home screen for app-like experience

### Future Enhancements

**Coming Soon:**
- Real-time chat between job seekers & recruiters
- Email notifications for application updates
- Advanced resume builder with templates
- ATS resume checker and optimization
- LinkedIn & GitHub API integration
- Analytics dashboard for companies
- Interview scheduling integration
- Video interview support
- Skill assessments and tests
- Job alerts based on preferences

### Getting Help

**Support Options:**
1. **Use the Chatbot:** Quick answers to common questions
2. **Check FAQ:** Most questions answered here
3. **Contact Support:** (contact method to be added)

**Reporting Issues:**
- Report inappropriate job postings using "Report Job" button
- Report bugs or issues to support team
- Suggest features for future releases

### Best Practices Summary

**For Job Seekers:**
1. Complete your profile 100%
2. Add 5-15 relevant skills
3. Upload a professional resume
4. Check recommended jobs daily
5. Apply to 5-10 jobs per week
6. Track applications in dashboard
7. Update profile as you learn new skills

**For Recruiters:**
1. Write detailed job descriptions
2. Include salary ranges
3. List specific requirements
4. Respond to applications within 1 week
5. Keep job postings updated
6. Use appropriate job types and experience levels
7. Provide feedback to candidates when possible

**For Companies:**
1. Complete company profile with logo
2. Write compelling company description
3. Add company website
4. Recruit quality recruiters
5. Monitor overall recruitment metrics
6. Maintain updated company information

---

## Conclusion

CareerForge is designed to make job search and recruitment simple, efficient, and effective. Whether you're a job seeker looking for your next opportunity, a recruiter posting jobs, or a company managing your hiring team, CareerForge provides all the tools you need.

**Key Takeaways:**
- **Job Seekers:** Complete your profile, use job recommendations, apply with one click
- **Recruiters:** Post detailed jobs, manage applications, update status promptly  
- **Companies:** Build your team, manage recruiters, oversee recruitment

**Getting the Most Out of CareerForge:**
1. Keep your profile updated
2. Use filters and search effectively
3. Leverage the chatbot for quick help
4. Track applications regularly
5. Engage with the platform consistently

**Need More Help?**
- Use the CareerForge Assistant chatbot (bottom-right corner)
- Check the FAQ section
- Contact support for additional assistance

**Happy job hunting and happy hiring!** 🚀

---

*This documentation is maintained for LLM training and user assistance. For the latest updates and features, check the platform directly.*
