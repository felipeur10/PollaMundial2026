import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { loginWithGoogle, logout } from './services/firebase';

import PredictionScreen from './components/matches/PredictionScreen';
import Leaderboard from './components/leaderboard/leaderboard';
import AdminPanel from './components/admin/AdminPanel';
import ProtectedRoute from './components/auth/ProtectedRoute';

import { LogIn, LogOut, Trophy, Target, Star, Zap, ChevronDown } from 'lucide-react';

const Home = () => {
  const { user, loading, notAllowed } = useAuth(); // ✅ notAllowed añadido
  const navigate = useNavigate();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-black italic text-gray-400">
      PREPARANDO EL CAMPO...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">

      {/* ── HERO ── */}
      <div className="w-full flex flex-col items-center justify-center min-h-screen p-6">
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
              {/* ✅ Mensaje de acceso denegado */}
              {notAllowed && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 w-full">
                  <p className="text-red-600 text-xs font-black uppercase tracking-wide text-center">
                    ⛔ Este correo no tiene acceso a la polla.
                  </p>
                  <p className="text-red-400 text-[10px] text-center mt-1">
                    Contacta a Felipe para que te agregue.
                  </p>
                </div>
              )}
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
          <button onClick={() => navigate('/admin')} className="mt-8 text-gray-400 text-[10px] font-bold uppercase tracking-[0.5em]">Admin Mode</button>
        )}

        {/* Indicador scroll */}
        <div className="mt-10 flex flex-col items-center gap-1 text-gray-400">
          <p className="text-[10px] uppercase tracking-widest font-bold">Cómo funciona</p>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </div>

      {/* ── REGLAMENTO ── */}
      <div className="max-w-sm w-full px-6 pb-16 space-y-4">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
            Sistema de <span className="text-green-600">puntos</span>
          </h2>
          <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest font-bold">Lee antes de pronosticar</p>
        </div>

        {/* Puntos por partido */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Target size={18} className="text-white" />
            </div>
            <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Puntos por partido</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3">
              <div>
                <p className="text-gray-900 text-sm font-black">Marcador exacto</p>
                <p className="text-gray-400 text-[10px]">Ej: predijiste 2-1, fue 2-1</p>
              </div>
              <span className="text-yellow-500 font-black text-2xl">+5</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
              <div>
                <p className="text-gray-900 text-sm font-black">Ganador o empate</p>
                <p className="text-gray-400 text-[10px]">Acertaste quién gana o que empata</p>
              </div>
              <span className="text-gray-700 font-black text-2xl">+2</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
              <div>
                <p className="text-gray-900 text-sm font-black">Resultado incorrecto</p>
                <p className="text-gray-400 text-[10px]">No acertaste nada</p>
              </div>
              <span className="text-gray-300 font-black text-2xl">0</span>
            </div>
          </div>
        </div>

        {/* Bonos */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500 rounded-xl">
              <Star size={18} className="text-white" />
            </div>
            <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Bonos especiales</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-gray-900 font-black text-sm">Bono de Grupo</p>
                <span className="text-yellow-500 font-black text-xl shrink-0">+3</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Acertar el <span className="text-gray-900 font-bold">1° y 2° lugar exactos</span> de un grupo. El orden importa.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-green-50 border border-green-200 rounded-xl p-2 text-center">
                  <p className="text-green-600 text-[10px] font-black mb-1">✓ CORRECTO</p>
                  <p className="text-gray-700 text-[10px]">1° Argentina</p>
                  <p className="text-gray-700 text-[10px]">2° Colombia</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-2 text-center">
                  <p className="text-red-500 text-[10px] font-black mb-1">✗ INCORRECTO</p>
                  <p className="text-gray-700 text-[10px]">1° Colombia</p>
                  <p className="text-gray-700 text-[10px]">2° Argentina</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-gray-900 font-black text-sm">Bono Mejores Terceros</p>
                <span className="text-yellow-500 font-black text-xl shrink-0">+3</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Acertar los <span className="text-gray-900 font-bold">8 equipos</span> que clasifican como mejores terceros. El orden entre ellos no importa.
              </p>
            </div>
          </div>
        </div>

        {/* Fase eliminatoria */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600 rounded-xl">
              <Zap size={18} className="text-white" />
            </div>
            <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Fase Eliminatoria</h3>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed mb-3">
            El sistema de puntos es el mismo (+5 exacto, +2 ganador), pero los equipos se revelan cuando el Admin los publica al terminar la fase de grupos.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
            <p className="text-red-600 text-xs font-black mb-1">⚡ Empates en eliminatorias</p>
            <p className="text-gray-400 text-xs">
              Si un partido va a penales, también debes predecir qué equipo clasifica.
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-green-600 rounded-3xl p-5 shadow-lg">
          <p className="text-green-200 font-black uppercase text-[10px] tracking-widest mb-4 text-center">Resumen rápido</p>
          <div className="grid grid-cols-4 gap-2 text-center mb-2">
            {[
              { pts: '5', label: 'Exacto' },
              { pts: '2', label: 'Ganador' },
              { pts: '3', label: 'Bono\ngrupo' },
              { pts: '3', label: 'Bono\n3eros' },
            ].map(({ pts, label }) => (
              <div key={label} className="bg-green-700/50 rounded-2xl py-3 px-1">
                <p className="text-white font-black text-2xl">+{pts}</p>
                <p className="text-green-200 text-[10px] mt-1 whitespace-pre-line leading-tight">{label}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-green-500 pt-3 mt-1">
            <p className="text-green-200 font-black uppercase text-[10px] tracking-widest mb-2 text-center">Picks especiales</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { pts: '8', label: 'Campeón' },
                { pts: '8', label: 'Goleador' },
                { pts: '8', label: 'Arquero' },
              ].map(({ pts, label }) => (
                <div key={label} className="bg-yellow-500/30 border border-yellow-400/40 rounded-2xl py-3 px-1">
                  <p className="text-yellow-300 font-black text-2xl">+{pts}</p>
                  <p className="text-yellow-100 text-[10px] mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA final */}
        {!user ? (
          <button
            onClick={loginWithGoogle}
            className="w-full bg-white border-2 border-gray-900 text-gray-900 px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-gray-900 hover:text-white transition-all shadow-xl active:scale-95 mt-2"
          >
            <LogIn size={20} /> ENTRAR CON GOOGLE
          </button>
        ) : (
          <button
            onClick={() => navigate('/predicciones')}
            className="w-full bg-gray-900 text-white px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 mt-2"
          >
            IR A MIS PRONÓSTICOS ⚽
          </button>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predicciones" element={<PredictionScreen />} />
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