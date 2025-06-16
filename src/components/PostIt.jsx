import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function PostIt({ text, x, y, rotation = -2.5, linkToChapterId, onClick, baseFontSize }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick && linkToChapterId) {
      onClick(linkToChapterId);
    }
  };

  const dynamicTextSize = `calc(${baseFontSize}px * 0.70)`;

  return (
    <motion.div
      className={`post-it-antique absolute select-none ${linkToChapterId ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rotation}deg)`
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.08, 
        rotate: 0,
        zIndex: 20,
        boxShadow: "0 10px 20px hsla(var(--background), 0.5)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={handleClick}
    >
      <div className="p-2 w-32 h-24 sm:p-3 sm:w-40 sm:h-28 md:p-3 md:w-44 md:h-32 relative">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-300/70 rounded-full shadow-sm border border-purple-400/50"></div>
        
        <div className="pt-2 h-full flex items-center justify-center">
          <p 
            className="text-center font-medium leading-tight text-white"
            style={{ fontFamily: 'IM Fell English, serif', fontSize: dynamicTextSize, textShadow: '1px 1px 1px hsla(0,0%,0%,0.4)'}}
          >
            {text}
          </p>
        </div>
        
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gradient-to-br from-transparent to-black/20 transform rotate-45 translate-x-1 translate-y-1"></div>
      </div>
    </motion.div>
  );
}