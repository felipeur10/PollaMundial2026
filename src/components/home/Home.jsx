import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Trophy, Target, Users, ArrowRight, Star, Zap, ChevronDown } from 'lucide-react';

const Home = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 overflow-hidden relative">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[120px]"></div>
      </div>

      {/* ── HERO ── */}
      <div className="z-10 text-center max-w-md w-full flex flex-col items-center justify-center min-h-screen">
        <div className="mb-6 inline-flex p-4 bg-green-500/20 rounded-3xl border border-green-500/30 animate-bounce">
          <Trophy className="text-green-400" size={40} />
        </div>

        <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-4 uppercase">
          Polla <span className="text-green-400">2026</span>
        </h1>
        <p className="text-gray-400 font-medium text-sm mb-12 px-4 uppercase tracking-[0.2em]">
          Bogotá HQ • La competencia oficial
        </p>

        <div className="grid grid-cols-1 gap-4 mb-12 w-full">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Target className="text-blue-400 shrink-0" />
            <div className="text-left">
              <p className="font-bold text-xs">PRONOSTICA</p>
              <p className="text-[10px] text-gray-500">Resultados exactos = 5 pts</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <Users className="text-purple-400 shrink-0" />
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

        {/* Indicador de scroll */}
        <div className="mt-10 flex flex-col items-center gap-1 text-gray-600">
          <p className="text-[10px] uppercase tracking-widest">Cómo funciona</p>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </div>

      {/* ── REGLAMENTO ── */}
      <div className="z-10 max-w-md w-full pb-16 space-y-4">

        {/* Título sección */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight">Sistema de <span className="text-green-400">puntos</span></h2>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">Lee antes de pronosticar</p>
        </div>

        {/* Puntos por partido */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Target size={18} className="text-white" />
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wide">Puntos por partido</h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-semibold">Marcador exacto</p>
                <p className="text-gray-400 text-xs">Ej: predijiste 2-1, fue 2-1</p>
              </div>
              <span className="text-yellow-400 font-black text-xl">+5</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-semibold">Ganador o empate</p>
                <p className="text-gray-400 text-xs">Acertaste quién gana o que empata</p>
              </div>
              <span className="text-white font-black text-xl">+2</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div>
                <p className="text-white text-sm font-semibold">Resultado incorrecto</p>
                <p className="text-gray-400 text-xs">No acertaste nada</p>
              </div>
              <span className="text-gray-500 font-black text-xl">0</span>
            </div>
          </div>
        </div>

        {/* Bonos */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500 rounded-xl">
              <Star size={18} className="text-white" />
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wide">Bonos especiales</h3>
          </div>

          <div className="space-y-3">
            {/* Bono grupo */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-white font-bold text-sm">Bono de Grupo</p>
                <span className="text-yellow-400 font-black text-lg shrink-0">+3</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Acertar el <span className="text-white font-semibold">1° y 2° lugar exactos</span> de un grupo al final de la fase de grupos. El orden importa.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
                  <p className="text-green-400 text-[10px] font-bold mb-1">✓ CORRECTO</p>
                  <p className="text-white text-[10px]">1° Argentina</p>
                  <p className="text-white text-[10px]">2° Colombia</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                  <p className="text-red-400 text-[10px] font-bold mb-1">✗ INCORRECTO</p>
                  <p className="text-white text-[10px]">1° Colombia</p>
                  <p className="text-white text-[10px]">2° Argentina</p>
                </div>
              </div>
            </div>

            {/* Bono mejores terceros */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-white font-bold text-sm">Bono Mejores Terceros</p>
                <span className="text-yellow-400 font-black text-lg shrink-0">+3</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Acertar los <span className="text-white font-semibold">8 equipos</span> que clasifican como mejores terceros de los 12 grupos. El orden entre ellos no importa.
              </p>
            </div>
          </div>
        </div>

        {/* Fase eliminatoria */}
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-600 rounded-xl">
              <Zap size={18} className="text-white" />
            </div>
            <h3 className="font-bold text-white uppercase text-sm tracking-wide">Fase Eliminatoria</h3>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-3">
            El sistema de puntos es el mismo (+5 exacto, +2 ganador), pero los equipos de cada partido se revelan cuando termina la fase de grupos. El Admin los publica en tiempo real.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-300 text-xs font-semibold mb-1">⚡ Empates en eliminatorias</p>
            <p className="text-gray-400 text-xs">
              Si un partido va a penales, también debes predecir qué equipo clasifica. Acertarlo suma puntos adicionales.
            </p>
          </div>
        </div>

        {/* Resumen visual */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
          <p className="text-green-400 font-black uppercase text-xs tracking-widest mb-4 text-center">Resumen rápido</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { pts: '5', label: 'Exacto' },
              { pts: '2', label: 'Ganador' },
              { pts: '3', label: 'Bono\ngrupo' },
              { pts: '3', label: 'Bono\n3eros' },
            ].map(({ pts, label }) => (
              <div key={label} className="bg-gray-800 rounded-xl py-3 px-1">
                <p className="text-green-400 font-black text-2xl">+{pts}</p>
                <p className="text-gray-400 text-[10px] mt-1 whitespace-pre-line leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        {!user ? (
          <button
            onClick={loginWithGoogle}
            className="w-full py-5 bg-white text-gray-900 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 mt-4"
          >
            ENTRAR CON GOOGLE
          </button>
        ) : (
          <button
            onClick={() => navigate('/predicciones')}
            className="w-full py-5 bg-green-500 text-gray-900 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 mt-4"
          >
            IR A MIS PRONÓSTICOS <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;