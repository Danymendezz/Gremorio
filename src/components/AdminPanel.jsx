import React, { useState, useEffect } from 'react'; // <-- Añade useEffect aquí
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChapterEditor } from '@/components/ChapterEditor';
import { MuralEditor } from '@/components/MuralEditor';
import { BookOpen, Users, Plus, Edit, Trash2, Save, XCircle, Image } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Asegúrate de importar las funciones de guardado/eliminación desde api.js si las manejas aquí
// import { saveChapter, deleteChapter, saveMural } from '@/components/api';

export function AdminPanel({ bookData, onUpdateData, onClose, allChapters, onSaveChapter, onDeleteChapter, onSaveMural }) {
  const [activeTab, setActiveTab] = useState('chapters');
  const [editingChapter, setEditingChapter] = useState(null);
  // Inicializa bookInfo con valores seguros si bookData es null o undefined inicialmente
  const [bookInfo, setBookInfo] = useState({
    title: bookData?.title || "",
    author: bookData?.author || ""
  });

  // Efecto para actualizar bookInfo si bookData cambia (por ejemplo, después de cargar de la API)
  useEffect(() => {
    setBookInfo({
      title: bookData?.title || "",
      author: bookData?.author || ""
    });
  }, [bookData]);


  const handleSaveBookInfo = () => {
    // Aquí, en lugar de onUpdateData, probablemente querrías una función de API para guardar la información del libro
    // onUpdateBookInfo({ title: bookInfo.title, author: bookInfo.author }); // Ejemplo de función API

    // Si onUpdateData es la única forma de actualizar el estado en App.jsx:
     onUpdateData({
       ...bookData, // Asegúrate de mantener el resto de los datos
       title: bookInfo.title,
       author: bookInfo.author,
       // Puedes añadir lógica aquí para guardar solo la info del libro a la API si es necesario
       // Por ahora, solo actualiza el estado local en App.jsx
     });

    toast({
      title: "📚 Información del libro actualizada",
      description: "Los cambios han sido guardados (solo localmente por ahora, implementa la API).", // Ajusta el mensaje
    });
     // Considera llamar a una API saveBookInfo aquí

  };

  const handleDeleteChapter = async (chapterId) => {
    // Llama a la función de la API para eliminar el capítulo
    try {
       await onDeleteChapter(chapterId);
      // La recarga de datos y el toast se manejan en App.jsx después de que onDeleteChapter se complete
    } catch (error) {
      console.error("Error deleting chapter in AdminPanel:", error);
      // El toast de error se maneja en App.jsx
    }
  };

  const handleCreateChapter = () => {
    // Crea el objeto del nuevo capítulo con arrays vacíos
    const newChapter = {
      // Usar null o un identificador temporal si el ID final lo asigna la base de datos
      id: `new-${Date.now()}`, // Usar un ID temporal para el estado local antes de guardar
      title: "Nuevo Capítulo",
      content: "Escribe aquí el contenido del nuevo capítulo...",
      postIts: [], // Inicializar como array vacío
      photos: [], // Inicializar como array vacío
      cornerNotes: [], // Inicializar como array vacío
      songUrl: "",
      songStartTime: 0,
      imageUrl: ""
    };

    // Agrega el nuevo capítulo al estado local *temporalmente* antes de que se guarde
    // Esto permite que el editor de capítulos se abra con el nuevo capítulo
    // La lógica de guardado real se ejecutará cuando el usuario haga clic en "Guardar" en ChapterEditor

    // Opcional: Puedes añadir el nuevo capítulo al estado local aquí si ChapterEditor maneja el guardado inicial
    // onUpdateData({ ...bookData, chapters: [...(bookData.chapters || []), newChapter] });

    setEditingChapter(newChapter); // Abre el editor con el nuevo capítulo

    toast({
      title: "✨ Nuevo capítulo creado",
      description: "Edita y guarda el nuevo capítulo.",
    });
  };

  const handleUpdateChapter = async (updatedChapter) => {
     // Llama a la función de la API para guardar/actualizar el capítulo
     try {
        await onSaveChapter(updatedChapter);
        // La recarga de datos y el toast se manejan en App.jsx después de que onSaveChapter se complete
        setEditingChapter(null); // Cierra el editor después de guardar
     } catch (error) {
        console.error("Error saving chapter in AdminPanel:", error);
        // El toast de error se maneja en App.jsx
     }
  };

  const handleUpdateMural = async (updatedMural) => {
     // Llama a la función de la API para guardar el mural
     try {
         // Aquí también necesitas el ID del mural para pasárselo a la función de API
         // Asumiendo que bookData.finalMural ya tiene el ID si existe
         const muralDataToSave = {
             id: bookData?.finalMural?.id, // Pasa el ID si existe
             ...updatedMural
         };
        await onSaveMural(muralDataToSave);
        // La recarga de datos y el toast se manejan en App.jsx después de que onSaveMural se complete
     } catch (error) {
        console.error("Error saving mural in AdminPanel:", error);
        // El toast de error se maneja en App.jsx
     }
  };


  return (
    <div className="admin-panel min-h-screen p-4 md:p-8 w-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-amber-200 mb-4 md:mb-0" style={{ fontFamily: 'Cinzel, serif' }}>
            Panel de Administración del Grimorio
          </h1>
          <Button onClick={onClose} variant="outline" className="border-amber-600 text-amber-300 hover:bg-amber-700/30 button-secondary">
            <XCircle className="w-4 h-4 mr-2" />
            Cerrar Panel
          </Button>
        </motion.div>

        {/* Sección Información del Libro */}
        <motion.div
          className="content-editor rounded-lg p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold mb-4">Información del Libro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={bookInfo.title}
                onChange={(e) => setBookInfo({ ...bookInfo, title: e.target.value })}
                className="w-full p-3 rounded-lg text-gray-800" // Añadido text-gray-800 para visibilidad
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Autor</label>
              <input
                type="text"
                value={bookInfo.author}
                onChange={(e) => setBookInfo({ ...bookInfo, author: e.target.value })}
                 className="w-full p-3 rounded-lg text-gray-800" // Añadido text-gray-800 para visibilidad
              />
            </div>
          </div>
          <Button onClick={handleSaveBookInfo} className="button-primary bg-blue-600 hover:bg-blue-700"> {/* Cambiado color a azul para diferenciar */}
            <Save className="w-4 h-4 mr-2" />
            Guardar Información
          </Button>
        </motion.div>

        {/* Tabs de Navegación */}
        <motion.div
          className="flex space-x-2 md:space-x-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setActiveTab('chapters')}
            variant={activeTab === 'chapters' ? 'default' : 'outline'}
            className={activeTab === 'chapters' ? 'button-primary' : 'button-secondary'}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Capítulos
          </Button>
          <Button
            onClick={() => setActiveTab('mural')}
            variant={activeTab === 'mural' ? 'default' : 'outline'}
            className={activeTab === 'mural' ? 'button-primary' : 'button-secondary'}
          >
            <Users className="w-4 h-4 mr-2" />
            Mural Final
          </Button>
        </motion.div>

        {/* Contenido basado en Tab Activo */}
        <AnimatePresence mode="wait">
          {activeTab === 'chapters' && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {editingChapter ? (
                 // Pasa las funciones de guardado/cancelado al ChapterEditor
                <ChapterEditor
                  chapter={editingChapter}
                  onSave={handleUpdateChapter} // Usa la función que llama a la API
                  onCancel={() => setEditingChapter(null)} // Cierra el editor sin guardar
                  allChapters={allChapters} // Pasa allChapters para el selector de enlaces
                />
              ) : (
                <div>
                  <div className="mb-6">
                    <Button onClick={handleCreateChapter} className="button-primary bg-green-700 hover:bg-green-800">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Nuevo Capítulo
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    {/* APLICA EL CAMBIO AQUÍ: Asegura que bookData.chapters sea un array antes de mapear */}
                    {(bookData.chapters || []).map((chapter, index) => (
                      <motion.div
                        key={chapter.id}
                        className="content-editor rounded-lg p-4 md:p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div className="flex-1 mb-3 md:mb-0">
                            <h3 className="text-lg md:text-xl font-bold mb-2">{chapter.title}</h3>
                            {/* Usa optional chaining (?) para acceder a las propiedades anidadas */}
                            <p className="text-sm line-clamp-3">{chapter.content}</p>
                            <div className="mt-2 text-xs text-amber-400 flex items-center">
                              {/* Usa optional chaining (?) para acceder a las propiedades anidadas */}
                              {chapter.postIts?.length || 0} post-its • {chapter.photos?.length || 0} fotos • {chapter.cornerNotes?.length || 0} notas •
                              {chapter.songUrl && " 🎵"}
                              {chapter.imageUrl && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Image className="w-4 h-4 inline-block" />
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-0 md:ml-4">
                            <Button
                               // Cuando editas, asegúrate de pasar una copia limpia del capítulo
                               // para evitar mutar el estado original en bookData
                              onClick={() => setEditingChapter({...chapter})}
                              size="sm"
                              variant="outline"
                              className="button-secondary border-blue-500/70 text-blue-300 hover:bg-blue-600/30"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteChapter(chapter.id)} // Usa la función que llama a la API
                              size="sm"
                              variant="outline"
                              className="button-destructive border-red-500/70 text-red-300 hover:bg-red-600/30"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'mural' && (
            <motion.div
              key="mural"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
               {/* Pasa la función de guardado al MuralEditor */}
              <MuralEditor
                mural={bookData?.finalMural} // Usa optional chaining por si finalMural es null
                onSave={handleUpdateMural} // Usa la función que llama a la API
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
