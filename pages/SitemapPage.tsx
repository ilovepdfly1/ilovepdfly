
import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, blogPosts } from '../constants';
import { Tool } from '../types';

const SitemapPage: React.FC = () => {

    const categoryConfig: Record<string, { title: string; tools: Tool[] }> = {
        organize: { title: 'Organize PDF', tools: [] },
        optimize: { title: 'Optimize PDF', tools: [] },
        'convert-to': { title: 'Convert to PDF', tools: [] },
        'convert-from': { title: 'Convert from PDF', tools: [] },
        edit: { title: 'Edit & Sign PDF', tools: [] },
        security: { title: 'Secure & Sign PDF', tools: [] },
    };

    const groupedTools = TOOLS.reduce((acc, tool) => {
        const categoryKey = tool.category || 'organize';
        if (!acc[categoryKey]) {
            acc[categoryKey] = { title: categoryConfig[categoryKey]?.title || 'Tools', tools: [] };
        }
        acc[categoryKey].tools.push(tool);
        return acc;
    }, {} as Record<string, { title: string; tools: Tool[] }>);


  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Sitemap</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              An overview of all pages and resources available on ILovePDFLY.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Pages */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 lg:col-span-1">
              <h2 className="text-2xl font-bold text-brand-red border-b-2 border-brand-red/30 pb-2 mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Home</Link></li>
                <li><Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Pricing</Link></li>
                <li><Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">FAQ</Link></li>
                <li><Link to="/developer" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Developer</Link></li>
              </ul>
            </div>

            {/* PDF Tools */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 lg:col-span-2">
                <h2 className="text-2xl font-bold text-brand-red border-b-2 border-brand-red/30 pb-2 mb-4">PDF Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {Object.values(groupedTools).map(category => (
                        <div key={category.title} className="space-y-2">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{category.title}</h3>
                            <ul className="space-y-1">
                            {category.tools.map(tool => (
                                <li key={tool.id}><Link to={`/${tool.id}`} className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">{tool.title}</Link></li>
                            ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Blog Posts */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 lg:col-span-3">
              <h2 className="text-2xl font-bold text-brand-red border-b-2 border-brand-red/30 pb-2 mb-4">Blog Articles</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {blogPosts.map(post => (
                  <li key={post.slug}>
                    <Link to={`/blog/${post.slug}`} className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;
