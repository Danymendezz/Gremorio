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
  if (!bookData || !bookData.chapters) {
    return <div className="text-black p-4 sm:p-8 md:p-12 h-full w-full overflow-y-auto" style={{ fontSize: `${fontSize}px` }}>Cargando datos del libro...</div>;
  }

  const isFinalMuralPage = currentPage === bookData.chapters.length;
  const [isFlipping, setIsFlipping] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const [hasSong, setHasSong] = useState(false);
  const [direction, setDirection] = useState(0);

  // Audio player state
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
  const currentChapterData = currentPage < bookData.chapters.length ? bookData.chapters[currentPage] : null;

  // Persist mute and volume settings
  useEffect(() => {
    localStorage.setItem('audioMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]);

  // Audio effect
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const songAvailable = Boolean(currentChapterData?.songUrl);
    setHasSong(songAvailable);

    if (!songAvailable) {
      audio.pause();
      audio.src = "";
      setIsPlaying(false);
      return;
    }

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      if (!audio.muted) setVolume(audio.volume);
    };
    const handleError = (e) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
      toast({
        title: "Error de audio",
        description: "No se pudo cargar la canción",
        variant: "destructive"
      });
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.addEventListener('error', handleError);

    if (audio.src !== currentChapterData.songUrl) {
      audio.src = currentChapterData.songUrl;
      audio.load();
    }

    audio.currentTime = currentChapterData.songStartTime || 0;
    if (!isMuted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => console.warn("Autoplay failed:", error));
      }
    }

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.removeEventListener('error', handleError);
    };
  }, [currentPage, currentChapterData, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.warn("Play error:", e);
          toast({
            title: "Error de reproducción",
            description: "No se pudo iniciar la reproducción",
            variant: "destructive"
          });
        });
      }
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const restartSong = () => {
    if (audioRef.current && currentChapterData?.songUrl) {
      audioRef.current.currentTime = currentChapterData.songStartTime || 0;
      if (!isPlaying) {
        audioRef.current.play().catch(e => console.warn("Play error:", e));
      }
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
    setDirection(newPage > currentPage ? 1 : -1);
    setTimeout(() => {
      onPageChange(newPage);
      setIsFlipping(false);
    }, 1000);
  };

  const paginate = (newPage) => {
    handlePageChange(newPage);
  };

  const isFinalPage = currentPage === totalPages - 1;
  const shouldShowPlayer = hasSong && currentChapterData?.songUrl;

  // Render a single page's content
  const renderPageContent = (pageIndex) => {
    if (pageIndex === totalPages - 1) {
      return (
        <div className="p-4 sm:p-8 md:p-12 h-full w-full overflow-y-auto text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>
          <FinalMural 
            women={bookData.finalMural?.women || []} 
            authorReveal={bookData.finalMural?.author || ''} 
            fontSize={fontSize}
          />
        </div>
      );
    } else if (pageIndex < bookData.chapters.length) {
      const chapterData = bookData.chapters[pageIndex];
      return (
        <div className="p-4 sm:p-8 md:p-12 h-full w-full relative overflow-y-auto text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center"
            style={{ 
              fontFamily: 'Cinzel, serif', 
              color: 'hsl(var(--primary))', 
              textShadow: '1px 1px 3px hsla(var(--background), 0.7)', 
              fontSize: `calc(${fontSize}px * 1.8)` 
            }}
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.2 }}
          >
            {chapterData.title}
          </motion.h2>
          <motion.div 
            className="w-24 sm:w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-6 sm:mb-8 md:mb-12"
            initial={{ scaleX: 0 }} 
            animate={{ scaleX: 1}} 
            transition={{ delay: 0.4, duration: 0.8 }}
          ></motion.div>
          <motion.div 
            className="manuscript-text leading-relaxed max-w-4xl mx-auto text-black"
            style={{ fontSize: `${fontSize}px`, color: '#000000' }}
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.6 }}
          >
            <span className="ornate-capital text-black" style={{ fontSize: `calc(${fontSize}px * 2.5)`, color: '#000000' }}>
              {chapterData.content.charAt(0)}
            </span>
            {chapterData.content.slice(1)}
          </motion.div>
          {chapterData.postIts?.map((postIt, index) => (
            <motion.div 
              key={postIt.id} 
              initial={{ scale: 0, rotate: -180 }} 
              animate={{ scale: 1, rotate: postIt.rotation || -2.5 }} 
              transition={{ delay: 1 + index * 0.2, type: "spring" }} 
              onClick={() => handleNavigation(postIt.linkToChapterId)} 
              className={postIt.linkToChapterId ? "cursor-pointer" : ""}
            >
              <PostIt {...postIt} baseFontSize={fontSize} />
            </motion.div>
          ))}
          {chapterData.photos?.map((photo, index) => (
            <motion.div 
              key={photo.id} 
              initial={{ scale: 0, rotate: 180 }} 
              animate={{ scale: 1, rotate: photo.rotation || 3.5 }} 
              transition={{ delay: 1.5 + index * 0.3, type: "spring" }} 
              onClick={() => handleNavigation(photo.linkToChapterId)} 
              className={photo.linkToChapterId ? "cursor-pointer" : ""}
            >
              <PolaroidPhoto {...photo} baseFontSize={fontSize} imageUrl={photo.url} link={photo.link} />
            </motion.div>
          ))}
          {chapterData.cornerNotes?.map((note, index) => (
            <motion.div 
              key={note.id} 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 1.8 + index * 0.2, type: "spring" }} 
              onClick={() => handleNavigation(note.linkToChapterId)} 
              className={note.linkToChapterId ? "cursor-pointer" : ""}
            >
              <CornerNote {...note} baseFontSize={fontSize} />
            </motion.div>
          ))}
        </div>
      );
    }
    return <div className="p-4 sm:p-8 md:p-12 h-full w-full overflow-y-auto text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>.</div>;
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black p-2 sm:p-4 z-40" style={{ fontSize: `${fontSize}px` }}>
      <audio ref={audioRef} />
      
      {/* Top navigation buttons */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-50 flex space-x-2">
        <Button 
          onClick={onClose} 
          variant="outline" 
          size="sm" 
          className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30" 
          aria-label="Cerrar Grimorio"
        >
          <X className="w-4 h-4 sm:mr-2" /> 
          <span className="hidden sm:inline">Cerrar</span>
        </Button>
        {historyStack.length > 0 && (
          <Button 
            onClick={goBackInHistory} 
            variant="outline" 
            size="sm" 
            className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30" 
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" /> 
            <span className="hidden sm:inline">Volver</span>
          </Button>
        )}
      </div>

      {/* Audio Player */}
      {shouldShowPlayer && (
        <div className="audio-player fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-3 rounded-lg shadow-xl bg-black/80 backdrop-blur-sm border border-purple-500/50 flex items-center gap-3">
          <Button 
            onClick={togglePlayPause} 
            size="icon" 
            variant="ghost" 
            aria-label={isPlaying ? "Pausar" : "Reproducir"} 
            className="text-purple-300 hover:bg-purple-700/30"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button 
            onClick={restartSong} 
            size="icon" 
            variant="ghost" 
            aria-label="Reiniciar canción" 
            className="text-purple-300 hover:bg-purple-700/30"
          >
            <Rewind className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="time-display text-xs text-purple-300 min-w-[80px] text-center">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="w-32 sm:w-48"
              aria-label="Progreso de la canción"
            />
          </div>
          <Button 
            onClick={() => setIsMuted(!isMuted)} 
            size="icon" 
            variant="ghost" 
            aria-label={isMuted ? "Activar sonido" : "Silenciar"} 
            className="text-purple-300 hover:bg-purple-700/30"
          >
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

      {/* Page counter */}
      <div className="absolute top-12 sm:top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/60 border border-purple-700/70 rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-purple-300 text-xs sm:text-sm">
          Página {currentPage + 1} de {totalPages}
        </div>
      </div>

      {/* Book container */}
      <div className="book-container relative w-full h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] max-w-7xl perspective-1500 mt-12 sm:mt-16">
        <div className="book w-full h-full flex justify-center items-center">
          {/* Left page */}
          <div className="page left-page bg-white shadow-lg text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>
            {currentPage > 0 ? renderPageContent(currentPage - 1) : <div className="p-4 sm:p-8 md:p-12 h-full w-full overflow-y-auto text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>.</div>}
          </div>
          
          {/* Right page */}
          <div className="page right-page bg-white shadow-lg text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>
            {renderPageContent(currentPage)}
          </div>

          {/* Flipping page */}
          <AnimatePresence initial={false}>
            {isFlipping && (
              <motion.div
                key={`flipping-${currentPage}`}
                className={`page flipping-page bg-white shadow-lg text-black ${direction > 0 ? 'right-page' : 'left-page'}`}
                initial={{ rotateY: direction > 0 ? 0 : -180 }}
                animate={{ rotateY: direction > 0 ? -180 : 0 }}
                exit={{ rotateY: direction > 0 ? -180 : 0 }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="page-front bg-white text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>
                  {direction > 0 ? renderPageContent(currentPage) : currentPage > 0 ? renderPageContent(currentPage - 1) : <div className="p-4 sm:p-8 md:p-12 h-full w-full overflow-y-auto text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>.</div>}
                </div>
                <div className="page-back bg-white text-black" style={{ fontSize: `${fontSize}px`, color: '#000000' }}>
                  {direction > 0 ? renderPageContent(currentPage + 1) : renderPageContent(currentPage)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-8 md:-left-12">
          <Button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 0 || isFlipping} 
            variant="outline" 
            size="lg" 
            className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30 disabled:opacity-30 p-2 md:p-3" 
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-8 md:-right-12">
          <Button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages - 1 || isFlipping} 
            variant="outline" 
            size="lg" 
            className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30 disabled:opacity-30 p-2 md:p-3" 
            aria-label="Siguiente página"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>

        {/* Final mural shortcut */}
        {!isFinalPage && (
          <div className="absolute bottom-20 sm:bottom-4 right-2 sm:right-4">
            <Button 
              onClick={() => paginate(totalPages - 1)} 
              variant="outline" 
              size="sm" 
              className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30 text-xs md:text-sm"
            >
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Ver Mural
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}