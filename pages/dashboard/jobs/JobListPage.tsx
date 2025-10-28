
import React from 'react';
import { useJobs } from '../../../hooks/api/useJobs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Button } from '../../../components/ui/Button';
import { Briefcase, MapPin } from 'lucide-react';

const JobCardSkeleton = () => (
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

const JobListPage = () => {
    const { data: jobs, isLoading, isError, error } = useJobs();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Job Marketplace</h1>
            <p className="text-muted-foreground dark:text-dark-muted mb-8">
                Find your next opportunity. Explore internships and entry-level positions from our trusted partners.
            </p>

            {isLoading && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
                 </div>
            )}

            {isError && (
                <div className="text-center py-10 px-4 rounded-md bg-destructive/10 text-destructive dark:text-red-400">
                    <h3 className="text-lg font-semibold">Oops! Something went wrong.</h3>
                    <p>We couldn't load the jobs. Please try again later.</p>
                    <p className="text-xs mt-2">{error.message}</p>
                </div>
            )}
            
            {!isLoading && !isError && jobs && jobs.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map(job => (
                        <Card key={job.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription>{job.company.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground dark:text-dark-muted line-clamp-3">
                                    {job.description}
                                </p>
                                <div className="mt-4 flex flex-col gap-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span>{job.job_type}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>View Details</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            
            {!isLoading && !isError && jobs && jobs.length === 0 && (
                 <div className="text-center py-16 px-4 rounded-md border-2 border-dashed">
                    <h3 className="text-lg font-semibold">No Jobs Found</h3>
                    <p className="text-muted-foreground dark:text-dark-muted mt-1">
                        There are currently no open positions. Please check back later.
                    </p>
                </div>
            )}
        </div>
    );
};

export default JobListPage;
