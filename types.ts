
export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYER = 'Employer',
  FACILITATOR = 'Facilitator',
  LEARNER = 'Learner',
  GUEST = 'Guest',
}

export interface User {
  id: string;  // Changed from number to string for UUID
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Company {
    id: number;
    name: string;
    description: string;
    website: string;
    owner: string;  // Changed to string for UUID reference
}

export interface Course {
    id: number;
    title: string;
    description: string;
    facilitator: string;  // Changed to string for UUID reference
    enrollment_capacity: number;
    start_date: string;
    end_date: string;
}

export interface Job {
    id: number;
    title: string;
    description: string;
    company: Company;
    location: string;
    job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
    posted_at: string;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    reward_amount: string;
    status: 'Open' | 'In Progress' | 'Completed' | 'Closed';
    created_at: string;
}

export interface Wallet {
    id: number;
    user: string;  // Changed to string for UUID reference
    balance: string;
}

export interface Transaction {
    id: number;
    wallet: number;
    amount: string;
    transaction_type: 'Deposit' | 'Withdrawal' | 'Reward';
    timestamp: string;
}

export interface Submission {
    id: number;
    task: number;
    user: string;  // Changed to string for UUID reference
    submission_content: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    submitted_at: string;
}
