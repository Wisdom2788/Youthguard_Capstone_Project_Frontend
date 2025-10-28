import React, { useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Button } from '../ui/Button';
import { Home, Briefcase, BookOpen, DollarSign, Wallet, User, LogOut, Menu } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { AnimatePresence, motion } from 'framer-motion';

const getDashboardLink = (role: UserRole) => {
    switch (role) {
        case UserRole.ADMIN:
            return '/dashboard/admin';
        case UserRole.EMPLOYER:
            return '/dashboard/employer';
        case UserRole.FACILITATOR:
            return '/dashboard/facilitator';
        case UserRole.LEARNER:
        default:
            return '/dashboard/learner';
    }
};

const roleLinks = {
    [UserRole.LEARNER]: [
        { to: '/dashboard/jobs', icon: Briefcase, label: 'Jobs', roles: [UserRole.LEARNER] },
        { to: '/dashboard/courses', icon: BookOpen, label: 'Courses', roles: [UserRole.LEARNER] },
        { to: '/dashboard/earn/tasks', icon: DollarSign, label: 'Earn', roles: [UserRole.LEARNER] },
        { to: '/dashboard/earn/wallet', icon: Wallet, label: 'Wallet', roles: [UserRole.LEARNER] },
    ],
    [UserRole.EMPLOYER]: [
         { to: '/dashboard/manage-jobs', icon: Briefcase, label: 'Manage Jobs', roles: [UserRole.EMPLOYER] },
    ],
    [UserRole.FACILITATOR]: [
         { to: '/dashboard/manage-courses', icon: BookOpen, label: 'Manage Courses', roles: [UserRole.FACILITATOR] },
    ],
    [UserRole.ADMIN]: [
        { to: '/dashboard/users', icon: User, label: 'Users', roles: [UserRole.ADMIN] },
    ]
};


const Sidebar = ({ isOpen }: {isOpen: boolean}) => {
    const { role } = useAuth();
    
    const dashboardLink = getDashboardLink(role);
    const commonLinks = [
        { to: dashboardLink, icon: Home, label: 'Dashboard', roles: [UserRole.ADMIN, UserRole.EMPLOYER, UserRole.FACILITATOR, UserRole.LEARNER] },
    ];
    
    const links = [...commonLinks, ...(roleLinks[role] || [])];

    return (
        <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-secondary dark:bg-dark-secondary border-r border-border dark:border-dark-border`}>
            <div className="h-full px-3 py-4 overflow-y-auto">
                <Link to={dashboardLink} className="flex items-center ps-2.5 mb-5">
                    <span className="self-center text-xl font-semibold whitespace-nowrap">YouthGuard</span>
                </Link>
                <ul className="space-y-2 font-medium">
                    {links.map(link => (
                        <li key={link.to}>
                             <NavLink
                                to={link.to}
                                end={link.to === dashboardLink}
                                className={({ isActive }) =>
                                    `flex items-center p-2 rounded-lg group transition-colors ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground dark:bg-dark-primary dark:text-dark-primary-foreground'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`
                                }
                            >
                                <link.icon className="w-5 h-5"/>
                                <span className="ms-3">{link.label}</span>
                             </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-dark-background/95 dark:border-dark-border">
             <button onClick={onMenuClick} className="sm:hidden p-2 -ml-2">
                <Menu className="w-6 h-6"/>
             </button>
            <div className="sm:ml-auto flex items-center gap-2">
                <ThemeToggle />
                <span className="hidden sm:inline">Welcome, {user?.first_name}</span>
                <Button onClick={logout} variant="ghost" size="icon">
                    <LogOut className="w-5 h-5"/>
                </Button>
            </div>
        </header>
    )
}


const DashboardLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="sm:ml-64">
                <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
                <main className="p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            {isSidebarOpen && <div className="sm:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)}></div>}
        </div>
    );
};

export default DashboardLayout;
