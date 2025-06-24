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
import { getBookData, saveChapter, deleteChapter, saveMural } from '@/components/api'; // Importa las funciones API

const ADMIN_USERNAME = "donydonitasss";
const ADMIN_PASSWORD = "Bruja!Adminitrador4";

function App() {
  // Mantén el estado de la UI en localStorage si lo deseas, pero no los datos del libro
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

  // Estado para los datos del libro, inicializado vacío
  const [bookData, setBookData] = useState({ chapters: [], finalMural: null });
  // Estado para manejar la carga de datos
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del libro desde la API al montar el componente
  useEffect(() => {
    const loadBookData = async () => {
      setIsLoading(true); // Inicia el estado de carga
      try {
        const data = await getBookData();
        setBookData(data);
        toast({
           title: "✅ Datos cargados",
           description: "Datos del grimorio cargados exitosamente.",
         });
      } catch (error) {
        console.error('Error loading book data:', error);
        toast({
          title: "❌ Error al cargar los datos",
          description: "No se pudieron cargar los datos del grimorio. Consulta la consola para más detalles.",
          variant: "destructive"
        });
         // Opcional: Cargar datos de respaldo de localStorage si falla la API
         const saved = localStorage.getItem('grimorioData');
         if (saved) {
           setBookData(JSON.parse(saved));
           toast({
             title: "⚠️ Cargados datos locales",
             description: "No se pudieron cargar los datos de la base de datos, usando datos guardados localmente.",
             variant: "default"
           });
         }

      } finally {
        setIsLoading(false); // Finaliza el estado de carga
      }
    };
    loadBookData();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Mantener sincronizados algunos estados en localStorage (opcional, pero útil para la experiencia de usuario)
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

    // Guardar bookData en localStorage cada vez que cambie (como respaldo, no la fuente principal)
   useEffect(() => {
       localStorage.setItem('grimorioData', JSON.stringify(bookData));
   }, [bookData]);


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

  // Funciones para guardar/eliminar que interactúan con la API y actualizan el estado local
  const handleSaveChapter = async (chapterToSave) => {
    try {
      await saveChapter(chapterToSave);
      const updatedBookData = await getBookData(); // Recargar los datos después de guardar
      setBookData(updatedBookData);
       toast({
        title: "✅ Capítulo guardado",
        description: "Los cambios han sido guardados exitosamente.",
      });
    } catch (error) {
       console.error('Error saving chapter:', error);
       toast({
        title: "❌ Error al guardar capítulo",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive"
      });
    }
  };

   const handleDeleteChapter = async (chapterId) => {
    try {
       await deleteChapter(chapterId);
       const updatedBookData = await getBookData(); // Recargar los datos después de eliminar
       setBookData(updatedBookData);
        toast({
        title: "✅ Capítulo eliminado",
        description: "El capítulo ha sido eliminado permanentemente.",
      });
    } catch (error) {
       console.error('Error deleting chapter:', error);
       toast({
        title: "❌ Error al eliminar capítulo",
        description: "No se pudo eliminar el capítulo.",
        variant: "destructive"
      });
    }
   };

    const handleSaveMural = async (muralDataToSave) => {
      try {
         await saveMural(muralDataToSave);
         const updatedBookData = await getBookData(); // Recargar los datos después de guardar
         setBookData(updatedBookData);
         toast({
          title: "✅ Mural guardado",
          description: "Los cambios en el mural han sido guardados exitosamente.",
        });
      } catch (error) {
         console.error('Error saving mural:', error);
         toast({
          title: "❌ Error al guardar mural",
          description: "No se pudieron guardar los cambios en el mural.",
          variant: "destructive"
        });
      }
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

  // Si isLoading es true, podrías mostrar un spinner o un mensaje de carga
  if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center text-purple-300 text-xl">
            Cargando grimorio...
        </div>
      );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 opacity-20 pointer-events-none">{/* Estrellas y lunas */}
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
      <div className="absolute inset-0 opacity-30 pointer-events-none">{/* Efectos de luz */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-900/30 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-indigo-900/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>


      {/* Controles superiores (Fuente y Logout) */}
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
                {/* Pasa bookData a BookCover si lo necesita (ej. para el título y autor) */}
                <BookCover title={bookData.title} author={bookData.author} onOpen={openBook} />
              </motion.div>
            ) : (
               // BookPages se renderiza condicionalmente fuera de las rutas
               <Navigate to="/" replace /> // Si está abierto, redirige a la raíz para que se vea solo el libro
            )
          }/>
          <Route path="/login" element={
            isAdminAuthenticated ? <Navigate to="/admin" /> : <LoginForm onLogin={handleLogin} />
          }/>
          <Route path="/admin" element={
            isAdminAuthenticated ? (
              <AdminPanel
                bookData={bookData} // Pasa los datos cargados de la API
                onUpdateData={setBookData} // Puedes mantener esto si necesitas actualizar el estado local directamente en algunos casos, pero las funciones save son preferibles
                onClose={() => navigate('/')}
                allChapters={bookData.chapters} // Pasa todos los capítulos para los selectores de enlace
                onSaveChapter={handleSaveChapter} // Pasa la función para guardar capítulo a AdminPanel
                onDeleteChapter={handleDeleteChapter} // Pasa la función para eliminar capítulo
                 onSaveMural={handleSaveMural} // Pasa la función para guardar mural
              />
            ) : (
              <Navigate to="/login" />
            )
          }/>
           {/* Redirigir cualquier otra ruta a la portada si no está en admin o login */}
           {location.pathname !== '/admin' && location.pathname !== '/login' && (
              <Route path="*" element={<Navigate to="/" replace />} />
           )}
        </Routes>
      </AnimatePresence>

      {/* BookPages se renderiza fuera de las rutas para que pueda superponerse */}
      {isBookOpen && bookData && ( // Renderiza BookPages solo si isBookOpen es true y bookData está cargado
        <BookPages
          bookData={bookData} // Pasa los datos cargados de la API
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onClose={closeBook}
          fontSize={fontSize} // Usa el estado fontSize
          navigateToChapter={navigateToChapter} // Pasa la función de navegación
        />
      )}

      <Toaster />

      {/* Botones de Admin y Visualización (condicionales) */}
       {!isBookOpen && location.pathname !== '/admin' && location.pathname !== '/login' && (
          <div className="fixed bottom-4 right-4 z-50 flex space-x-2">
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="sm"
              className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30"
              aria-label="Panel de administración"
            >
              <Settings className="w-4 h-4 mr-2" /> Admin
            </Button>
             <Button
              onClick={openBook} // Llama a openBook que ahora solo abre el modal
               variant="outline"
              size="sm"
              className="bg-black/60 border-purple-700/70 text-purple-300 hover:bg-purple-700/30"
               aria-label="Abrir Grimorio"
            >
               <Eye className="w-4 h-4 mr-2" /> Ver Grimorio
            </Button>
          </div>
       )}
        {/* Botón de Logout solo en Admin si está autenticado */}
        {isAdminAuthenticated && isViewingAdmin && (
          <div className="fixed bottom-4 right-4 z-50">
              {/* El botón de Logout ya está arriba, pero puedes añadir otros botones aquí si es necesario */}
          </div>
        )}

    </div>
  );
}

export default App;
