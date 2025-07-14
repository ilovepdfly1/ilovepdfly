
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailIcon } from '../components/icons';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch("https://formspree.io/f/mwpqenrr", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        navigate('/thank-you');
      } else {
        const data = await response.json();
        if (data.errors) {
          setError(data.errors.map((err: any) => err.message).join(", "));
        } else {
          setError("An error occurred. Please try again.");
        }
        setIsLoading(false);
      }
    } catch (err) {
      setError("A network error occurred. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Get In Touch</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Have a question, a suggestion, or need support? We'd love to hear from you.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-md flex items-center gap-4">
                 <div className="flex-shrink-0 bg-brand-red/10 p-3 rounded-full">
                    <EmailIcon className="h-6 w-6 text-brand-red" />
                 </div>
                 <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">Contact Email</h3>
                    <a href="mailto:ilovepdfly2@gmail.com" className="text-brand-red hover:underline">
                        ilovepdfly2@gmail.com
                    </a>
                 </div>
            </div>
        </div>

        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 max-w-3xl mx-auto p-8 md:p-12 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
             <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Or send us a message directly</h3>
             {error && <p className="text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-brand-red focus:border-brand-red text-gray-800 dark:text-gray-200" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-brand-red focus:border-brand-red text-gray-800 dark:text-gray-200" />
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-brand-red focus:border-brand-red text-gray-800 dark:text-gray-200" />
            </div>
            <div className="mt-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea id="message" name="message" rows={5} required value={formData.message} onChange={handleChange} className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-brand-red focus:border-brand-red text-gray-800 dark:text-gray-200"></textarea>
            </div>
            <div className="mt-8 text-center">
              <button type="submit" disabled={isLoading} className="bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-10 rounded-md transition-colors text-lg disabled:bg-red-300 dark:disabled:bg-red-800">
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
