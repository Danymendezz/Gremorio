import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookCover } from '@/components/BookCover';
import { BookPages } from '@/components/BookPages';
import { AdminPanel } from '@/components/AdminPanel';
import { LoginForm } from '@/components/LoginForm';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Settings, Eye, LogOut } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ADMIN_USERNAME = "donydonitasss";
const ADMIN_PASSWORD = "Bruja!Adminitrador4";

function App() {
  const [isBookOpen, setIsBookOpen] = useState(() => {
    const saved = localStorage.getItem('isBookOpen');
    return saved ? JSON.parse(saved) : false;
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('isAdminAuthenticated') === 'true';
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('currentPage');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseInt(saved, 10) : 16;
  });
  const location = useLocation();
  const navigate = useNavigate();

  const [bookData, setBookData] = useState(() => {
    const saved = localStorage.getItem('grimorioData');
    return saved ? JSON.parse(saved) : {
      title: "Los nombres de las mujeres que no importan",
      author: "Aún no sabemos",
      chapters: [
        {
          id: 1,
          title: "Prefacio",
          content: "En las páginas que siguen, encontrarás historias que han sido silenciadas,\nnombres que han sido olvidados,\ny vidas que merecen ser recordadas.\n\nEste grimorio no contiene hechizos de magia, sino algo mucho más poderoso: la verdad de aquellas mujeres cuyas voces fueron acalladas por el tiempo y la indiferencia.",
          postIts: [],
          photos: [],
          cornerNotes: [],
          songUrl: "",
          songStartTime: 0
        },
        {
          id: 2,
          title: "Capítulo I: Las Invisibles",
          content: "Había una vez mujeres que caminaron por este mundo dejando huellas que nadie se molestó en seguir.\nSus nombres se perdieron en el viento, sus historias se desvanecieron como humo,\npero sus espíritus permanecen, esperando ser recordados.",
          postIts: [
            { id: 1, text: "Recordar es un acto de resistencia", x: 70, y: 30, color: "hsl(260, 50%, 30%)", rotation: -3, linkToChapterId: null }
          ],
          photos: [
            { id: 1, caption: "Una mujer anónima, 1920", x: 20, y: 60, rotation: -5, linkToChapterId: null }
          ],
          cornerNotes: [
            { id: 1, text: "No olvidar...", position: "top-right", rotation: -8, linkToChapterId: null }
          ],
          songUrl: "https://oqcqswlcinphqxthxlkb.supabase.co/storage/v1/object/public/donydonitasss//cancion.mp3",
          songStartTime: 10
        }
      ],
      finalMural: {
        women: [
          { id: 1, name: "María", date: "1890-1960", memory: "Luchó por los derechos de las trabajadoras" },
          { id: 2, name: "Carmen", date: "1905-1975", memory: "Maestra que educó en secreto durante la guerra" },
          { id: 3, name: "Isabel", date: "1920-1995", memory: "Escritora censurada que nunca dejó de escribir" }
        ]
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('grimorioData', JSON.stringify(bookData));
  }, [bookData]);

  useEffect(() => {
    localStorage.setItem('isAdminAuthenticated', isAdminAuthenticated.toString());
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('isBookOpen', JSON.stringify(isBookOpen));
  }, [isBookOpen]);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);


  const openBook = () => {
    setIsBookOpen(true);
    toast({
      title: "📖 El grimorio se abre...",
      description: "Los secretos antiguos esperan ser descubiertos",
    });
  };

  const closeBook = () => {
    setIsBookOpen(false);
    setCurrentPage(0);
    navigate('/'); 
  };

  const handleLogin = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      navigate('/admin');
      toast({ title: "🔑 Acceso concedido", description: "Bienvenida al panel de administración." });
    } else {
      toast({ title: "❌ Acceso denegado", description: "Credenciales incorrectas.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    navigate('/');
    toast({ title: "🔒 Sesión cerrada", description: "Has salido del panel de administración." });
  };

  const updateBookData = (newData) => {
    setBookData(newData);
  };

  const navigateToChapter = (chapterId) => {
    const chapterIndex = bookData.chapters.findIndex(ch => ch.id === chapterId);
    if (chapterIndex !== -1) {
      setCurrentPage(chapterIndex);
    } else {
      toast({
        title: "⚠️ Capítulo no encontrado",
        description: "El enlace parece estar roto.",
        variant: "destructive"
      });
    }
  };
  
  const isViewingAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2.5 + 0.5}px`,
              height: `${Math.random() * 2.5 + 0.5}px`,
            }}
            animate={{
              opacity: [0, Math.random() * 0.6 + 0.2, 0],
              scale: [1, Math.random() * 0.5 + 1, 1],
              x: [`${Math.random()*10 - 5}px`, `${Math.random()*10 - 5}px`],
              y: [`${Math.random()*10 - 5}px`, `${Math.random()*10 - 5}px`],
            }}
            transition={{
              duration: Math.random() * 8 + 7,
              repeat: Infinity,
              delay: Math.random() * 7,
              ease: "linear"
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`moon-${i}`}
            className="absolute rounded-full border-2 border-white/50"
            style={{
              left: `${Math.random() * 90}%`,
              top: `${Math.random() * 90}%`,
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
            }}
            animate={{
              opacity: [0, Math.random() * 0.1 + 0.05, 0],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-900/30 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-indigo-900/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>


      <div className="fixed top-4 right-4 z-[100] flex items-center space-x-2">
        {isBookOpen && !isViewingAdmin && (
          <>
            <Button onClick={() => setFontSize(prev => Math.max(10, prev - 1))} variant="outline" size="sm" className="bg-black/50 border-purple-500/50 text-purple-300 hover:bg-purple-500/20" aria-label="Disminuir tamaño de fuente">A-</Button>
            <Button onClick={() => setFontSize(prev => Math.min(32, prev + 1))} variant="outline" size="sm" className="bg-black/50 border-purple-500/50 text-purple-300 hover:bg-purple-500/20" aria-label="Aumentar tamaño de fuente">A+</Button>
          </>
        )}
        {isAdminAuthenticated && isViewingAdmin && (
           <Button onClick={handleLogout} variant="outline" size="sm" className="bg-black/50 border-red-500/50 text-red-300 hover:bg-red-500/20">
            <LogOut className="w-4 h-4 mr-2" /> Salir
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            !isBookOpen ? (
              <motion.div key="cover" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="flex-grow flex items-center justify-center p-4 md:p-8">
                <BookCover title={bookData.title} author={bookData.author} onOpen={openBook} />
              </motion.div>
            ) : (
              <motion.div key="pages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="flex-grow flex flex-col items-center justify-center w-full h-full">
                <BookPages bookData={bookData} currentPage={currentPage} onPageChange={setCurrentPage} onClose={closeBook} fontSize={fontSize} navigateToChapter={navigateToChapter} />
              </motion.div>
            )
          }/>
          <Route path="/login" element={
            isAdminAuthenticated ? <Navigate to="/admin" /> : <LoginForm onLogin={handleLogin} />
          }/>
          <Route path="/admin" element={
            isAdminAuthenticated ? (
              <AdminPanel bookData={bookData} onUpdateData={updateBookData} onClose={() => navigate('/')} allChapters={bookData.chapters} />
            ) : (
              <Navigate to="/login" />
            )
          }/>
        </Routes>
      </AnimatePresence>
      <Toaster />
    </div>
  );
}

export default App;