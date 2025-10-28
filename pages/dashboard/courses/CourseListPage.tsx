import React from 'react';
import { useCourses } from '../../../hooks/api/useCourses';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Button } from '../../../components/ui/Button';
import { Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CourseCardSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-24" />
        </CardFooter>
    </Card>
)

const CourseListPage = () => {
    const { data: courses, isLoading, isError, error } = useCourses();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Courses</h1>
            <p className="text-muted-foreground dark:text-dark-muted mb-8">
                Expand your knowledge and skills. Enroll in courses led by industry experts.
            </p>

            {isLoading && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => <CourseCardSkeleton key={i} />)}
                 </div>
            )}

            {isError && (
                <div className="text-center py-10 px-4 rounded-md bg-destructive/10 text-destructive dark:text-red-400">
                    <h3 className="text-lg font-semibold">Failed to Load Courses</h3>
                    <p>We encountered an issue while fetching the course catalog. Please try again later.</p>
                    <p className="text-xs mt-2">{error.message}</p>
                </div>
            )}
            
            {!isLoading && !isError && courses && courses.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="flex flex-col h-full">
                                <CardHeader>
                                    <CardTitle>{course.title}</CardTitle>
                                    <CardDescription>Facilitator ID: {course.facilitator}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground dark:text-dark-muted line-clamp-3">
                                        {course.description}
                                    </p>
                                    <div className="mt-4 flex flex-col gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>Capacity: {course.enrollment_capacity}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button>Enroll Now</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
            
            {!isLoading && !isError && courses && courses.length === 0 && (
                 <div className="text-center py-16 px-4 rounded-md border-2 border-dashed">
                    <h3 className="text-lg font-semibold">No Courses Available</h3>
                    <p className="text-muted-foreground dark:text-dark-muted mt-1">
                        There are currently no courses open for enrollment. Please check back later.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CourseListPage;
