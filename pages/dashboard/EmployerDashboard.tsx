
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCompanies } from '../../hooks/api/useCompanies';
import { useJobs } from '../../hooks/api/useJobs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Building2, Users, Briefcase, Plus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, description, isLoading }: any) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <Skeleton className="h-8 w-16" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

const EmployerDashboard = () => {
    const { user } = useAuth();
    const { data: companies, isLoading: companiesLoading } = useCompanies();
    const { data: jobs, isLoading: jobsLoading } = useJobs();

    // Filter companies owned by current user
    const myCompanies = companies?.filter(company => company.owner === user?.id) || [];
    const totalJobs = jobs?.length || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.first_name}!</h1>
                <p className="text-muted-foreground dark:text-dark-muted">
                    Manage your company's job postings and find the best talent.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="My Companies"
                    value={myCompanies.length}
                    icon={Building2}
                    description="Companies you manage"
                    isLoading={companiesLoading}
                />
                <StatCard
                    title="Active Jobs"
                    value={totalJobs}
                    icon={Briefcase}
                    description="Open positions"
                    isLoading={jobsLoading}
                />
                <StatCard
                    title="Applications"
                    value="0"
                    icon={Users}
                    description="Pending reviews"
                    isLoading={false}
                />
                <StatCard
                    title="Hired This Month"
                    value="0"
                    icon={Users}
                    description="New hires"
                    isLoading={false}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            My Companies
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Company
                            </Button>
                        </CardTitle>
                        <CardDescription>Companies you own and manage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {companiesLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : myCompanies.length > 0 ? (
                            <div className="space-y-3">
                                {myCompanies.slice(0, 3).map((company) => (
                                    <div key={company.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{company.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {company.description}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline">Manage</Button>
                                    </div>
                                ))}
                                {myCompanies.length > 3 && (
                                    <Button className="w-full mt-4" variant="outline">
                                        View All Companies
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No companies registered yet</p>
                                <Button className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Register Your Company
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            Recent Job Posts
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Post Job
                            </Button>
                        </CardTitle>
                        <CardDescription>Your latest job postings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {jobsLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : jobs && jobs.length > 0 ? (
                            <div className="space-y-3">
                                {jobs.slice(0, 3).map((job) => (
                                    <div key={job.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{job.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {job.company.name} • {job.job_type}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline">Edit</Button>
                                    </div>
                                ))}
                                <Button className="w-full mt-4" variant="outline">
                                    Manage All Jobs
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No job posts yet</p>
                                <Button className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Post Your First Job
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EmployerDashboard;
