// Module declarations for Forum components
declare module './ForumCategoriesList' {
  import { Category } from './types';
  const ForumCategoriesList: React.FC<{
    categories: Category[];
    onSelectCategory: (categoryId: number) => void;
  }>;
  export default ForumCategoriesList;
}

declare module './ForumThreadsList' {
  import { Thread } from './types';
  const ForumThreadsList: React.FC<{
    threads: Thread[];
    onSelectThread: (threadId: number) => void;
  }>;
  export default ForumThreadsList;
}

declare module './ThreadView' {
  import { Thread, Post } from './types';
  const ThreadView: React.FC<{
    thread: Thread;
    posts: Post[];
    onBack: () => void;
  }>;
  export default ThreadView;
}

declare module './mockData' {
  import { Category, Thread, Post } from './types';
  export const mockCategories: Category[];
  
  
}
