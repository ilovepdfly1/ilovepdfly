import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';
import { useTheme } from '../contexts/ThemeContext';
import { Tool } from '../types';
import AIAssistant from '../components/AIAssistant';
import { StarIcon } from '../components/icons';

const faqData = [
    {
        question: "Is ILovePDFLY completely free?",
        answer: "Yes! All our tools are 100% free to use. We aim to make PDF processing accessible to everyone without hidden costs."
    },
    {
        question: "Are my files secure?",
        answer: "Absolutely. We prioritize your privacy and security. All files you upload are automatically and permanently deleted from our servers within a few hours. We don't read, copy, or share your content."
    },
    {
        question: "Do I need to install any software?",
        answer: "No installation is required. ILovePDFLY is a fully online service that works directly in your web browser. We also offer optional Desktop and Mobile apps for offline use."
    },
];

const AccordionItem: React.FC<{
    item: { question: string, answer: string },
    isOpen: boolean,
    toggle: () => void,
    animationRef: (el: HTMLDivElement | null) => void
}> = ({ item, isOpen, toggle, animationRef }) => (
    <div className="border-b border-gray-200 dark:border-gray-800 py-4 scroll-animate" ref={animationRef}>
        <button onClick={toggle} className="w-full flex justify-between items-center text-left">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.question}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.answer}</p>
        </div>
    </div>
);


const HomePage: React.FC = () => {
    const { theme } = useTheme();
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [mostUsed, setMostUsed] = useState<Tool[]>([]);
    const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
    
    const animatedElementsRef = useRef<HTMLElement[]>([]);
    animatedElementsRef.current = [];

    const addAnimatedRef = (el: HTMLElement | null) => {
        if (el) {
            animatedElementsRef.current.push(el);
        }
    };

    useEffect(() => {
        try {
            const savedFavorites = JSON.parse(localStorage.getItem('favoriteTools') || '[]');
            setFavoriteTools(savedFavorites);
            
            const counts = JSON.parse(localStorage.getItem('toolUsageCounts') || '{}');
            const sortedTools = Object.entries(counts)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .map(([id]) => TOOLS.find(tool => tool.id === id))
                .filter((tool): tool is Tool => !!tool)
                .slice(0, 4);
            setMostUsed(sortedTools);
        } catch (error) {
            console.error("Failed to load user preferences:", error);
            setMostUsed([]);
            setFavoriteTools([]);
        }
    }, []);

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

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleToolClick = (toolId: string) => {
        try {
            const counts = JSON.parse(localStorage.getItem('toolUsageCounts') || '{}');
            counts[toolId] = (counts[toolId] || 0) + 1;
            localStorage.setItem('toolUsageCounts', JSON.stringify(counts));
        } catch (error) {
            console.error("Failed to update tool usage count:", error);
        }
    };
    
    const handleToggleFavorite = (e: React.MouseEvent, toolId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newFavorites = favoriteTools.includes(toolId)
            ? favoriteTools.filter(id => id !== toolId)
            : [...favoriteTools, toolId];

        setFavoriteTools(newFavorites);
        localStorage.setItem('favoriteTools', JSON.stringify(newFavorites));
    };

    const favoritedTools = TOOLS.filter(tool => favoriteTools.includes(tool.id));

    const lightWave = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3e%3cpath fill='%23ffffff' fill-opacity='1' d='M0,192L120,170.7C240,149,480,107,720,112C960,117,1200,171,1320,197.3L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'%3e%3c/path%3e%3c/svg%3e")`;
    const darkWave = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3e%3cpath fill='%23000000' fill-opacity='1' d='M0,192L120,170.7C240,149,480,107,720,112C960,117,1200,171,1320,197.3L1440,224L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'%3e%3c/path%3e%3c/svg%3e")`;


  return (
    <div className="overflow-x-hidden">
      <div 
        id="features"
        className="relative pt-20 pb-24 text-center bg-white dark:bg-black"
        style={{
          backgroundImage: theme === 'dark' ? darkWave : lightWave,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 animate-fade-in-down" style={{animationDelay: '100ms'}}>
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 animate-fade-in-down" style={{animationDelay: '200ms'}}>
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! With ILovePDFLY you can merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-black -mt-16">
        <AIAssistant />
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 pt-16 pb-16">
        {favoritedTools.length > 0 && (
            <div className="mb-16 scroll-animate" ref={addAnimatedRef}>
                <h2 className="flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 gap-2">
                    <StarIcon className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                    Your Favorites
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {favoritedTools.map((tool, index) => (
                        <div key={tool.id} onClick={() => handleToolClick(tool.id)} ref={addAnimatedRef} className="scroll-animate" style={{ transitionDelay: `${index * 50}ms` }}>
                            <ToolCard tool={tool} isFavorite={true} onToggleFavorite={handleToggleFavorite} />
                        </div>
                    ))}
                </div>
                <hr className="my-12 border-gray-200 dark:border-gray-700" />
            </div>
        )}

        {mostUsed.length > 0 && (
          <div className="mb-16 scroll-animate" ref={addAnimatedRef}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Most Used Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {mostUsed.map((tool, index) => (
                 <div key={tool.id} onClick={() => handleToolClick(tool.id)} ref={addAnimatedRef} className="scroll-animate" style={{transitionDelay: `${index * 50}ms`}}>
                    <ToolCard tool={tool} isFavorite={favoriteTools.includes(tool.id)} onToggleFavorite={handleToggleFavorite} />
                 </div>
              ))}
            </div>
             <hr className="my-12 border-gray-200 dark:border-gray-700" />
          </div>
        )}
        
        <div className="scroll-animate" ref={addAnimatedRef}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">All Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {TOOLS.map((tool, index) => (
                <div key={tool.id} onClick={() => handleToolClick(tool.id)} className="scroll-animate" style={{transitionDelay: `${index * 25}ms`}} ref={addAnimatedRef}>
                    <ToolCard tool={tool} isFavorite={favoriteTools.includes(tool.id)} onToggleFavorite={handleToggleFavorite} />
                </div>
            ))}
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black py-20">
        <div className="max-w-5xl mx-auto px-6 text-center scroll-animate" ref={addAnimatedRef}>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Looking for another solution?
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8 text-left">
            <div className="scroll-animate" ref={addAnimatedRef}>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">iLovePDFLY Desktop</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Download the <a href="https://ilovepdfly.com/desktop" className="text-brand-red font-semibold hover:underline">iLovePDFLY Desktop</a> App to work with your favorite PDF tools on your Mac or Windows PC. Get a lightweight PDF app that helps you process heavy PDF tasks offline in seconds.
              </p>
            </div>
            <div className="scroll-animate" ref={addAnimatedRef} style={{transitionDelay: '100ms'}}>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">iLovePDFLY Mobile</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get the <a href="https://ilovepdfly.com/mobile" className="text-brand-red font-semibold hover:underline">iLovePDFLY Mobile</a> App to manage documents remotely or on the move. Turn your Android or iPhone device into a PDF Editor & Scanner to annotate, sign, and share documents with ease.
              </p>
            </div>
            <div className="scroll-animate" ref={addAnimatedRef} style={{transitionDelay: '200ms'}}>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">iLoveIMG</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                <a href="https://iloveimg.com" target="_blank" rel="noopener noreferrer" className="text-brand-red font-semibold hover:underline">iLoveIMG</a> is the web app that helps you modify images in bulk for free. Crop, resize, compress, convert, and more. All the tools you need to enhance your images in just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-black py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto bg-white dark:bg-black ring-1 ring-gray-200 dark:ring-white/10 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 scroll-animate" ref={addAnimatedRef}>
            <div className="md:w-3/5 lg:w-1/2 text-center md:text-left">
              <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                Get more with Premium
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Complete projects faster with batch file processing, convert scanned documents with OCR and e-sign your business agreements.
              </p>
              <Link 
                to="/pricing" 
                className="inline-block bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-lg"
              >
                Get Premium
              </Link>
            </div>
            <div className="md:w-2/5 lg:w-1/2 mt-8 md:mt-0 flex justify-center items-center">
              <svg width="400" height="250" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm drop-shadow-2xl">
                <defs>
                  <filter id="premium-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                    <feOffset dx="2" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.5"/>
                    </feComponentTransfer>
                    <feMerge> 
                      <feMergeNode/>
                      <feMergeNode in="SourceGraphic"/> 
                    </feMerge>
                  </filter>
                </defs>

                <path d="M 50 180 Q 150 220 250 150 T 380 80" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4" fill="none" />
                
                <g transform="translate(280 40) rotate(15)" filter="url(#premium-shadow)">
                  <rect x="0" y="0" width="40" height="30" rx="5" fill="#ef4444"/>
                  <rect x="5" y="5" width="10" height="10" rx="2" stroke="#fee2e2" strokeWidth="1.5" fill="none" />
                  <text x="7" y="23" fontFamily="monospace" fontSize="8" fill="#fee2e2" fontWeight="bold">OCR</text>
                </g>
                
                <g transform="translate(320 180) rotate(-10)" filter="url(#premium-shadow)">
                    <rect x="0" y="0" width="40" height="30" rx="5" fill="#ef4444"/>
                    <path d="M10 20 l-2 -8h20l-2 8z M8 12h20 M12 10 a 6 6 0 0 1 12 0" stroke="#fee2e2" strokeWidth="1.5" fill="none" />
                </g>
                
                <g transform="translate(80 50) rotate(-15)">
                  <rect x="0" y="0" width="120" height="160" fill="#f3f4f6" rx="8" filter="url(#premium-shadow)"/>
                  <rect x="15" y="15" width="20" height="5" rx="2" fill="#ef4444" />
                  <rect x="15" y="30" width="90" height="3" rx="1" fill="#e5e7eb" />
                  <rect x="15" y="40" width="80" height="3" rx="1" fill="#e5e7eb" />
                  <rect x="15" y="50" width="90" height="3" rx="1" fill="#e5e7eb" />
                  <rect x="15" y="60" width="70" height="3" rx="1" fill="#e5e7eb" />
                </g>
                
                <path d="M 150 220 C 50 180, 200 50, 350 100" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.8" />
                
                <g transform="translate(200 80) rotate(10)">
                  <rect x="0" y="0" width="100" height="140" fill="#f3f4f6" rx="8" filter="url(#premium-shadow)"/>
                  <rect x="15" y="15" width="30" height="5" rx="2" fill="#f59e0b" />
                  <rect x="15" y="30" width="70" height="3" rx="1" fill="#e5e7eb" />
                  <rect x="15" y="40" width="65" height="3" rx="1" fill="#e5e7eb" />
                  <rect x="15" y="55" width="40" height="15" rx="2" fill="#f3f4f6" />
                  <rect x="65" y="55" width="20" height="15" rx="2" fill="#f3f4f6" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-20">
          <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12 scroll-animate" ref={addAnimatedRef}>
                  Frequently Asked Questions
              </h2>
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg shadow-md">
                  {faqData.map((item, index) => (
                      <AccordionItem 
                          key={index}
                          item={item}
                          isOpen={openFaq === index}
                          toggle={() => toggleFaq(index)}
                          animationRef={addAnimatedRef}
                      />
                  ))}
              </div>
              <div className="text-center mt-8 scroll-animate" ref={addAnimatedRef}>
                <Link to="/faq" className="text-brand-red font-semibold hover:underline">
                  View all FAQs &rarr;
                </Link>
              </div>
          </div>
      </div>

    </div>
  );
};

export default HomePage;