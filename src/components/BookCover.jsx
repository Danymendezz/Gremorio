
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

export function BookCover({ title, author, onOpen }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = () => {
    setIsUnlocking(true);
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <motion.div
      className="relative perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Book shadow */}
      <div className="absolute -bottom-8 left-4 right-4 h-8 bg-black/50 blur-xl rounded-full"></div>
      
      {/* Main book container */}
      <motion.div
        className="book-cover w-96 h-[600px] rounded-lg relative cursor-pointer"
        whileHover={{ scale: 1.02, rotateY: -5 }}
        transition={{ duration: 0.3 }}
        onClick={handleUnlock}
      >
        {/* Book spine */}
        <div className="book-spine absolute -left-6 top-0 w-6 h-full rounded-l-lg"></div>
        
        {/* Blood stains */}
        <div className="blood-stain absolute top-16 right-12 w-8 h-8"></div>
        <div className="blood-stain absolute bottom-20 left-8 w-6 h-6"></div>
        <div className="blood-stain absolute top-32 left-16 w-4 h-4"></div>
        
        {/* Mystical symbols */}
        <div className="mystical-symbol absolute top-8 left-8 text-2xl">☽</div>
        <div className="mystical-symbol absolute top-12 right-8 text-xl">✦</div>
        <div className="mystical-symbol absolute bottom-16 right-12 text-lg">⚡</div>
        <div className="mystical-symbol absolute bottom-8 left-12 text-xl">◊</div>
        
        {/* Scratches and wear marks */}
        <div className="absolute top-24 left-4 w-20 h-0.5 bg-gradient-to-r from-transparent via-orange-800 to-transparent opacity-60 rotate-12"></div>
        <div className="absolute bottom-32 right-6 w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-800 to-transparent opacity-40 -rotate-6"></div>
        
        {/* Title */}
        <div className="absolute inset-x-8 top-32 text-center">
          <motion.h1
            className="golden-text text-3xl font-bold mb-4 glow-effect"
            style={{ fontFamily: 'Cinzel, serif' }}
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h1>
          
          <motion.div
            className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-8"
            animate={isHovered ? { scaleX: 1.2 } : { scaleX: 1 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          
          <motion.p
            className="golden-text text-lg italic"
            style={{ fontFamily: 'IM Fell English, serif' }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            por {author}
          </motion.p>
        </div>
        
        {/* Central ornament */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
          <motion.div
            className="w-24 h-24 border-2 border-yellow-500 rounded-full flex items-center justify-center mystical-symbol text-4xl"
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            ⚜
          </motion.div>
        </div>
        
        {/* Lock mechanism */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2"
          animate={isUnlocking ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="lock-mechanism w-16 h-20 rounded-lg flex flex-col items-center justify-center">
            <motion.div
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isUnlocking ? (
                <Unlock className="w-8 h-8 text-yellow-500" />
              ) : (
                <Lock className="w-8 h-8 text-gray-400" />
              )}
            </motion.div>
            
            {/* Chain links */}
            <div className="flex mt-2 space-x-1">
              <div className="chain-link w-3 h-2 rounded-sm"></div>
              <div className="chain-link w-3 h-2 rounded-sm"></div>
              <div className="chain-link w-3 h-2 rounded-sm"></div>
            </div>
          </div>
        </motion.div>
        
        {/* Hover instruction */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="golden-text text-sm italic">
            Haz clic para abrir el grimorio
          </p>
        </motion.div>
        
        {/* Magical particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -20, -40],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
