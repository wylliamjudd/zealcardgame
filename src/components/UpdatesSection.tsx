import React from 'react';

const ForumSection: React.FC = () => (
  <section className="flex h-[calc(100vh-4rem)] w-full bg-gradient-to-t from-blue-900 to-neutral-950 items-center justify-center">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-4xl font-bold mb-6 text-blue-400">Forum</h2>
      <p className="text-lg text-neutral-200">Discuss and share in the Zeal forum. (Coming soon!)</p>
    </div>
  </section>
);

export default ForumSection;
