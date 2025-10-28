import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, BookOpen, Briefcase, DollarSign, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { Marquee } from '../components/shared/Marquee';
import { useUI } from '../contexts/UIContext';
import { useAuth } from '../hooks/useAuth';

const FeatureCard = ({ icon, title, description, index }: { icon: React.ElementType, title: string, description: string, index: number }) => {
    const Icon = icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-8 rounded-2xl backdrop-blur-lg transition-all duration-300 ease-out hover:scale-[1.02] bg-white/60 border border-gray-200 shadow-md shadow-black/5 hover:shadow-xl hover:shadow-black/10 dark:bg-black/20 dark:border-white/10 dark:shadow-2xl dark:hover:border-white/20"
        >
            <Icon className="w-10 h-10 mb-4 text-cyan-400" />
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </motion.div>
    );
}

const AnimatedGradientBackground = () => (
    <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-[#020617]" />
        <div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10 dark:from-cyan-900/30 dark:via-transparent dark:to-indigo-900/30" 
        />
        <motion.div 
            animate={{ x: ['-20%', '20%', '-20%'], y: ['-20%', '20%', '-20%'] }}
            transition={{ duration: 30, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl dark:bg-cyan-500/20"
        />
        <motion.div 
            animate={{ x: ['20%', '-20%', '20%'], y: ['20%', '-20%', '20%'] }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 5 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl dark:bg-indigo-500/20"
        />
    </div>
);


const LandingHeader = () => {
    const { openAuthModal } = useUI();
    const { isAuthenticated } = useAuth();
    
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 bg-transparent"
        >
            <Link to="/" className="text-2xl font-bold text-foreground dark:text-dark-foreground">
                YouthGuard
            </Link>
            <nav className="flex items-center gap-2">
                <ThemeToggle />
                {isAuthenticated ? (
                     <Link to="/dashboard">
                        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg shadow-cyan-500/30">Dashboard</Button>
                    </Link>
                ) : (
                    <>
                        <Button variant="ghost" onClick={() => openAuthModal('login')} className="hidden sm:block">Login</Button>
                        <Button onClick={() => openAuthModal('register')} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg shadow-cyan-500/30">Get Started</Button>
                    </>
                )}
            </nav>
        </motion.header>
    );
};

const LandingPage = () => {
    const { openAuthModal } = useUI();
    const heroTitle = "Unlock Your Potential. Secure Your Future.".split(" ");

    return (
        <div className="min-h-screen bg-background dark:bg-[#020617] text-foreground dark:text-white font-sans overflow-x-hidden">
            <LandingHeader />

            <main className="relative pt-40 pb-20 px-6 isolate">
                <AnimatedGradientBackground />

                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        {heroTitle.map((el, i) => (
                           <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mr-2"
                                key={i}
                           >
                               {el}
                           </motion.span> 
                        ))}
                    </h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
                    >
                        YouthGuard is your all-in-one platform for skills development, career opportunities, and financial empowerment. Start your journey today.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="flex justify-center items-center gap-4"
                    >
                        <Button size="lg" onClick={() => openAuthModal('register')} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full text-lg shadow-lg shadow-cyan-500/20">
                            Create Account
                        </Button>
                        <a href="#features">
                             <Button size="lg" variant="outline" className="text-foreground dark:text-white border-border dark:border-white/30 hover:bg-accent dark:hover:bg-white/10 rounded-full text-lg">
                                Learn More <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </motion.div>
                </div>
            </main>
            
            <Marquee />

            <section id="features" className="py-24 px-6 bg-transparent">
                <div className="container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                         <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">A Platform Built For You</h2>
                         <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Whether you're looking to learn new skills, find your first job, or earn on the side, YouthGuard provides the tools you need to succeed.
                         </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard 
                            index={0}
                            icon={BookOpen} 
                            title="Upskill Courses" 
                            description="Access a curated library of courses designed to equip you with in-demand skills for the modern workplace." 
                        />
                        <FeatureCard 
                            index={1}
                            icon={Briefcase} 
                            title="Job Marketplace" 
                            description="Connect with top companies and find internships or entry-level jobs that match your skills and ambitions." 
                        />
                        <FeatureCard 
                            index={2}
                            icon={DollarSign} 
                            title="Micro-Tasks" 
                            description="Earn money by completing simple tasks, building your financial literacy and independence one step at a time." 
                        />
                         <FeatureCard 
                            index={3}
                            icon={Shield} 
                            title="Secure Wallet" 
                            description="Manage your earnings securely with our integrated digital wallet, designed to be safe and easy to use." 
                        />
                    </div>
                </div>
            </section>

            <motion.footer
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true, amount: 0.5 }}
                 transition={{ duration: 1 }}
                 className="py-12 px-6 bg-transparent border-t border-gray-200 dark:border-white/10"
            >
                <div className="container mx-auto text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} YouthGuard. All rights reserved.</p>
                </div>
            </motion.footer>
        </div>
    );
};

export default LandingPage;