
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground dark:text-dark-muted">Welcome, {user?.first_name}. Manage the platform from here.</p>
        </div>
    );
};

export default AdminDashboard;
