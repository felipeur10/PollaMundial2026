import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { loginWithGoogle, logout } from './services/firebase';

import PredictionScreen from './components/matches/PredictionScreen';
import Leaderboard from './components/leaderboard/leaderboard';
import AdminPanel from './components/admin/AdminPanel';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { LogIn, LogOut, Trophy, Target } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-black italic text-gray-400">
      PREPARANDO EL CAMPO...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border-t-[12px] border-green-600 text-center max-w-sm w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Trophy size={100} />
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-2 italic tracking-tighter leading-none">
          POLLA <span className="text-green-600 italic">2026</span>
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-10">Bogotá HQ Edition</p>

        {user ? (
          <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-6">
              <img src={user.photoURL} alt="Perfil" className="w-20 h-20 rounded-3xl rotate-3 shadow-lg border-2 border-white" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-lg">
                <Target size={16} />
              </div>
            </div>
            <p className="text-gray-800 font-black text-xl mb-8 italic">¡Hola, {user.displayName?.split(' ')[0]}!</p>
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => navigate('/predicciones')}
                className="bg-gray-900 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
              >
                Hacer Pronósticos ⚽
              </button>
              <button
                onClick={() => navigate('/ranking')}
                className="bg-white border-2 border-yellow-500 text-yellow-600 px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-yellow-50 transition-all active:scale-95 shadow-lg shadow-yellow-100"
              >
                <Trophy size={18} /> Ver Ranking
              </button>
              <button
                onClick={logout}
                className="mt-6 text-gray-400 hover:text-red-500 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                <LogOut size={14} /> Cerrar sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 p-6 rounded-3xl mb-8 border border-dashed border-gray-200">
              <p className="text-gray-500 text-xs font-medium leading-relaxed">
                Únete a la polla oficial, compite con tus amigos y demuestra quién sabe más de fútbol.
              </p>
            </div>
            <button
              onClick={loginWithGoogle}
              className="bg-white border-2 border-gray-900 text-gray-900 px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-4 w-full hover:bg-gray-900 hover:text-white transition-all shadow-xl active:scale-95"
            >
              <LogIn size={20} /> ENTRAR CON GOOGLE
            </button>
          </div>
        )}
      </div>
      {user?.email?.includes('felipe') && (
        <button onClick={() => navigate('/admin')} className="mt-8 text-gray-300 text-[10px] font-bold uppercase tracking-[0.5em]">Admin Mode</button>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Ruta propia del usuario autenticado */}
        <Route path="/predicciones" element={<PredictionScreen />} />
        
        {/* ✅ NUEVA: Modo lectura — ver predicciones de otro usuario */}
        <Route path="/predicciones/:uid" element={<PredictionScreen readOnly />} />
        
        <Route path="/ranking" element={<Leaderboard />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;