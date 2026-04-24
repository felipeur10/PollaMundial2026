import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Trophy, Target, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Decoración de fondo (Efecto de Estadio) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="z-10 text-center max-w-md">
        <div className="mb-6 inline-flex p-4 bg-green-500/20 rounded-3xl border border-green-500/30 animate-bounce">
          <Trophy className="text-green-400" size={40} />
        </div>
        
        <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-4 uppercase">
          Polla <span className="text-green-400">2026</span>
        </h1>
        <p className="text-gray-400 font-medium text-sm mb-12 px-4 uppercase tracking-[0.2em]">
          Bogotá HQ • La competencia oficial
        </p>

        <div className="grid grid-cols-1 gap-4 mb-12">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Target className="text-blue-400" />
            <div className="text-left">
              <p className="font-bold text-xs">PRONOSTICA</p>
              <p className="text-[10px] text-gray-500">Resultados exactos = 5 pts</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Users className="text-purple-400" />
            <div className="text-left">
              <p className="font-bold text-xs">COMPITE</p>
              <p className="text-[10px] text-gray-500">Sube en el ranking en tiempo real</p>
            </div>
          </div>
        </div>

        {!user ? (
          <button 
            onClick={loginWithGoogle}
            className="w-full py-5 bg-white text-gray-900 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            ENTRAR CON GOOGLE
          </button>
        ) : (
          <button 
            onClick={() => navigate('/predicciones')}
            className="w-full py-5 bg-green-500 text-gray-900 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            IR A MIS PRONÓSTICOS <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;