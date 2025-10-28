
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useJobs } from '../../hooks/api/useJobs';
import { useCourses } from '../../hooks/api/useCourses';
import { useTasks } from '../../hooks/api/useTasks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { Briefcase, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

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

const LearnerDashboard = () => {
    const { user } = useAuth();
    const { data: jobs, isLoading: jobsLoading, error: jobsError } = useJobs();
    const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
    const { data: tasks, isLoading: tasksLoading, error: tasksError } = useTasks();



    const availableJobs = jobs?.length || 0;
    const availableCourses = courses?.length || 0;
    const completedTasks = tasks?.filter(task => task.status === 'Completed').length || 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {user?.first_name}!</h1>
                <p className="text-muted-foreground dark:text-dark-muted">
                    Here's your learner dashboard. Explore opportunities to grow and earn.
                </p>

            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Available Jobs"
                    value={availableJobs}
                    icon={Briefcase}
                    description="Open positions"
                    isLoading={jobsLoading}
                />
                <StatCard
                    title="Available Courses"
                    value={availableCourses}
                    icon={BookOpen}
                    description="Skill-building opportunities"
                    isLoading={coursesLoading}
                />
                <StatCard
                    title="Wallet Balance"
                    value="$0.00"
                    icon={DollarSign}
                    description="Your earnings"
                    isLoading={false}
                />
                <StatCard
                    title="Tasks Completed"
                    value={completedTasks}
                    icon={TrendingUp}
                    description="This month"
                    isLoading={tasksLoading}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Job Opportunities</CardTitle>
                        <CardDescription>Latest positions matching your profile</CardDescription>
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
                                            <p className="text-sm text-muted-foreground">{job.company.name}</p>
                                        </div>
                                        <Button size="sm" variant="outline">View</Button>
                                    </div>
                                ))}
                                <Button className="w-full mt-4" onClick={() => window.location.hash = '/dashboard/jobs'}>
                                    View All Jobs
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No jobs available yet</p>
                                <Button className="mt-2" onClick={() => window.location.hash = '/dashboard/jobs'}>
                                    Explore Jobs
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recommended Courses</CardTitle>
                        <CardDescription>Enhance your skills with these courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {coursesLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : courses && courses.length > 0 ? (
                            <div className="space-y-3">
                                {courses.slice(0, 3).map((course) => (
                                    <div key={course.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {course.enrollment_capacity} spots available
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline">Enroll</Button>
                                    </div>
                                ))}
                                <Button className="w-full mt-4" onClick={() => window.location.hash = '/dashboard/courses'}>
                                    View All Courses
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No courses available yet</p>
                                <Button className="mt-2" onClick={() => window.location.hash = '/dashboard/courses'}>
                                    Explore Courses
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LearnerDashboard;
