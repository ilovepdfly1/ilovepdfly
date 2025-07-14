import React, { useEffect, useRef } from 'react';
import { FacebookIcon, WhatsAppIcon, GitHubIcon, LinkedInIcon } from '../components/icons';

const skills = [
    'React', 'TypeScript', 'Node.js', 'JavaScript (ES6+)',
    'Tailwind CSS', 'HTML5', 'CSS3', 'Git', 'Rest API', 'Firebase'
];

const DeveloperPage: React.FC = () => {
    const animatedElementsRef = useRef<HTMLElement[]>([]);
    animatedElementsRef.current = [];

    const addAnimatedRef = (el: HTMLElement | null) => {
        if (el) {
            animatedElementsRef.current.push(el);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        const currentElements = animatedElementsRef.current;
        currentElements.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => {
            currentElements.forEach((el) => {
                if (el) observer.unobserve(el);
            });
        };
    });

    const calculateAge = (birthDateString: string): number => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge('2006-06-19');

  return (
    <div className="py-16 md:py-24 overflow-x-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden scroll-animate" ref={addAnimatedRef}>
            <div className="relative">
                <div className="h-24 bg-brand-red"></div>
                <div className="absolute top-12 left-1/2 -translate-x-1/2">
                    <img className="h-32 w-32 object-cover rounded-full border-4 border-white dark:border-black" src="https://i.ibb.co/RpStGhqm/IMG-5251-Original.jpg" alt="Bishal Mishra" />
                </div>
            </div>
            
            <div className="p-8 mt-16 text-center">
                <h1 className="block text-3xl leading-tight font-extrabold text-black dark:text-white">Bishal Mishra</h1>
                <p className="uppercase tracking-wide text-sm text-brand-red font-semibold mt-1">Full-Stack Developer</p>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">{age} years old from Kirtipur, Kathmandu, Nepal. Passionate about building useful tools and beautiful web experiences that help people solve real-world problems.</p>
                
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">Contact Me</h3>
                    <div className="flex items-center justify-center space-x-4">
                        <a href="https://wa.me/message/JYA22CVSYSZ4N1" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors" aria-label="WhatsApp">
                            <WhatsAppIcon className="h-6 w-6" />
                        </a>
                        <a href="https://www.facebook.com/share/16sdjGNVGr/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors" aria-label="Facebook">
                            <FacebookIcon className="h-6 w-6" />
                        </a>
                        <a href="https://github.com/bishal-mishra-1" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors" aria-label="GitHub">
                            <GitHubIcon className="h-6 w-6" />
                        </a>
                        <a href="https://www.linkedin.com/in/bishal-mishra-06192006" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors" aria-label="LinkedIn">
                            <LinkedInIcon className="h-6 w-6" />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Skills & Technologies</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {skills.map(skill => (
                            <span key={skill} className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;