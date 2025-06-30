import React from 'react';

const mockThreads = [
  {
    id: 1,
    title: 'Welcome to Zeal TCG! [Official]',
    author: 'Admin',
    replies: 12,
    views: 245,
    lastReply: { user: 'Zealmaster', date: '2025-05-17' },
    pinned: true,
  },
  {
    id: 2,
    title: 'How to play the game',
    author: 'DevTeam',
    replies: 4,
    views: 88,
    lastReply: { user: 'TCGPlayer', date: '2025-05-16' },
    pinned: false,
  },
  {
    id: 3,
    title: 'Techniques',
    author: 'Zealmaster',
    replies: 7,
    views: 102,
    lastReply: { user: 'Depender', date: '2025-05-15' },
    pinned: false,
  },
  {
    id: 4,
    title: 'Playmat Preview',
    author: 'Gamerdude',
    replies: 2,
    views: 44,
    lastReply: { user: 'Admin', date: '2025-05-14' },
    pinned: false,
  },
  {
    id: 5,
    title: 'Community Q&A',
    author: 'Admin',
    replies: 9,
    views: 150,
    lastReply: { user: 'Cosplayer', date: '2025-05-13' },
    pinned: false,
  },
];

const ForumBoard: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-t from-blue-950 to-neutral-950 flex flex-col items-center py-8 px-2">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Zeal TCG Forums</h1>
      <div className="w-full max-w-4xl bg-neutral-900 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-blue-900 text-blue-200">
            <tr>
              <th className="py-3 px-4 font-semibold">Thread</th>
              <th className="py-3 px-2">Author</th>
              <th className="py-3 px-2">Replies</th>
              <th className="py-3 px-2">Views</th>
              <th className="py-3 px-2">Last Reply</th>
            </tr>
          </thead>
          <tbody>
            {mockThreads.map(thread => (
              <tr key={thread.id} className={thread.pinned ? 'bg-blue-950/50 font-bold border-l-4 border-blue-400' : 'border-l-4 border-transparent hover:bg-blue-950/30'}>
                <td className="py-2 px-4">
                  <a href={`/forum/${thread.id}`} className="hover:underline text-blue-300">{thread.title}</a>
                  {thread.pinned && <span className="ml-2 px-2 py-0.5 bg-blue-700 text-xs rounded text-white">Pinned</span>}
                </td>
                <td className="py-2 px-2">{thread.author}</td>
                <td className="py-2 px-2">{thread.replies}</td>
                <td className="py-2 px-2">{thread.views}</td>
                <td className="py-2 px-2 text-xs">
                  <span>{thread.lastReply.user}</span><br />
                  <span className="text-neutral-400">{thread.lastReply.date}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default ForumBoard;
