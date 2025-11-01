# CareerForge - Role System Guide

## Overview
CareerForge uses a role-based access control system with three distinct roles defined in the Prisma schema.

## Available Roles

### 1. USER (Job Seeker) 👤
**Default role assigned during signup**

**Capabilities:**
- Browse and search for job listings
- Apply to job postings
- Manage application status
- Create and update personal profile
- Upload resume and add skills
- View company profiles

**Use Case:** Individuals looking for job opportunities

---

### 2. RECRUITER (Employer) 💼
**Can be selected during signup**

**Capabilities:**
- All USER capabilities, plus:
- Post new job listings (when associated with a company)
- Edit and manage posted jobs
- View job applications
- Accept/reject applicants
- Must be authorized by a Company to post jobs

**Use Case:** HR professionals, recruiters, hiring managers who work for companies

**Note:** Recruiters need to be added to a Company by a COMPANY role user before they can post jobs.

---

### 3. COMPANY (Company Manager) 🏢
**Can be selected during signup - NEW ROLE**

**Capabilities:**
- Create and manage company profile
- Authorize and manage recruiters
- Oversee all job postings from the company
- Full control over company data
- Assign recruiters to the company
- All RECRUITER capabilities for their own company

**Use Case:** Company owners, HR directors, or managers who need to:
- Set up their company on the platform
- Control who can post jobs on behalf of the company
- Maintain company branding and information
- Oversee recruitment process

**Workflow:**
1. COMPANY user registers and creates company profile
2. COMPANY user invites/authorizes RECRUITERs to join their company
3. RECRUITERs can then post jobs on behalf of the company
4. COMPANY user maintains oversight and control

---

### 4. ADMIN 🛡️
**Cannot be selected during signup - Assigned only by existing admins**

**Capabilities:**
- Full platform access
- Manage all users, companies, and jobs
- Moderate content
- View platform analytics
- Assign/revoke roles

**Use Case:** Platform administrators and moderators

---

## Registration Flow

### During Signup
Users can choose between:
1. **Job Seeker (USER)** - Default option - For individuals seeking employment
2. **Recruiter (RECRUITER)** - For HR professionals who will work under a company
3. **Company (COMPANY)** - For company owners/managers who will manage recruiters

The ADMIN role is **not available** during public registration for security reasons.

### Frontend Implementation
- Enhanced role selection UI with icons and descriptions
- Visual feedback showing selected role
- Clear explanation of each role's purpose

### Backend Validation
- Only `USER`, `RECRUITER`, and `COMPANY` roles accepted during registration
- Invalid roles default to `USER`
- ADMIN role can only be assigned via direct database update or admin panel

---

## Technical Details

### Prisma Schema Enum
```prisma
enum Role {
  USER
  RECRUITER
  COMPANY
  ADMIN
}
```

### Company Ownership
```prisma
model Company {
  id          String   @id @default(uuid())
  name        String   @unique
  // ... other fields
  
  // Relations
  ownerId     String?
  owner       User?    @relation("CompanyOwner", fields: [ownerId], references: [id])
  employers   Employer[]
  jobs        Job[]
}
```

A COMPANY role user can own and manage a Company, which then has multiple Employer relationships (RECRUITERs).

### Database Field
```prisma
role Role @default(USER)
```

### API Endpoints

#### Register with Role
```bash
POST http://localhost:5001/api/v1/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "COMPANY"  // Optional: USER, RECRUITER, or COMPANY
}
```

**Examples:**
- Job Seeker: `"role": "USER"` (default)
- Individual Recruiter: `"role": "RECRUITER"`
- Company Manager: `"role": "COMPANY"`

#### Login
```bash
POST http://localhost:5001/api/v1/users/login
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Port Configuration:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001`
- (Port 5000 avoided due to macOS AirPlay conflict)

Returns user object with role information and JWT token.

---

## Security Considerations

1. **Role Validation**: Backend validates and sanitizes role input
2. **Default Fallback**: Invalid roles automatically default to USER
3. **Admin Protection**: ADMIN role cannot be set via public API
4. **JWT Token**: User role is embedded in authentication token
5. **Password Excluded**: User passwords never returned in API responses

---

## Company Management Workflow

### For COMPANY Role Users:

1. **Register as COMPANY**
   - Select "Company" during signup
   - Complete registration

2. **Create Company Profile**
   - Add company name, description, website
   - Upload logo
   - Set location and industry
   - Specify company size

3. **Manage Recruiters**
   - Invite recruiters (RECRUITER role users) to join your company
   - Approve/remove recruiters
   - Monitor job postings by your recruiters

4. **Post Jobs** (if needed)
   - COMPANY users can also directly post jobs
   - Or delegate to authorized recruiters

### For RECRUITER Role Users:

1. **Register as RECRUITER**
   - Select "Recruiter" during signup

2. **Join a Company**
   - Wait for COMPANY user to add you
   - Or request to join an existing company

3. **Post Jobs**
   - Once associated with a company, post job listings
   - Manage applications for your posted jobs

---

## Future Enhancements

- Role switching/upgrade requests
- Company verification system
- Premium recruiter features
- Role-based rate limiting
- Admin dashboard for role management
- Recruiter invitation system via email
- Company analytics dashboard

---

## Related Files

- **Schema**: `/backend/prisma/schema.prisma`
- **Controller**: `/backend/src/controllers/user.controller.js`
- **Frontend Form**: `/frontend/src/pages/auth/Register.jsx`
- **Auth Slice**: `/frontend/src/store/slices/auth/authSlice.js`
