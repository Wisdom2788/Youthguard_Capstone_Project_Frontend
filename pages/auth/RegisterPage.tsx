
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { UserRole } from '../../types';

const RegisterPage = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (data: any) => {
    // Backend expects 're_password' for confirmation
    const userData = { ...data, re_password: data.confirmPassword };
    delete userData.confirmPassword;
    await registerUser(userData);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary dark:bg-dark-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join YouthGuard and start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label htmlFor="first_name">First Name</label>
                    <Input id="first_name" {...register('first_name', { required: 'First name is required' })} />
                    {errors.first_name && <p className="text-red-500 text-xs">{`${errors.first_name.message}`}</p>}
                </div>
                 <div className="space-y-2">
                    <label htmlFor="last_name">Last Name</label>
                    <Input id="last_name" {...register('last_name', { required: 'Last name is required' })} />
                    {errors.last_name && <p className="text-red-500 text-xs">{`${errors.last_name.message}`}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" {...register('email', { required: 'Email is required' })} />
                {errors.email && <p className="text-red-500 text-xs">{`${errors.email.message}`}</p>}
            </div>
             <div className="space-y-2">
                <label htmlFor="role">I am a...</label>
                <select 
                    id="role" 
                    {...register('role', { required: 'Please select a role' })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-input dark:bg-dark-secondary"
                >
                    <option value="">Select a Role</option>
                    <option value={UserRole.LEARNER}>Learner</option>
                    <option value={UserRole.EMPLOYER}>Employer</option>
                    <option value={UserRole.FACILITATOR}>Facilitator</option>
                </select>
                {errors.role && <p className="text-red-500 text-xs">{`${errors.role.message}`}</p>}
            </div>
             <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input id="password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} />
                {errors.password && <p className="text-red-500 text-xs">{`${errors.password.message}`}</p>}
            </div>
            <div className="space-y-2">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Input id="confirmPassword" type="password" {...register('confirmPassword', { required: 'Please confirm your password', validate: value => value === password || 'The passwords do not match' })} />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{`${errors.confirmPassword.message}`}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
