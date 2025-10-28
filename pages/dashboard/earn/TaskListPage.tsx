
import React from 'react';
import { useTasks } from '../../../hooks/api/useTasks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Button } from '../../../components/ui/Button';
import { DollarSign, Clock } from 'lucide-react';

const TaskCardSkeleton = () => (
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
);

const TaskListPage = () => {
    const { data: tasks, isLoading, isError, error } = useTasks();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Earn with Micro-Tasks</h1>
            <p className="text-muted-foreground dark:text-dark-muted mb-8">
                Complete tasks to earn rewards and build your skills.
            </p>

            {isLoading && (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => <TaskCardSkeleton key={i} />)}
                 </div>
            )}

            {isError && (
                <div className="text-center py-10 px-4 rounded-md bg-destructive/10 text-destructive dark:text-red-400">
                    <h3 className="text-lg font-semibold">Failed to Load Tasks</h3>
                    <p>We encountered an issue while fetching available tasks. Please try again later.</p>
                    <p className="text-xs mt-2">{error.message}</p>
                </div>
            )}
            
            {!isLoading && !isError && tasks && tasks.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <Card key={task.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    ${task.reward_amount}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground dark:text-dark-muted line-clamp-3">
                                    {task.description}
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        task.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                        task.status === 'Completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                    }`}>
                                        {task.status}
                                    </span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full" 
                                    disabled={task.status !== 'Open'}
                                >
                                    {task.status === 'Open' ? 'Start Task' : 
                                     task.status === 'In Progress' ? 'In Progress' :
                                     task.status === 'Completed' ? 'Completed' : 'Closed'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
            
            {!isLoading && !isError && tasks && tasks.length === 0 && (
                 <div className="text-center py-16 px-4 rounded-md border-2 border-dashed">
                    <h3 className="text-lg font-semibold">No Tasks Available</h3>
                    <p className="text-muted-foreground dark:text-dark-muted mt-1">
                        Please check back later for new tasks.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TaskListPage;
