import React from 'react';
import { useCourses } from '../../hooks/api/useCourses';
import { useJobs } from '../../hooks/api/useJobs';
import { useCompanies } from '../../hooks/api/useCompanies';
import { Briefcase, BookOpen, Building } from 'lucide-react';

const MarqueeItem = ({ item }: { item: any }) => {
    let icon, title, subtitle;

    if (item.title && item.enrollment_capacity !== undefined) { // Course
        icon = <BookOpen className="w-5 h-5 text-cyan-400" />;
        title = item.title;
        subtitle = `Capacity: ${item.enrollment_capacity}`;
    } else if (item.title && item.job_type) { // Job
        icon = <Briefcase className="w-5 h-5 text-green-400" />;
        title = item.title;
        subtitle = item.company.name;
    } else if (item.name && item.website) { // Company
        icon = <Building className="w-5 h-5 text-purple-400" />;
        title = item.name;
        subtitle = "Partner Company";
    }

    if (!title) return null;

    return (
         <div className="flex items-center gap-4 mx-8 py-3 px-6 rounded-full backdrop-blur-sm shrink-0 bg-white/70 border border-gray-200/80 dark:bg-white/5 dark:border-white/10">
            {icon}
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>
        </div>
    );
};

export const Marquee = () => {
    const { data: courses } = useCourses();
    const { data: jobs } = useJobs();
    const { data: companies } = useCompanies();

    const allItems = [...(courses || []), ...(jobs || []), ...(companies || [])]
        .filter(item => item && item.id) // Ensure items are valid
        .sort(() => 0.5 - Math.random());

    if (!allItems.length) return null;
    
    // Duplicate the items to create a seamless loop
    const marqueeItems = [...allItems, ...allItems, ...allItems, ...allItems];

    return (
        <div className="relative w-full overflow-hidden py-12">
            <div className="flex w-max group hover:[animation-play-state:paused]">
                <div className="flex animate-marquee">
                    {marqueeItems.map((item, index) => (
                        <MarqueeItem key={`${item.id}-${index}`} item={item} />
                    ))}
                </div>
            </div>
             <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background dark:from-dark-background dark:via-transparent dark:to-dark-background" />
        </div>
    );
};