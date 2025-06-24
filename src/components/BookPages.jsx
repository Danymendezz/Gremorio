import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Users, ArrowLeft, Play, Pause, Volume2, VolumeX, Rewind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostIt } from '@/components/PostIt';
import { PolaroidPhoto } from '@/components/PolaroidPhoto';
import { FinalMural } from '@/components/FinalMural';
import { CornerNote } from '@/components/CornerNote';
import { toast } from '@/components/ui/use-toast';
import { Slider } from "@/components/ui/slider";


const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export function BookPages({ bookData, currentPage, onPageChange, onClose, fontSize, navigateToChapter }) {
  // Verificación al inicio
  if (!bookData || !bookData.chapters) {
    return <div>Cargando datos del libro...</div>; // O null, o un spinner
  }
  const [isFlipping, setIsFlipping] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem('audioMuted');
    return savedMute ? JSON.parse(savedMute) : false;
  });
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('audioVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });

  const totalPages = bookData.chapters.length + 1; 

  const currentChapterData = currentPage < bookData.chapters.length 
    ? bookData.chapters[currentPage] 
    : null;

  useEffect(() => {
    localStorage.setItem('audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]);


  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      }
      const setAudioTime = () => setCurrentTime(audio.currentTime);

      audio.addEventListener('loadeddata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('volumechange', () => {
        if (!audio.muted) setVolume(audio.volume);
      });
      
      if (currentChapterData?.songUrl) {
        if (audio.src !== currentChapterData.songUrl) {
          audio.src = currentChapterData.songUrl;
          audio.load();
        }
        audio.currentTime = currentChapterData.songStartTime || 0;
        if (!isMuted) {
           audio.play().catch(error => console.warn("Audio play failed:", error));
        } else {
           audio.pause();
        }
      } else {
        audio.pause();
        audio.src = "";
      }

      return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
        audio.removeEventListener('volumechange', () => {
         if (!audio.muted) setVolume(audio.volume);
        });
      }
    }
  }, [currentPage, currentChapterData, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(e => console.warn("Error playing audio:", e));
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const restartSong = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentChapterData?.songStartTime || 0;
      if (!isPlaying) audioRef.current.play().catch(e => console.warn("Error playing audio:", e));
    }
  };


  const handleNavigation = (targetChapterId) => {
    if (!targetChapterId) {
       toast({
        title: "🚧 Característica no implementada",
        description: "¡Este elemento aún no tiene un enlace! Puedes solicitarlo en tu próximo mensaje. 🚀",
        variant: "default",
      });
      return;
    }
    const targetIndex = bookData.chapters.findIndex(ch => ch.id === targetChapterId);
    if (targetIndex !== -1) {
      setHistoryStack(prev => [...prev, currentPage]);
      onPageChange(targetIndex);
    } else {
      toast({
        title: "⚠️ Capítulo no encontrado",
        description: "El enlace parece estar roto.",
        variant: "destructive"
      });
    }
  };

  const goBackInHistory = () => {
    if (historyStack.length > 0) {
      const previousPage = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      onPageChange(previousPage);
    }
  };
  
  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages || isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      onPageChange(newPage);
      setIsFlipping(false);
    }, 700);
  };

  const isFinalPage = currentPage === totalPages - 1;

  const pageVariants = {
    initial: (direction) => ({ opacity: 0, x: direction > 0 ? "100%" : "-100%", rotateY: direction > 0 ? -15 : 15 }),
    animate: { opacity: 1, x: 0, rotateY: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: (direction) => ({ opacity: 0, x: direction > 0 ? "-100%" : "100%", rotateY: direction > 0 ? 15 : -15, transition: { duration: 0.6, ease: "easeIn" } })
  };
  
  const [direction, setDirection] = useState(0);

  const paginate = (newPage) => {
    setDirection(newPage > currentPage ? 1 : -1);
    handlePageChange(newPage);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black p-2 sm:p-4 z-40">
      <audio ref={audioRef} />
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-50 flex space-x-2">
        <Button onClick={onClose} variant="outline" size="sm" className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30" aria-label="Cerrar Grimorio">
          <X className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Cerrar</span>
        </Button>
        {historyStack.length > 0 && (
          <Button onClick={goBackInHistory} variant="outline" size="sm" className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30" aria-label="Volver a la página anterior">
            <ArrowLeft className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Volver</span>
          </Button>
        )}
      </div>
      
      {currentChapterData?.songUrl && (
        <div className="audio-player fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-2 rounded-lg shadow-xl">
          <Button onClick={togglePlayPause} size="icon" variant="ghost" aria-label={isPlaying ? "Pausar" : "Reproducir"}>
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button onClick={restartSong} size="icon" variant="ghost" aria-label="Reiniciar canción">
            <Rewind className="w-5 h-5" />
          </Button>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="w-32 sm:w-48"
            aria-label="Progreso de la canción"
          />
          <span className="time-display text-xs">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <Button onClick={() => setIsMuted(!isMuted)} size="icon" variant="ghost" aria-label={isMuted ? "Activar sonido" : "Silenciar"}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <Slider 
            value={[isMuted ? 0 : volume]} 
            max={1} 
            step={0.01} 
            onValueChange={(value) => { setIsMuted(false); setVolume(value[0]); }} 
            className="w-20 sm:w-24"
            aria-label="Volumen"
          />
        </div>
      )}


      <div className="absolute top-12 sm:top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/60 border border-purple-700/70 rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-purple-300 text-xs sm:text-sm">
          Página {currentPage + 1} de {totalPages}
        </div>
      </div>

      <div className="relative w-full h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] max-w-none sm:max-w-7xl aspect-auto sm:aspect-[4/3] perspective-1500 mt-12 sm:mt-16">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="parchment w-full h-full rounded-lg relative overflow-hidden flex items-center justify-center shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          >
            {isFinalPage ? (
              <div className="p-4 sm:p-8 md:p-12 h-full w-full overflow-y-auto" style={{ fontSize: `${fontSize}px` }}>
                <FinalMural women={bookData.finalMural.women} authorReveal={bookData.author} />
              </div>
            ) : currentChapterData ? (
              <div className="p-4 sm:p-8 md:p-12 h-full w-full relative overflow-y-auto" style={{ fontSize: `${fontSize}px` }}>
                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center"
                  style={{ fontFamily: 'Cinzel, serif', color: 'hsl(var(--primary))', textShadow: '1px 1px 3px hsla(var(--background), 0.7)', fontSize: `calc(${fontSize}px * 1.8)` }}
                  initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                >
                  {currentChapterData.title}
                </motion.h2>

                <motion.div className="w-24 sm:w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-6 sm:mb-8 md:mb-12"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
                ></motion.div>

                <motion.div className="manuscript-text leading-relaxed max-w-4xl mx-auto"
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                >
                  <span className="ornate-capital" style={{ fontSize: `calc(${fontSize}px * 2.5)` }}>
                    {currentChapterData.content.charAt(0)}
                  </span>
                  {currentChapterData.content.slice(1)}
                </motion.div>

                {currentChapterData.postIts?.map((postIt, index) => (
                  <motion.div key={postIt.id} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: postIt.rotation || -2.5 }} transition={{ delay: 1 + index * 0.2, type: "spring" }} onClick={() => handleNavigation(postIt.linkToChapterId)} className={postIt.linkToChapterId ? "cursor-pointer" : ""}>
                    <PostIt {...postIt} baseFontSize={fontSize} />
                  </motion.div>
                ))}
                {currentChapterData.photos?.map((photo, index) => (
                  <motion.div key={photo.id} initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: photo.rotation || 3.5 }} transition={{ delay: 1.5 + index * 0.3, type: "spring" }} onClick={() => handleNavigation(photo.linkToChapterId)} className={photo.linkToChapterId ? "cursor-pointer" : ""}>
                    <PolaroidPhoto 
                      {...photo} 
                      baseFontSize={fontSize} 
                      imageUrl={photo.url}  // Asegúrate de pasar photo.url como imageUrl
                      link={photo.link}     // Pasar el enlace como prop link
                    />
                  </motion.div>
                ))}
                {currentChapterData.cornerNotes?.map((note, index) => (
                   <motion.div key={note.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 + index * 0.2, type: "spring" }} onClick={() => handleNavigation(note.linkToChapterId)} className={note.linkToChapterId ? "cursor-pointer" : ""}>
                    <CornerNote {...note} baseFontSize={fontSize} />
                  </motion.div>
                ))}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 md:-left-12">
          <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 0 || isFlipping} variant="outline" size="lg" className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30 disabled:opacity-30 p-2 md:p-3" aria-label="Página anterior">
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 md:-right-12">
          <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages - 1 || isFlipping} variant="outline" size="lg" className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30 disabled:opacity-30 p-2 md:p-3" aria-label="Siguiente página">
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>

        {!isFinalPage && (
          <div className="absolute bottom-20 sm:bottom-4 right-2 sm:right-4">
            <Button onClick={() => paginate(totalPages - 1)} variant="outline" size="sm" className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30 text-xs md:text-sm">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Ver Mural
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}