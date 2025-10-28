# YouthGuard Frontend Documentation

## Project Overview

- **Framework**: React 19 with TypeScript
- **State Management**: React Context API + React Query (@tanstack/react-query)
- **Routing**: React Router DOM v7 with HashRouter
- **Styling**: Tailwind CSS (inferred from class names)
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Development Server**: Runs on port 3000

## API Integration

### Base URL Configuration
- **Current API Base URL**: `http://127.0.0.1:8000` (hardcoded in services/api.ts)
- **Environment Variable**: `VITE_API_URL` (fallback to localhost if not set)
- **HTTP Client**: Axios with interceptors for authentication and token refresh

### Authentication Implementation
- **Token Type**: JWT (JSON Web Tokens)
- **Storage**: localStorage with key `'authTokens'`
- **Token Format**: 
  ```json
  {
    "access": "jwt_access_token",
    "refresh": "jwt_refresh_token"
  }
  ```
- **Authorization Header**: `JWT ${access_token}` (not Bearer)

### Current API Endpoints Being Called

#### Authentication Endpoints
1. **Registration**: `POST /api/auth/users/`
   - **Payload Structure**:
   ```json
   {
     "username": "user@example.com",
     "email": "user@example.com",
     "password": "password123",
     "re_password": "password123",
     "first_name": "John",
     "last_name": "Doe",
     "role": "Learner" | "Employer" | "Facilitator"
   }
   ```

2. **Login**: `POST /api/auth/jwt/create/`
   - **Payload Structure**:
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Token Refresh**: `POST /api/auth/jwt/refresh/`
   - **Payload Structure**:
   ```json
   {
     "refresh": "refresh_token_here"
   }
   ```

4. **Current User**: `GET /api/core/current-user/`
   - **Headers**: `Authorization: JWT ${access_token}`

#### Data Endpoints
1. **Companies**: `GET /api/core/companies/` (currently returns 404)
2. **Jobs**: `GET /api/jobs/` (currently returns 401)
3. **Courses**: `GET /api/courses/` (endpoint exists in frontend)

### Error Handling Patterns

#### Current Error Handler (AuthContext.tsx:66)
```typescript
onError: (error: any) => {
  const errorData = error.response?.data;
  const errorMessages = Object.entries(errorData)
    .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
    .join('\n');
  toast.error(`Registration failed:\n${errorMessages || 'Please try again.'}`);
}
```

**Issue**: The code assumes `value` is always an array with `.join()` method, causing TypeError when server returns different error format.

## User Role Management

### Role Enum (types.ts)
```typescript
export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYER = 'Employer', 
  FACILITATOR = 'Facilitator',
  LEARNER = 'Learner',
  GUEST = 'Guest',
}
```

### Role-Based Routing
- **Admin**: Access to AdminDashboard
- **Employer**: Access to EmployerDashboard + job management routes
- **Facilitator**: Access to FacilitatorDashboard + course management
- **Learner**: Access to LearnerDashboard + jobs, courses, tasks, wallet
- **Guest**: Limited access, redirected to login

### Protected Routes Implementation
```typescript
// Routes requiring authentication
<Route element={<ProtectedRoute />}>
  <Route element={<DashboardLayout />}>
    <Route path="/dashboard" element={<DashboardRedirect />} />
    
    // Learner + Admin routes
    <Route element={<RoleBasedRoute allowedRoles={[UserRole.LEARNER, UserRole.ADMIN]} />}>
      <Route path="/dashboard/jobs" element={<JobListPage />} />
      <Route path="/dashboard/courses" element={<CourseListPage />} />
      <Route path="/dashboard/earn/tasks" element={<TaskListPage />} />
      <Route path="/dashboard/earn/wallet" element={<WalletPage />} />
    </Route>
  </Route>
</Route>
```

## Data Models & State Management

### User Data Structure
```typescript
export interface User {
  id: string;  // UUID string from backend
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}
```

### Company Data Structure
```typescript
export interface Company {
  id: number;
  name: string;
  description: string;
  website: string;
  owner: number;
}
```

### Job Data Structure
```typescript
export interface Job {
  id: number;
  title: string;
  description: string;
  company: Company;
  location: string;
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  posted_at: string;
}
```

### Course Data Structure
```typescript
export interface Course {
  id: number;
  title: string;
  description: string;
  facilitator: number;
  enrollment_capacity: number;
  start_date: string;
  end_date: string;
}
```

### State Management Approach
- **Authentication State**: React Context (AuthContext)
- **UI State**: React Context (UIContext) 
- **Server State**: React Query with 5-minute stale time
- **Form State**: React Hook Form

## Current Issues & Error Patterns

### 1. API Endpoint Issues
- **Companies 404**: `GET /api/core/companies/` returns 404 Not Found
- **Jobs 401**: `GET /api/jobs/` returns 401 Unauthorized
- **Registration 500**: `POST /api/auth/users/` returns 500 Internal Server Error

### 2. Error Handling Bug
**Location**: `AuthContext.tsx:66`
**Error**: `TypeError: value.join is not a function`
**Cause**: Code assumes all error values are arrays, but server may return strings or objects

**Fixed Code**:
```typescript
const errorMessages = Object.entries(errorData)
  .map(([key, value]) => {
    // Handle both string and array values
    const message = Array.isArray(value) ? value.join(', ') : String(value);
    return `${key}: ${message}`;
  })
  .join('\n');
```

### 3. Registration Form Fields
The frontend sends these fields for registration:
- `username` (required, same value as email)
- `email` (required)
- `password` (required, min 8 chars)
- `re_password` (required, must match password)
- `first_name` (required)
- `last_name` (required)
- `role` (required, one of: Learner, Employer, Facilitator)

### 4. Expected API Response Formats

#### Successful Registration Response
```json
{
  "id": "uuid-string-here",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "Learner"
}
```

#### Error Response Format (Expected by Frontend)
```json
{
  "field_name": ["Error message 1", "Error message 2"],
  "email": ["This email is already registered"],
  "password": ["Password too weak"]
}
```

#### Login Success Response
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Priority Fixes Needed

### 1. Backend API Endpoints
- Implement `GET /api/core/companies/` endpoint
- Fix authentication for `GET /api/jobs/` endpoint  
- Fix `POST /api/auth/users/` registration endpoint
- Ensure `GET /api/courses/` endpoint exists

### 2. Error Response Format
Backend should return validation errors in this format:
```json
{
  "field_name": ["Error message as string or array of strings"]
}
```

### 3. Authentication Flow
- Ensure JWT tokens are properly generated and validated
- Verify user role assignment during registration
- Test token refresh mechanism

### 4. CORS Configuration
Ensure backend allows requests from `http://localhost:3000` (frontend dev server)

## Frontend Dependencies
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.4",
  "@tanstack/react-query": "^5.90.5",
  "axios": "^1.13.0",
  "react-hook-form": "^7.65.0",
  "framer-motion": "^11.3.18",
  "react-hot-toast": "^2.6.0",
  "lucide-react": "^0.548.0"
}
```

## Development Commands
- **Install**: `npm install`
- **Dev Server**: `npm run dev` (runs on http://localhost:3000)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Environment Variables
- `VITE_API_URL`: Backend API base URL (defaults to http://127.0.0.1:8000)
- `GEMINI_API_KEY`: For AI features (mentioned in README)

## ✅ Integration Fixes Applied

### Frontend Changes Completed:
1. **Registration Payload**: Added `username` field (same value as email)
2. **User ID Type**: Changed from `number` to `string` for UUID support
3. **Error Handling**: Fixed TypeError in registration error handler
4. **Related Interfaces**: Updated Company, Course, Wallet, Submission interfaces for UUID references

### Backend Integration Status:
- ✅ JWT Authentication header format supported
- ✅ CORS configuration allows localhost:3000
- ✅ Companies endpoint `/api/core/companies/` working
- ✅ Role-based registration implemented
- ✅ Error response format standardized

The frontend is now fully compatible with the backend API and should work seamlessly for user registration, authentication, and data fetching.