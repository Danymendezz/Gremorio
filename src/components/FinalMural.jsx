import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';

export function FinalMural({ women, authorReveal }) {
  const [selectedWoman, setSelectedWoman] = useState(null);
  const [showAuthor, setShowAuthor] = useState(false);

  return (
    <div className="h-full flex flex-col text-foreground">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 
          className="text-4xl md:text-5xl font-bold mb-2 text-black"
          style={{ 
            fontFamily: 'Cinzel, serif',
            textShadow: '1px 1px 0 hsl(var(--primary)), 2px 2px 0 hsl(var(--primary)/0.7), 3px 3px 0 hsl(var(--primary)/0.4), 0 0 10px hsl(var(--primary)/0.5)'
          }}
        >
          Mural de las Recordadas
        </h1>
        <div className="w-48 md:w-64 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 p-2">
        {women.map((woman, index) => (
          <motion.div
            key={woman.id}
            className="relative cursor-pointer group"
            initial={{ opacity: 0, scale: 0.5, rotate: Math.random() * 10 - 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 100, damping: 12 }}
            onClick={() => setSelectedWoman(woman)}
            whileHover={{ scale: 1.05, zIndex: 10, boxShadow: "0 0 25px hsl(var(--primary)/0.5)"}}
          >
            <div className="bg-black border-2 border-primary/70 p-3 rounded-lg shadow-lg shadow-primary/30 transition-all duration-300 group-hover:border-primary">
              <div className="bg-gray-800 p-1 rounded-sm">
                <div className="aspect-square bg-gray-700 rounded-sm relative overflow-hidden">
                  <img  
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" 
                    alt={`Retrato de ${woman.name}`}
                    src="https://images.unsplash.com/photo-1579695164284-8374fda58286" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20 mix-blend-plus-lighter opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="mt-2 text-center py-1">
                  <p 
                    className="text-sm font-bold text-primary-foreground"
                    style={{ fontFamily: 'Cinzel, serif', textShadow: "1px 1px 2px hsl(var(--background))" }}
                  >
                    {woman.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{woman.date}</p>
                </div>
              </div>
            </div>
            
            <motion.div
              className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            >
              <Eye className="w-8 h-8 text-primary" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: women.length * 0.2 + 0.5 }}
      >
        {!showAuthor ? (
          <motion.button
            onClick={() => setShowAuthor(true)}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-lg font-semibold text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300"
            whileHover={{ scale: 1.05, letterSpacing: "0.05em" }}
            whileTap={{ scale: 0.95 }}
          >
            Revelar el nombre del autor
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-card/80 border-2 border-primary rounded-lg p-6 backdrop-blur-sm"
          >
            <p className="text-accent text-base mb-1">El autor de este grimorio es:</p>
            <h2 
              className="golden-text text-3xl md:text-4xl font-bold"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              {authorReveal}
            </h2>
          </motion.div>
        )}
      </motion.div>

      {selectedWoman && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{opacity: 0}}
          onClick={() => setSelectedWoman(null)}
        >
          <motion.div
            className="bg-gradient-to-br from-card via-background to-card border-2 border-primary p-6 md:p-8 rounded-lg max-w-md w-full shadow-2xl shadow-primary/40"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{scale: 0.5, rotate: 10}}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-destructive mx-auto mb-3" />
              <h3 
                className="text-xl md:text-2xl font-bold mb-1 text-primary-foreground"
                style={{ fontFamily: 'Cinzel, serif', textShadow: "1px 1px 3px hsl(var(--primary)/0.5)" }}
              >
                {selectedWoman.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{selectedWoman.date}</p>
              <p 
                className="text-foreground leading-relaxed text-sm md:text-base"
                style={{ fontFamily: 'Spectral, serif' }}
              >
                {selectedWoman.memory}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}