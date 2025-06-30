import React from 'react';
import ForumBreadcrumbs from './ForumBreadcrumbs';
import { Category } from './types';

interface ForumCategoriesListProps {
  categories: Category[];
  onCategorySelect: (categoryId: number) => void;
}

const ForumCategoriesList: React.FC<ForumCategoriesListProps> = ({ 
  categories, 
  onCategorySelect 
}) => {
  // Icons for categories - these are just SVG paths for different category types
  const icons = {
    megaphone: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    dice: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.675 12l-7.5-7.5a1 1 0 00-1.4 0l-7.5 7.5a1 1 0 000 1.4l7.5 7.5a1 1 0 001.4 0l7.5-7.5a1 1 0 000-1.4v0z" />
      </svg>
    ),
    book: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    chat: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-4">
        {/* Breadcrumbs for categories screen */}
        <ForumBreadcrumbs onHomeClick={() => {}} />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-fuchsia-500 text-center">
        Zeal Forums
      </h1>
      <p className="text-neutral-300 text-center mb-8 max-w-2xl mx-auto">
        Join the conversation about the Zeal TCG. Discuss game mechanics, lore, and connect with other players in our community forums.
      </p>
      
      <div className="grid gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className="bg-neutral-900/70 border border-fuchsia-700/20 hover:border-fuchsia-500/40 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-fuchsia-900/30 hover:translate-y-[-2px]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-fuchsia-900/30 rounded-full text-fuchsia-400 flex-shrink-0">
                {category.iconName && icons[category.iconName as keyof typeof icons]}
              </div>
              
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-fuchsia-300">{category.name}</h2>
                <p className="text-neutral-400 mt-1">{category.description}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
                  <div className="text-neutral-500">
                    <span className="text-fuchsia-400 font-medium">{category.threadCount}</span> threads
                  </div>
                  <div className="text-neutral-500">
                    <span className="text-fuchsia-400 font-medium">{category.postCount}</span> posts
                  </div>
                  {category.lastActivity && (
                    <div className="text-neutral-500">
                      Latest: <span className="text-pink-400 hover:underline">
                        {category.lastActivity.threadTitle}
                      </span> by <span className="text-fuchsia-300">{category.lastActivity.user}</span> on {category.lastActivity.date}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0 text-highlight">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumCategoriesList;
