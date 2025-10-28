import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { useUI } from '../contexts/UIContext';

// Pages
import LandingPage from '../pages/LandingPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import LearnerDashboard from '../pages/dashboard/LearnerDashboard';
import EmployerDashboard from '../pages/dashboard/EmployerDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import FacilitatorDashboard from '../pages/dashboard/FacilitatorDashboard';
import JobListPage from '../pages/dashboard/jobs/JobListPage';
import CourseListPage from '../pages/dashboard/courses/CourseListPage';
import TaskListPage from '../pages/dashboard/earn/TaskListPage';
import WalletPage from '../pages/dashboard/earn/WalletPage';

const AuthRedirect = ({ page }: { page: 'login' | 'register' }) => {
  const { openAuthModal, isAuthModalOpen } = useUI();

  useEffect(() => {
    // Only open modal if it's not already open
    if (!isAuthModalOpen) {
      openAuthModal(page);
    }
  }, [openAuthModal, page, isAuthModalOpen]);

  return <LandingPage />;
};

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-background dark:bg-dark-background">Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const RoleBasedRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
  const { role, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-background dark:bg-dark-background">Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

const DashboardRedirect = () => {
  const { role, isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Use user.role directly from the API response
  const actualRole = user?.role || role;

  // Redirect to role-specific dashboard routes
  switch (actualRole) {
    case UserRole.ADMIN:
    case 'Admin':
      return <Navigate to="/dashboard/admin" replace />;
    case UserRole.EMPLOYER:
    case 'Employer':
      return <Navigate to="/dashboard/employer" replace />;
    case UserRole.FACILITATOR:
    case 'Facilitator':
      return <Navigate to="/dashboard/facilitator" replace />;
    case UserRole.LEARNER:
    case 'Learner':
    default:
      return <Navigate to="/dashboard/learner" replace />;
  }
}

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthRedirect page="login" />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthRedirect page="register" />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Role-specific Dashboard Routes */}
            <Route element={<RoleBasedRoute allowedRoles={[UserRole.LEARNER]} />}>
              <Route path="/dashboard/learner" element={<LearnerDashboard />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={[UserRole.EMPLOYER]} />}>
              <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={[UserRole.FACILITATOR]} />}>
              <Route path="/dashboard/facilitator" element={<FacilitatorDashboard />} />
            </Route>

            <Route element={<RoleBasedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Route>

            {/* Shared Routes for Learners and Admins */}
            <Route element={<RoleBasedRoute allowedRoles={[UserRole.LEARNER, UserRole.ADMIN]} />}>
              <Route path="/dashboard/jobs" element={<JobListPage />} />
              <Route path="/dashboard/courses" element={<CourseListPage />} />
              <Route path="/dashboard/earn/tasks" element={<TaskListPage />} />
              <Route path="/dashboard/earn/wallet" element={<WalletPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRouter;