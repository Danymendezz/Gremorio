import React from 'react';
import { motion } from 'framer-motion';

export function CornerNote({ text, position = "top-left", rotation = -5, linkToChapterId, onClick, baseFontSize }) {
  const positionClasses = {
    "top-left": "top-2 left-2 sm:top-4 sm:left-4",
    "top-right": "top-2 right-2 sm:top-4 sm:right-4",
    "bottom-left": "bottom-2 left-2 sm:bottom-4 sm:left-4",
    "bottom-right": "bottom-2 right-2 sm:bottom-4 sm:right-4",
  };

  const handleClick = () => {
    if (onClick && linkToChapterId) {
      onClick(linkToChapterId);
    }
  };

  const dynamicFontSize = `calc(${baseFontSize}px * 0.65)`;

  return (
    <motion.div
      className={`corner-note ${positionClasses[position] || positionClasses["top-left"]} ${linkToChapterId ? 'cursor-pointer hover:text-purple-400' : ''}`}
      style={{ fontSize: dynamicFontSize, fontFamily: "'Dancing Script', cursive" }}
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={handleClick}
    >
      {text}
    </motion.div>
  );
}
