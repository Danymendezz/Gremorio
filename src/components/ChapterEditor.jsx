import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Save, X, Plus, Trash2, StickyNote, Camera, Edit3, Music2, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function ChapterEditor({ chapter, onSave, onCancel, allChapters }) {
  const [editedChapter, setEditedChapter] = useState({
    ...chapter,
    postIts: chapter.postIts || [],
    photos: chapter.photos || [],
    cornerNotes: chapter.cornerNotes || [],
    songUrl: chapter.songUrl || "",
    songStartTime: chapter.songStartTime || 0,
    imageUrl: chapter.imageUrl || ""
  });

  const handleSave = () => {
    if (!editedChapter.title.trim() || !editedChapter.content.trim()) {
      toast({ title: "⚠️ Campos requeridos", description: "El título y contenido son obligatorios", variant: "destructive" });
      return;
    }
    if (editedChapter.songUrl && !editedChapter.songUrl.endsWith('.mp3')) {
      toast({ title: "⚠️ Formato de canción incorrecto", description: "El enlace de la canción debe terminar en .mp3", variant: "destructive" });
      return;
    }
    if (isNaN(parseInt(editedChapter.songStartTime)) || parseInt(editedChapter.songStartTime) < 0) {
      toast({ title: "⚠️ Tiempo de inicio inválido", description: "El tiempo de inicio de la canción debe ser un número positivo.", variant: "destructive" });
      return;
    }
    if (editedChapter.imageUrl && !editedChapter.imageUrl.startsWith('http')) {
      toast({ title: "⚠️ Imagen no válida", description: "La URL de la imagen debe ser un enlace válido", variant: "destructive" });
      return;
    }
    // Validación para URLs de fotos
    if (editedChapter.photos.some(photo => photo.url && !photo.url.startsWith('http'))) {
      toast({ 
        title: "⚠️ URL de foto no válida", 
        description: "Las URLs de las fotos deben comenzar con http:// o https://", 
        variant: "destructive" 
      });
      return;
    }

    onSave({ ...editedChapter, songStartTime: parseInt(editedChapter.songStartTime) });
  };

  const addItem = (type) => {
    const newItem = {
      id: Date.now(),
      text: type === 'postIt' ? "Nueva nota" : (type === 'cornerNote' ? "Nota de esquina..." : undefined),
      caption: type === 'photo' ? "Nueva foto" : undefined,
      url: type === 'photo' ? "" : undefined, // Nuevo campo para URL de imagen
      link: type === 'photo' ? "" : undefined, // Nuevo campo para enlace
      x: type !== 'cornerNote' ? Math.random() * 60 + 20 : undefined,
      y: type !== 'cornerNote' ? Math.random() * 40 + 30 : undefined,
      color: type === 'postIt' ? "#e0cda4" : undefined,
      rotation: Math.random() * 10 - 5,
      position: type === 'cornerNote' ? "top-left" : undefined,
      linkToChapterId: null
    };

    if (type === 'postIt') setEditedChapter(prev => ({ ...prev, postIts: [...prev.postIts, newItem] }));
    else if (type === 'photo') setEditedChapter(prev => ({ ...prev, photos: [...prev.photos, newItem] }));
    else if (type === 'cornerNote') setEditedChapter(prev => ({ ...prev, cornerNotes: [...prev.cornerNotes, newItem] }));
  };

  const updateItem = (type, id, updates) => {
    const key = type === 'postIt' ? 'postIts' : (type === 'photo' ? 'photos' : 'cornerNotes');
    setEditedChapter(prev => ({
      ...prev,
      [key]: prev[key].map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const deleteItem = (type, id) => {
    const key = type === 'postIt' ? 'postIts' : (type === 'photo' ? 'photos' : 'cornerNotes');
    setEditedChapter(prev => ({ ...prev, [key]: prev[key].filter(item => item.id !== id) }));
  };

  const renderLinkSelector = (itemType, itemId, currentLink) => (
    <select
      value={currentLink || ""}
      onChange={(e) => updateItem(itemType, itemId, { linkToChapterId: e.target.value ? parseInt(e.target.value) : null })}
      className="w-full p-2 border-purple-600 rounded text-sm bg-inherit mt-1"
    >
      <option value="">Sin enlace</option>
      {allChapters?.filter(ch => ch.id !== chapter.id).map(ch => (
        <option key={ch.id} value={ch.id}>{ch.title}</option>
      ))}
    </select>
  );

  return (
    <motion.div className="content-editor rounded-lg p-4 md:p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-0">Editar Capítulo</h2>
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="button-primary bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2" />Guardar</Button>
          <Button onClick={onCancel} variant="outline" className="button-secondary"><X className="w-4 h-4 mr-2" />Cancelar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Título del Capítulo</label>
          <input type="text" value={editedChapter.title} onChange={(e) => setEditedChapter({ ...editedChapter, title: e.target.value })} className="w-full p-3 rounded-lg" placeholder="Título del capítulo" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL de Canción (MP3)</label>
          <input type="url" value={editedChapter.songUrl} onChange={(e) => setEditedChapter({ ...editedChapter, songUrl: e.target.value })} className="w-full p-3 rounded-lg" placeholder="https://ejemplo.com/cancion.mp3" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Contenido</label>
          <textarea value={editedChapter.content} onChange={(e) => setEditedChapter({ ...editedChapter, content: e.target.value })} rows={10} className="w-full p-3 rounded-lg resize-y" placeholder="Escribe el contenido del capítulo aquí..." />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Inicio de Canción (segundos)</label>
          <input type="number" min="0" value={editedChapter.songStartTime} onChange={(e) => setEditedChapter({ ...editedChapter, songStartTime: e.target.value })} className="w-full p-3 rounded-lg" placeholder="0" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URL de Imagen para Polaroid</label>
          <input
            type="url"
            value={editedChapter.imageUrl}
            onChange={(e) => setEditedChapter({ ...editedChapter, imageUrl: e.target.value })}
            className="w-full p-3 rounded-lg"
            placeholder="https://mi-imagen.com/foto.jpg"
          />
        </div>
      </div>

      {/* Interactive Elements Sections */}
      {['postIt', 'photo', 'cornerNote'].map(type => {
        const config = {
          postIt: { title: 'Post-its', icon: <StickyNote className="w-4 h-4 mr-2" />, color: 'yellow', items: editedChapter.postIts },
          photo: { title: 'Fotos', icon: <Camera className="w-4 h-4 mr-2" />, color: 'sky', items: editedChapter.photos },
          cornerNote: { title: 'Notas de Esquina', icon: <Edit3 className="w-4 h-4 mr-2" />, color: 'purple', items: editedChapter.cornerNotes }
        };
        const currentConfig = config[type];
        return (
          <div className="mb-6" key={type}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{currentConfig.title}</h3>
              <Button onClick={() => addItem(type)} size="sm" className={`button-primary bg-${currentConfig.color}-600 hover:bg-${currentConfig.color}-700 text-${currentConfig.color}-50`}>
                {currentConfig.icon} Agregar
              </Button>
            </div>
            <div className="grid gap-3">
              {currentConfig.items.map((item) => (
                <div key={item.id} className={`bg-black/20 border border-${currentConfig.color}-700/50 rounded-lg p-3 md:p-4`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                    <div>
                      <label className="block text-xs font-medium mb-1">{type === 'photo' ? 'Descripción' : 'Texto'}</label>
                      <input type="text" value={item.text || item.caption} onChange={(e) => updateItem(type, item.id, type === 'photo' ? { caption: e.target.value } : { text: e.target.value })} className={`w-full p-2 border-${currentConfig.color}-600 rounded text-sm`} />
                    </div>
                    
                    {type === 'photo' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1">URL de la Imagen</label>
                          <input
                            type="url"
                            value={item.url || ''}
                            onChange={(e) => updateItem(type, item.id, { url: e.target.value })}
                            className={`w-full p-2 border-${currentConfig.color}-600 rounded text-sm`}
                            placeholder="https://ejemplo.com/imagen.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Enlace de la Foto</label>
                          <input
                            type="url"
                            value={item.link || ''}
                            onChange={(e) => updateItem(type, item.id, { link: e.target.value })}
                            className={`w-full p-2 border-${currentConfig.color}-600 rounded text-sm`}
                            placeholder="https://ejemplo.com (opcional)"
                          />
                        </div>
                      </>
                    )}
                    
                    {type !== 'cornerNote' && type !== 'photo' && (
                      <>
                        <div><label className="block text-xs font-medium mb-1">Posición X (%)</label><input type="number" min="0" max="100" value={item.x} onChange={(e) => updateItem(type, item.id, { x: parseInt(e.target.value) })} className={`w-full p-2 border-${currentConfig.color}-600 rounded text-sm`} /></div>
                        <div><label className="block text-xs font-medium mb-1">Posición Y (%)</label><input type="number" min="0" max="100" value={item.y} onChange={(e) => updateItem(type, item.id, { y: parseInt(e.target.value) })} className={`w-full p-2 border-${currentConfig.color}-600 rounded text-sm`} /></div>
                      </>
                    )}
                    
                    {type === 'cornerNote' && (
                      <>
                        <div><label className="block text-xs font-medium mb-1">Posición</label><select value={item.position} onChange={(e) => updateItem(type, item.id, { position: e.target.value })} className={`w-full p-2 border-${currentConfig.color}-600 rounded text-sm bg-inherit`}><option value="top-left">Arriba Izquierda</option><option value="top-right">Arriba Derecha</option><option value="bottom-left">Abajo Izquierda</option><option value="bottom-right">Abajo Derecha</option></select></div>
                        <div><label className="block text-xs font-medium mb-1">Rotación (°)</label><input type="number" min="-45" max="45" value={item.rotation} onChange={(e) => updateItem(type, item.id, { rotation: parseInt(e.target.value) })} className={`w-full p-2 border-${currentConfig.color}-600 rounded text-sm`} /></div>
                      </>
                    )}
                    
                    <div className={`flex flex-col items-start ${type === 'cornerNote' ? 'lg:col-start-4' : ''}`}>
                      <label className="block text-xs font-medium mb-1">Enlazar a Capítulo</label>
                      {renderLinkSelector(type, item.id, item.linkToChapterId)}
                      <Button onClick={() => deleteItem(type, item.id)} size="icon" variant="outline" className="button-destructive p-2 h-9 w-9 border-red-500/70 text-red-300 hover:bg-red-600/30 mt-2 self-end"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}