# 💼 HireMeHub – MERN Job Application Portal

## 🧭 Project Overview
**HireMeHub** is a full-stack job application portal built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
The platform connects **job seekers** and **employers**, allowing candidates to apply for jobs and employers to post listings — all within a secure, verified environment.

The project aims to simulate a real-world job recruitment system, showcasing user authentication, role-based access, form handling, data visualization, and responsive UI design.

---

## 🚀 Key Features / Modules
### 👤 Authentication & Authorization
- JWT-based login and registration for job seekers, employers, and admins.
- Role-based route protection on both frontend and backend.
- Email verification for all users.

### 🧾 Job Management (Employers)
- Post, edit, and delete job listings.
- View and manage applicant details.
- Track total applications per job.

### 📄 Application Management (Job Seekers)
- Apply for jobs with a resume and cover letter.
- Track application status (applied, shortlisted, rejected).
- Manage personal profile and uploaded resume.

### 🔍 Smart Job Search
- Search jobs by title, company, skills, or location.
- Filter by salary, employment type, and posting date.
- Pagination and sorting for better performance.

### 🧑‍💼 Employer Verification
- Automatic domain validation (only business emails allowed).
- Admin review for document verification.
- Verified employers receive a ✅ badge before posting jobs.

### 🧰 Admin Dashboard
- Manage users, jobs, and applications.
- Approve or reject employer verifications.
- System analytics (optional).

### 📨 Notifications & Emails
- Email notifications on application submission and employer response.
- Optional real-time updates using Socket.io.

---

## 👥 User Roles
| Role | Permissions / Capabilities |
|------|-----------------------------|
| **Job Seeker** | Register, browse & apply for jobs, manage profile, track applications |
| **Employer** | Register, post/edit/delete jobs, view applicants, manage company profile |
| **Admin** | Manage users and jobs, verify employers, control system settings |

---

## 🖥️ Page / Screen List (Frontend)
### 🔑 Authentication
- Login / Signup
- Email Verification Page
- Forgot Password (optional)

### 🏠 Public Pages
- Landing Page
- Job Listing Page
- Job Details Page
- About / Contact

### 👤 Job Seeker Dashboard
- My Profile
- Applied Jobs
- Application Status Tracker

### 💼 Employer Dashboard
- Post New Job
- Manage Job Listings
- View Applicants

### 🧑‍💻 Admin Panel
- Employer Verification Requests
- Manage Users & Jobs
- System Overview (Stats)

---

## 🗃️ Database Schema (Rough Draft)

### **1. users**
| Field | Type | Description |
|--------|------|-------------|
| `_id` | ObjectId | Primary key |
| `name` | String | Full name |
| `email` | String | Unique, used for login |
| `password` | String | Hashed using bcrypt |
| `role` | String | 'seeker', 'employer', 'admin' |
| `verified` | Boolean | Email verified or not |
| `companyName` | String | (For employers only) |
| `isApproved` | Boolean | Admin-approved employer |
| `resumeUrl` | String | (For seekers only) |

### **2. jobs**
| Field | Type | Description |
|--------|------|-------------|
| `_id` | ObjectId | Primary key |
| `title` | String | Job title |
| `description` | String | Job description |
| `location` | String | City or remote |
| `salaryRange` | String | Optional |
| `tags` | [String] | Skills/keywords |
| `createdBy` | ObjectId (User) | Employer reference |
| `applications` | [ObjectId] | Array of Application IDs |
| `createdAt` | Date | Timestamp |

### **3. applications**
| Field | Type | Description |
|--------|------|-------------|
| `_id` | ObjectId | Primary key |
| `jobId` | ObjectId | Reference to job |
| `applicantId` | ObjectId | Reference to seeker |
| `resumeUrl` | String | Cloud link |
| `coverLetter` | String | Short intro |
| `status` | String | 'applied', 'shortlisted', 'rejected' |
| `appliedAt` | Date | Timestamp |

---

## 🧰 Tech Stack (Tentative)

| Layer | Technology |
|--------|-------------|
| **Frontend** | React.js, TailwindCSS, React Router, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT, bcrypt.js |
| **Email / File Storage** | Nodemailer, Cloudinary |
| **Hosting** | Frontend: Vercel / Netlify<br>Backend: Render / Railway<br>Database: MongoDB Atlas |
| **Optional Add-ons** | Socket.io (real-time updates), Chart.js (analytics) |

---

## 🔄 Workflow (User Interaction Flow)
1. **Signup/Login** as Job Seeker or Employer  
2. **Job Seeker:**
   - Browse job listings  
   - Apply for a job → upload resume  
   - Track application status  
3. **Employer:**
   - Register using business email  
   - Submit company verification → wait for admin approval  
   - Post jobs and view applicants  
4. **Admin:**
   - Review employer verification requests  
   - Approve or reject based on uploaded documents  
   - Manage all users and job postings

---

## 🎯 Expected Outcomes
By the end of this project, I aim to:
- Deliver a **fully functional MERN job portal** with secure authentication and database integration.  
- Showcase **role-based access control**, **email verification**, and **CRUD operations**.  
- Implement a **modern UI/UX** using TailwindCSS.  
- Demonstrate understanding of **real-world workflows** (verification, search, dashboards).  
- Deploy the project live and maintain a public GitHub repository with detailed documentation.

---

## 🧠 Future Enhancements
- AI-based job recommendations based on skills and resume.
- Chat system between employers and seekers.
- Admin analytics dashboard with data visualization.
- Resume parsing using external APIs.
- Two-factor authentication for better security.

---

## 🧩 Author
**Aditya Singh**  
_B.Tech CSE, Newton School of Technology_  
📧 [your-email@example.com]  
💻 GitHub: [github.com/yourusername]  
🌐 Portfolio: [your-portfolio-link]

---

> _“A platform that empowers job seekers and employers alike — built to reflect real-world recruitment systems using full-stack development principles.”_
