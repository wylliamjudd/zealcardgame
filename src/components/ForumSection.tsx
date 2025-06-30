import React, { useState } from 'react';

const mockNews = [
  { id: 1, title: 'Welcome to Zeal TCG!', summary: 'Learn about the new game.', date: '2025-05-16', comments: 8, content: 'Introducing the new game' },
  { id: 2, title: 'Mechanics', summary: 'See our new mechanics.', date: '2025-05-10', comments: 3, content: 'Discuss new mechanics.' },
  { id: 3, title: 'Lore', summary: 'The lore behind the game.', date: '2025-05-05', comments: 5, content: 'The lore behind the game.' },
  { id: 4, title: 'The Kickstarter', summary: 'Help us raise funds.', date: '2025-05-03', comments: 2, content: 'Join the Kickstarter.' },
  { id: 5, title: 'Q&A', summary: 'Answers to your questions.', date: '2025-05-01', comments: 7, content: 'Share your questions.' },
];

const ForumSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(mockNews[0].id);
  const selected = mockNews.find(n => n.id === selectedId);

  return (
    <section className="w-full h-full min-h-0 flex-1 bg-gradient-to-r from-blue-900 via-blue-950 to-neutral-950 rounded-xl shadow flex flex-row overflow-hidden">
      {/* Article Cards List */}
      <aside className="flex flex-col gap-3 py-6 px-2 w-[320px] min-w-[220px] bg-blue-950/80 border-r border-blue-900 h-full min-h-0 flex-1">
        <h2 className="text-xl font-bold mb-2 text-blue-200 pl-2">Forum Previews</h2>
        {mockNews.slice(0, 5).map(item => (
          <button
            key={item.id}
            className={`text-left rounded p-4 mb-1 transition-colors border-l-4 ${selectedId === item.id ? 'bg-blue-900/80 border-blue-400 text-white' : 'bg-neutral-900 border-transparent text-blue-100 hover:bg-blue-900/60'}`}
            onClick={() => setSelectedId(item.id)}
            aria-current={selectedId === item.id ? 'true' : undefined}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-blue-100">{item.title}</span>
              <span className="text-xs text-neutral-400 ml-2">{item.date}</span>
            </div>
            <div className="text-neutral-300 text-sm mb-1 line-clamp-2">{item.summary}</div>
            <div className="text-xs text-blue-400">{item.comments} comment{item.comments !== 1 ? 's' : ''}</div>
          </button>
        ))}
        <div className="mt-2 pl-2">
          <a href="/forum" className="text-blue-200 hover:text-white underline text-sm">View All &rarr;</a>
        </div>
      </aside>
      {/* Article Main Content */}
      <main className="flex-1 min-w-0 p-8 overflow-y-auto h-full min-h-0 flex flex-col">
        <h3 className="text-2xl font-bold mb-2 text-blue-300">{selected?.title}</h3>
        <div className="text-neutral-400 mb-2">{selected?.date} &middot; {selected?.comments} comment{selected?.comments !== 1 ? 's' : ''}</div>
        <article className="text-neutral-100 whitespace-pre-line">
          {selected?.content}
        </article>
      </main>
    </section>
  );
};


export default ForumSection;
