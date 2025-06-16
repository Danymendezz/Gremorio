
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';

export function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="flex items-center justify-center min-h-screen p-4"
    >
      <div className="login-form-container w-full max-w-md p-8 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <ShieldCheck className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-purple-300">Acceso al Grimorio Arcano</h1>
          <p className="text-purple-100/70 mt-2">Solo para guardianes de secretos.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-purple-200">Nombre de Guardián</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu alias místico"
              required
              className="mt-1 bg-gray-800/50 border-purple-600/50 text-purple-50 focus:border-purple-400"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-purple-200">Contraseña Secreta</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Palabra de poder"
              required
              className="mt-1 bg-gray-800/50 border-purple-600/50 text-purple-50 focus:border-purple-400"
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
            Desvelar Secretos
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
