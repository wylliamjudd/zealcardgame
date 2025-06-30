import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EmailCaptureModal from './EmailCaptureModal';

const KickstarterSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Extract video ID from YouTube URL
  const videoUrl = 'https://youtu.be/CsTy9vqFo1E?feature=shared';
  const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/)?.[1] || 'CsTy9vqFo1E';

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-gray-900 relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-12">
        {/* Section Title */}
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-8"
        >
          Back Us on Kickstarter
        </motion.h2>

        {/* Video Container with Thematic Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto mb-8 max-w-2xl"
        >
          {/* Decorative frame */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl opacity-75 blur-lg" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl" />
          
          {/* Video iframe */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="Zeal TCG Kickstarter Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Recruit characters, deploy devices, and cast spells!
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            Pledge Now
          </motion.button>
        </motion.div>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};

export default KickstarterSection;