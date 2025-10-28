import React from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../contexts/UIContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserRole } from '../../types';

const AuthForm = ({ isRegister = false }: { isRegister?: boolean }) => {
  const { login, register: registerUser } = useAuth();
  const { setAuthModalState } = useUI();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (data: any) => {
    if (isRegister) {
      const userData = {
        ...data,
        username: data.email,  // Add username field using email value
        re_password: data.confirmPassword
      };
      delete userData.confirmPassword;
      await registerUser(userData);
    } else {
      await login(data);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-center mb-2 text-foreground dark:text-dark-foreground">
        {isRegister ? 'Create Account' : 'Welcome Back'}
      </h2>
      <p className="text-center text-muted-foreground dark:text-dark-muted mb-6">
        {isRegister ? 'Join YouthGuard to start your journey.' : 'Sign in to access your dashboard.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isRegister && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input placeholder="First Name" {...register('first_name', { required: 'First name is required' })} />
              {errors.first_name && <p className="text-red-500 text-xs">{`${errors.first_name.message}`}</p>}
            </div>
            <div className="space-y-1">
              <Input placeholder="Last Name" {...register('last_name', { required: 'Last name is required' })} />
              {errors.last_name && <p className="text-red-500 text-xs">{`${errors.last_name.message}`}</p>}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Input placeholder="Email" type="email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-red-500 text-xs">{`${errors.email.message}`}</p>}
        </div>

        {isRegister && (
          <div className="space-y-1">
            <select
              {...register('role', { required: 'Please select a role' })}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-50 dark:ring-offset-dark-background dark:placeholder:text-slate-400 dark:focus-visible:ring-cyan-500/50"
            >
              <option value="">Select a Role...</option>
              <option value={UserRole.LEARNER}>Learner</option>
              <option value={UserRole.EMPLOYER}>Employer</option>
              <option value={UserRole.FACILITATOR}>Facilitator</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs">{`${errors.role.message}`}</p>}
          </div>
        )}

        <div className="space-y-1">
          <Input placeholder="Password" type="password" {...register('password', { required: 'Password is required', minLength: { value: isRegister ? 8 : 0, message: 'Password must be at least 8 characters' } })} />
          {errors.password && <p className="text-red-500 text-xs">{`${errors.password.message}`}</p>}
        </div>

        {isRegister && (
          <div className="space-y-1">
            <Input placeholder="Confirm Password" type="password" {...register('confirmPassword', { required: 'Please confirm your password', validate: value => value === password || 'Passwords do not match' })} />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{`${errors.confirmPassword.message}`}</p>}
          </div>
        )}

        <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 focus:shadow-cyan-500/40 transition-all duration-300" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground dark:text-dark-muted">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setAuthModalState(isRegister ? 'login' : 'register')} className="font-semibold text-cyan-500 hover:text-cyan-400 transition-colors duration-200">
          {isRegister ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};


const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalState } = useUI();

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeAuthModal();
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeAuthModal();
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md p-4"
        >
          <motion.div
            key={authModalState}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl p-8"
          >
            <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={handleCloseClick}>
              <X className="w-5 h-5" />
            </Button>

            {authModalState === 'login' ? <AuthForm /> : <AuthForm isRegister />}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;