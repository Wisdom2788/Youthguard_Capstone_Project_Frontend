
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCourses } from '../../hooks/api/useCourses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { BookOpen, Users, Calendar, Plus, TrendingUp } from 'lucide-react';

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

const FacilitatorDashboard = () => {
    const { user } = useAuth();
    const { data: courses, isLoading: coursesLoading } = useCourses();

    // Filter courses facilitated by current user
    const myCourses = courses?.filter(course => course.facilitator === user?.id) || [];
    const totalEnrollments = myCourses.reduce((sum, course) => sum + course.enrollment_capacity, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome {user?.first_name}</h1>
                <p className="text-muted-foreground dark:text-dark-muted">
                    Manage your courses and engage with learners to help them grow.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="My Courses"
                    value={myCourses.length}
                    icon={BookOpen}
                    description="Active courses"
                    isLoading={coursesLoading}
                />
                <StatCard
                    title="Total Capacity"
                    value={totalEnrollments}
                    icon={Users}
                    description="Available spots"
                    isLoading={coursesLoading}
                />
                <StatCard
                    title="Enrolled Students"
                    value="0"
                    icon={Users}
                    description="Current learners"
                    isLoading={false}
                />
                <StatCard
                    title="Completion Rate"
                    value="0%"
                    icon={TrendingUp}
                    description="Course success rate"
                    isLoading={false}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            My Courses
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Course
                            </Button>
                        </CardTitle>
                        <CardDescription>Courses you're facilitating</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {coursesLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : myCourses.length > 0 ? (
                            <div className="space-y-3">
                                {myCourses.slice(0, 3).map((course) => (
                                    <div key={course.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {course.enrollment_capacity} spots • 
                                                {new Date(course.start_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline">Manage</Button>
                                    </div>
                                ))}
                                {myCourses.length > 3 && (
                                    <Button className="w-full mt-4" variant="outline">
                                        View All Courses
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No courses created yet</p>
                                <Button className="mt-2">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Course
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Sessions</CardTitle>
                        <CardDescription>Your scheduled course activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {coursesLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ) : myCourses.length > 0 ? (
                            <div className="space-y-3">
                                {myCourses
                                    .filter(course => new Date(course.start_date) > new Date())
                                    .slice(0, 3)
                                    .map((course) => (
                                    <div key={course.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium">{course.title}</p>
                                            <p className="text-sm text-muted-foreground flex items-center">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(course.start_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline">View</Button>
                                    </div>
                                ))}
                                <Button className="w-full mt-4" variant="outline">
                                    View Schedule
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-muted-foreground">No upcoming sessions</p>
                                <Button className="mt-2" variant="outline">
                                    Schedule Session
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FacilitatorDashboard;
