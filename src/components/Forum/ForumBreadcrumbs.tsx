import React from 'react';

interface ForumBreadcrumbsProps {
  categoryName?: string;
  threadTitle?: string;
  onHomeClick?: () => void;
  onCategoryClick?: () => void;
}

const ForumBreadcrumbs: React.FC<ForumBreadcrumbsProps> = ({ categoryName, threadTitle, onHomeClick, onCategoryClick }) => {
  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-1 text-neutral-400">
        <li>
          <button
            type="button"
            className="hover:underline text-highlight font-medium"
            onClick={onHomeClick}
          >
            Forum
          </button>
        </li>
        {categoryName && (
          <li className="flex items-center">
            <span className="mx-1">/</span>
            <button
              type="button"
              className="hover:underline text-highlight font-medium"
              onClick={onCategoryClick}
            >
              {categoryName}
            </button>
          </li>
        )}
        {threadTitle && (
          <li className="flex items-center">
            <span className="mx-1">/</span>
            <span className="text-neutral-300">{threadTitle}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default ForumBreadcrumbs;
