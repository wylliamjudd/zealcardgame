import React, { useState } from 'react';

const mockNews = [
  { id: 1, title: 'Welcome to Zeal TCG!', summary: 'See the new game.', date: '2025-05-16', content: 'Full article' },
  { id: 2, title: 'New Mechanics', summary: 'Learn the rules.', date: '2025-05-10', content: 'Full article' },
  { id: 3, title: 'Lore of the game', summary: 'Explore the world.', date: '2025-05-05', content: 'Full article' },
];

const BlogPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number|null>(mockNews[0]?.id || null);
  const selectedNews = mockNews.find(n => n.id === selectedId);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-neutral-950">
      {/* News List */}
      <aside className="w-96 min-w-[280px] max-w-xs border-r border-neutral-800 overflow-y-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-highlight">News</h2>
        <ul className="flex flex-col gap-4">
          {mockNews.map(news => (
            <li key={news.id}>
              <button
                className={`w-full text-left p-4 rounded-lg transition-colors font-medium ${selectedId === news.id ? 'bg-pink-800 text-white' : 'bg-neutral-900 text-neutral-100 hover:bg-neutral-800'}`}
                onClick={() => setSelectedId(news.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{news.title}</span>
                  <span className="text-xs text-neutral-400 ml-2">{news.date}</span>
                </div>
                <div className="text-neutral-300 text-sm">{news.summary}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      {/* News Content Panel */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8 pl-0">
        <h1 className="text-3xl font-bold mb-4 text-highlight">{selectedNews?.title}</h1>
        <div className="text-neutral-400 mb-2">{selectedNews?.date}</div>
        <article className="text-neutral-100 whitespace-pre-line text-lg">
          {selectedNews?.content}
        </article>
      </main>
    </div>
  );
};

export default BlogPage;
