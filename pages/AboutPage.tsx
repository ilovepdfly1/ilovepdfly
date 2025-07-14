
import React, { useEffect, useRef } from 'react';

const AboutPage: React.FC = () => {
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

  return (
    <div className="py-16 md:py-24 overflow-x-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center scroll-animate" ref={addAnimatedRef}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">About ILovePDFLY</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Our mission is to make PDF management simple, fast, and accessible to everyone, everywhere.
          </p>
        </div>

        <div className="max-w-5xl mx-auto mt-16 text-left">
          <div className="scroll-animate" ref={addAnimatedRef}>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>
                Founded in 2024 by developer Bishal Mishra, ILovePDFLY started as a simple idea: to create a single place online where anyone could access high-quality, easy-to-use PDF tools without the need for expensive software. We saw that many people, from students to professionals, struggled with basic PDF tasks like merging documents, compressing large files for email, or converting formats for different uses. We wanted to change that.
              </p>
              <p>
                What began as a passionate side project has quickly grown into a comprehensive suite of tools designed to solve real-world problems. Our commitment from day one has been to user experience and accessibility. We believe that powerful technology should empower people, not complicate their lives. This principle drives every decision we make, from the clean, intuitive interface to our privacy-first approach to file handling.
              </p>
               <p>
                While the core mission to provide free, accessible tools remains, we are introducing Premium plans to support the platform's growth and offer advanced features for power users. This helps us keep the service running and allows us to continue innovating and adding new features for our community.
              </p>
            </div>
          </div>

          <div className="mt-12 scroll-animate" ref={addAnimatedRef}>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-md scroll-animate border-glow-hover" ref={addAnimatedRef} style={{transitionDelay: '100ms'}}>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Simplicity</h3>
                <p className="text-gray-600 dark:text-gray-400">Our tools are designed to be intuitive and straightforward. No complicated manuals, no steep learning curves. Just upload and process.</p>
              </div>
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-md scroll-animate border-glow-hover" ref={addAnimatedRef} style={{transitionDelay: '200ms'}}>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Accessibility</h3>
                <p className="text-gray-600 dark:text-gray-400">We believe everyone should have access to great tools. That's why ILovePDFLY's core features are free, work on any web browser, and require no installation.</p>
              </div>
              <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-md scroll-animate border-glow-hover" ref={addAnimatedRef} style={{transitionDelay: '300ms'}}>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Security</h3>
                <p className="text-gray-600 dark:text-gray-400">Your privacy is paramount. We use end-to-end encryption and automatically delete all uploaded files from our servers within a few hours.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 scroll-animate" ref={addAnimatedRef}>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Our Technology</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg shadow-md">
               <p>
                ILovePDFLY is built on a modern, robust technology stack to ensure a fast, reliable, and secure experience. Our frontend is crafted with React and TypeScript, leveraging Tailwind CSS for a responsive and clean design. We utilize powerful browser-based APIs, including camera access for on-the-fly document scanning, to keep your data on your device whenever possible.
              </p>
              <p>
                For more complex tasks and AI-powered features like our PDF Assistant, we integrate with cutting-edge services like the Google Gemini API. Security is built-in, not an afterthought. All server communication is encrypted, and our file-handling policy is designed to maximize your privacy.
              </p>
            </div>
          </div>
          
          <div className="mt-12 scroll-animate" ref={addAnimatedRef}>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Our Vision for the Future</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
               <p>
                We are just getting started. Our vision is to continue evolving ILovePDFLY into the ultimate document productivity platform. We are constantly listening to your feedback and exploring new features to make your life even easier. In the future, you can look forward to deeper AI integration for smarter document analysis, collaborative editing tools, and even more conversion options.
              </p>
              <p>
                Our goal is to stay at the forefront of technology, breaking down barriers and making document management a seamless and even enjoyable experience. Thank you for being part of our journey!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;
