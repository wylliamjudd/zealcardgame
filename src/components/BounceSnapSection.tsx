import React from 'react';
import { motion } from 'framer-motion';

interface BounceSnapSectionProps {
  children: React.ReactNode;
  index: number;
  activeIndex: number;
  centered?: boolean;
}

const bounceVariants = {
  inactive: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  active: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  enter: { y: 100, opacity: 0 }
};

const BounceSnapSection: React.FC<BounceSnapSectionProps> = ({ children, index, activeIndex, centered = true }) => {
  const isActive = activeIndex === index;

  
  // Remove fixed height to allow proper scrolling
  const baseClasses = "snap-start w-full flex";
  const alignment = "items-stretch justify-start";
  return (
    <motion.div
      className={`${baseClasses} ${alignment}`}
      variants={bounceVariants}
      initial="enter"
      animate={isActive ? "active" : "inactive"}
    >
      {children}
    </motion.div>
  );
};

export default BounceSnapSection;
