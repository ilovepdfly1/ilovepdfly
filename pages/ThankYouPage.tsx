import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '../components/icons';

const ThankYouPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-900">
      <div className="text-center bg-white dark:bg-black p-10 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden">
        
        <div className="mx-auto mb-6">
          <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto animate-scale-in" />
        </div>

        <h1 
            className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in-down opacity-0"
            style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}
        >
          Thanks!
        </h1>
        <p 
            className="mt-4 text-gray-600 dark:text-gray-300 animate-fade-in-down opacity-0"
            style={{ animationFillMode: 'forwards', animationDelay: '0.4s' }}
        >
          Your message has been sent successfully. We'll get back to you shortly.
        </p>

        <div 
            className="mt-8 animate-fade-in-down opacity-0"
            style={{ animationFillMode: 'forwards', animationDelay: '0.6s' }}
        >
          <Link 
            to="/" 
            className="inline-block bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;