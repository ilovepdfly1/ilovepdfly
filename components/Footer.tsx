
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, WhatsAppIcon, YoutubeIcon, CheckCircleIcon } from './icons';

interface FooterProps {
  onLegalLinkClick: (type: 'privacy' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ onLegalLinkClick }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    setSubscribed(true);
    // In a real app, you'd send the email to your backend here.
    setTimeout(() => {
        setSubscribed(false);
        setEmail('');
    }, 5000); // Reset form after 5 seconds
  };

  return (
    <footer className="bg-black text-white w-full">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">ILovePDFLY</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/#features" className="hover:text-white transition-colors">Tools</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Top Tools</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link to="/split-pdf" className="hover:text-white transition-colors">Split PDF</Link></li>
              <li><Link to="/compress-pdf" className="hover:text-white transition-colors">Compress PDF</Link></li>
              <li><Link to="/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/developer" className="hover:text-white transition-colors">Developer</Link></li>
              <li><Link to="/developer-dashboard" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
               <li><a href="mailto:ilovepdfly2@gmail.com" className="hover:text-white transition-colors">ilovepdfly2@gmail.com</a></li>
            </ul>
             <div className="mt-4">
                <h4 className="font-semibold text-md mb-2 text-gray-200">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/share/16sdjGNVGr/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                    <FacebookIcon className="h-6 w-6" />
                  </a>
                  <a href="https://wa.me/message/JYA22CVSYSZ4N1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="WhatsApp">
                    <WhatsAppIcon className="h-6 w-6" />
                  </a>
                  <a href="https://www.youtube.com/@btmobilecare" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                    <YoutubeIcon className="h-6 w-6" />
                  </a>
                </div>
            </div>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <h3 className="font-bold text-lg mb-4 text-white">Subscribe to our newsletter</h3>
            <p className="text-gray-400 mb-4">Get the latest news, articles, and resources, sent to your inbox weekly.</p>
            {subscribed ? (
                <div className="flex items-center gap-3 p-3 rounded-md bg-green-500/20 text-green-300">
                    <CheckCircleIcon className="w-6 h-6" />
                    <p className="font-semibold">Thank you for subscribing!</p>
                </div>
            ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        aria-label="Email for newsletter"
                        required
                        className="flex-grow w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-brand-red focus:border-transparent text-white placeholder-gray-400"
                    />
                    <button type="submit" className="bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2 px-4 rounded-md transition-colors">
                        Subscribe
                    </button>
                </form>
            )}
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ILovePDFLY. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button onClick={() => onLegalLinkClick('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => onLegalLinkClick('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
