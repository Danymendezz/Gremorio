import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChapterEditor } from '@/components/ChapterEditor';
import { MuralEditor } from '@/components/MuralEditor';
import { BookOpen, Users, Plus, Edit, Trash2, Save, XCircle, Image } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function AdminPanel({ bookData, onUpdateData, onClose, allChapters }) {
  const [activeTab, setActiveTab] = useState('chapters');
  const [editingChapter, setEditingChapter] = useState(null);
  const [bookInfo, setBookInfo] = useState({
    title: bookData.title,
    author: bookData.author
  });

  const handleSaveBookInfo = () => {
    onUpdateData({
      ...bookData,
      title: bookInfo.title,
      author: bookInfo.author
    });
    toast({
      title: "📚 Información del libro actualizada",
      description: "Los cambios han sido guardados",
    });
  };

  const handleDeleteChapter = (chapterId) => {
    const updatedChapters = bookData.chapters.filter(ch => ch.id !== chapterId);
    onUpdateData({
      ...bookData,
      chapters: updatedChapters
    });
    toast({
      title: "🗑️ Capítulo eliminado",
      description: "El capítulo ha sido removido del grimorio",
    });
  };

  const handleCreateChapter = () => {
    const newChapter = {
      id: Date.now(),
      title: "Nuevo Capítulo",
      content: "Escribe aquí el contenido del nuevo capítulo...",
      postIts: [],
      photos: [], // Cada foto tendrá ahora { url: string, link?: string }
      cornerNotes: [],
      songUrl: "",
      songStartTime: 0,
      imageUrl: "" // Imagen de Polaroid
    };
    
    onUpdateData({
      ...bookData,
      chapters: [...bookData.chapters, newChapter]
    });
    
    setEditingChapter(newChapter);
    toast({
      title: "✨ Nuevo capítulo creado",
      description: "Puedes editarlo ahora",
    });
  };

  const handleUpdateChapter = (updatedChapter) => {
    const updatedChapters = bookData.chapters.map(ch => 
      ch.id === updatedChapter.id ? updatedChapter : ch
    );
    
    onUpdateData({
      ...bookData,
      chapters: updatedChapters
    });
    
    setEditingChapter(null);
    toast({
      title: "📝 Capítulo actualizado",
      description: "Los cambios han sido guardados",
    });
  };

  const handleUpdateMural = (updatedMural) => {
    onUpdateData({
      ...bookData,
      finalMural: updatedMural
    });
    toast({
      title: "🖼️ Mural actualizado",
      description: "Los cambios han sido guardados",
    });
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
                className="w-full p-3 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Autor</label>
              <input
                type="text"
                value={bookInfo.author}
                onChange={(e) => setBookInfo({ ...bookInfo, author: e.target.value })}
                className="w-full p-3 rounded-lg"
              />
            </div>
          </div>
          <Button onClick={handleSaveBookInfo} className="button-primary">
            <Save className="w-4 h-4 mr-2" />
            Guardar Información
          </Button>
        </motion.div>

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
                <ChapterEditor
                  chapter={editingChapter}
                  onSave={handleUpdateChapter}
                  onCancel={() => setEditingChapter(null)}
                  allChapters={allChapters}
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
                    {bookData.chapters.map((chapter, index) => (
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
                            <p className="text-sm line-clamp-3">{chapter.content}</p>
                            <div className="mt-2 text-xs text-amber-400 flex items-center">
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
                              onClick={() => setEditingChapter(chapter)}
                              size="sm"
                              variant="outline"
                              className="button-secondary border-blue-500/70 text-blue-300 hover:bg-blue-600/30"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteChapter(chapter.id)}
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
              <MuralEditor
                mural={bookData.finalMural}
                onSave={handleUpdateMural}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}