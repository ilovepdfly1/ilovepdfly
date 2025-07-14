import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';
import { StarIcon, LockIcon } from './icons';

interface ToolCardProps {
  tool: Tool;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, toolId: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorite, onToggleFavorite }) => {
  const { id, title, description, Icon, color, isNew, isPremium } = tool;

  return (
    <Link 
      to={`/${id}`} 
      className="relative flex flex-col items-start p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-lg dark:hover:shadow-gray-800/50 hover:-translate-y-1 transition-all duration-300 group border-glow-hover"
    >
       <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(e, id); }}
        className="absolute top-2 left-2 p-1 z-20 text-gray-400 dark:text-gray-500 hover:text-yellow-400 transition-transform duration-200 hover:scale-125"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon className={`w-6 h-6 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'fill-none'}`} />
      </button>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        {isPremium && (
          <div className="flex items-center gap-1 bg-yellow-100 dark:bg-gray-800 border border-yellow-400 dark:border-yellow-500 text-yellow-600 dark:text-yellow-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            <LockIcon className="w-3 h-3" />
            <span>Premium</span>
          </div>
        )}
        {isNew && (
          <span className="bg-red-100 dark:bg-gray-800 border border-red-400 dark:border-red-500 text-red-500 dark:text-red-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            New!
          </span>
        )}
      </div>

      <div className={`p-3 rounded-md ${color}`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
    </Link>
  );
};

export default ToolCard;