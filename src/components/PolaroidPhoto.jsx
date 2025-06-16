import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function PolaroidPhoto({
  caption,
  x,
  y,
  rotation = 3,
  linkToChapterId,
  onClick,
  baseFontSize,
  imageUrl // URL de la imagen a mostrar
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick && linkToChapterId) {
      onClick(linkToChapterId);
    }
  };

  const dynamicCaptionSize = `calc(${baseFontSize}px * 0.6)`;

  return (
    <motion.div
      className={`polaroid absolute ${linkToChapterId ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rotation}deg)`,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.1,
        rotate: 0,
        zIndex: 20,
        boxShadow: "0 12px 24px hsla(var(--background), 0.5)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleClick}
    >
      <div className="w-32 sm:w-40 md:w-44 relative">
        {/* Pin top visual */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-5 bg-gray-400/70 rounded-full shadow-sm z-10 border border-gray-500/50"></div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-300/80 rounded-full shadow-sm border border-gray-400/60"></div>

        {/* Imagen polaroid */}
        <div className="w-full h-28 sm:h-32 md:h-36 bg-white mb-1.5 relative overflow-hidden rounded shadow-inner">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={caption}
              className="absolute inset-0 w-full h-full object-cover filter sepia-[.2] contrast-[.9] brightness-[.95]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Imagen no disponible
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-300/10 to-indigo-400/15 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>

        {/* Pie de foto */}
        <div className="text-center pb-1.5 px-1">
          <p
            className="text-black font-medium leading-tight"
            style={{ fontFamily: 'IM Fell English, serif', fontSize: dynamicCaptionSize }}
          >
            {caption}
          </p>
        </div>

        {/* Cintas en las esquinas superiores */}
        <div className="absolute -top-0.5 -left-0.5 w-5 h-3 bg-white/70 opacity-80 rotate-[30deg] border border-white/80"></div>
        <div className="absolute -top-0.5 -right-0.5 w-5 h-3 bg-white/70 opacity-80 -rotate-[30deg] border border-white/80"></div>
      </div>
    </motion.div>
  );
}
