
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Save, Plus, Trash2, UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export function MuralEditor({ mural, onSave }) {
  const [editedMural, setEditedMural] = useState({
    ...mural,
    women: mural.women || []
  });

  const handleSave = () => {
    const hasEmptyFields = editedMural.women.some(woman => 
      !woman.name.trim() || !woman.date.trim() || !woman.memory.trim()
    );

    if (hasEmptyFields) {
      toast({
        title: "⚠️ Campos incompletos",
        description: "Todos los campos de las mujeres son obligatorios",
        variant: "destructive"
      });
      return;
    }

    onSave(editedMural);
  };

  const addWoman = () => {
    const newWoman = {
      id: Date.now(),
      name: "",
      date: "",
      memory: ""
    };
    setEditedMural({
      ...editedMural,
      women: [...editedMural.women, newWoman]
    });
  };

  const updateWoman = (id, updates) => {
    setEditedMural({
      ...editedMural,
      women: editedMural.women.map(woman =>
        woman.id === id ? { ...woman, ...updates } : woman
      )
    });
  };

  const deleteWoman = (id) => {
    setEditedMural({
      ...editedMural,
      women: editedMural.women.filter(woman => woman.id !== id)
    });
  };

  return (
    <motion.div
      className="content-editor rounded-lg p-4 md:p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-0">Editor del Mural Final</h2>
        <div className="flex space-x-2">
          <Button onClick={addWoman} className="button-primary bg-green-700 hover:bg-green-800">
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Mujer
          </Button>
          <Button onClick={handleSave} className="button-primary">
            <Save className="w-4 h-4 mr-2" />
            Guardar Mural
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-black/20 border border-amber-700/50 rounded-lg">
        <p className="text-sm">
          Aquí puedes gestionar las mujeres que aparecerán en el mural final del grimorio. 
          Cada mujer tendrá su retrato y su historia será revelada al hacer clic en su imagen.
        </p>
      </div>

      <div className="space-y-6">
        {editedMural.women.map((woman, index) => (
          <motion.div
            key={woman.id}
            className="bg-black/20 border border-purple-700/50 rounded-lg p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                Mujer #{index + 1}
              </h3>
              <Button
                onClick={() => deleteWoman(woman.id)}
                size="sm"
                variant="outline"
                className="button-destructive border-red-500/70 text-red-300 hover:bg-red-600/30"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  value={woman.name}
                  onChange={(e) => updateWoman(woman.id, { name: e.target.value })}
                  className="w-full p-3 rounded-lg"
                  placeholder="Nombre de la mujer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fechas</label>
                <input
                  type="text"
                  value={woman.date}
                  onChange={(e) => updateWoman(woman.id, { date: e.target.value })}
                  className="w-full p-3 rounded-lg"
                  placeholder="Ej: 1890-1960"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Memoria/Historia</label>
              <textarea
                value={woman.memory}
                onChange={(e) => updateWoman(woman.id, { memory: e.target.value })}
                rows={3}
                className="w-full p-3 rounded-lg resize-y"
                placeholder="Describe la historia o legado de esta mujer..."
              />
            </div>
          </motion.div>
        ))}

        {editedMural.women.length === 0 && (
          <div className="text-center py-12 text-amber-400/70">
            <UserPlus className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-50" />
            <p className="text-base md:text-lg mb-2">No hay mujeres en el mural</p>
            <p className="text-xs md:text-sm">Haz clic en "Agregar Mujer" para comenzar</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
