
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../constants';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - ILovePDFLY Blog`;

      // Add JSON-LD structured data for SEO
      const scriptId = 'blog-post-structured-data';
      const existingScript = document.getElementById(scriptId);
      if(existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "name": post.title,
          "description": post.excerpt,
          "image": post.image,
          "author": {
              "@type": "Person",
              "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "ILovePDFLY",
            "logo": {
              "@type": "ImageObject",
              "url": "https://ilovepdfly.com/favicon.svg"
            }
          },
          "datePublished": new Date(post.date).toISOString()
      });
      document.head.appendChild(script);

      return () => {
        // Cleanup on unmount
        const scriptToRemove = document.getElementById(scriptId);
        if(scriptToRemove) scriptToRemove.remove();
        document.title = 'ILovePDFLY - Free Tools to Merge, Split, Compress & Convert PDF';
      };
    } else {
        // If post not found, navigate away
        navigate('/blog');
    }
  }, [post, navigate]);

  if (!post) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/blog" className="text-brand-red hover:underline font-semibold">
              &larr; Back to Blog
            </Link>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
              {post.tags.map(tag => (
                  <span key={tag} className="text-xs bg-brand-red/10 text-brand-red font-semibold px-2.5 py-1 rounded-full">
                      {tag}
                  </span>
              ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            <img src={post.authorImage} alt={post.author} className="h-12 w-12 rounded-full object-cover"/>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{post.author}</p>
                <p className="text-gray-500 dark:text-gray-400">Posted on {post.date}</p>
            </div>
          </div>
          
          <img src={post.image} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg mb-12" />

          <div className="prose lg:prose-xl dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;