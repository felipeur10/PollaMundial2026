import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOfficialResults } from '../../hooks/useOfficialResults';
import { useRanking } from '../../hooks/useRanking';
import { useAuth } from '../../hooks/useAuth';
import { Trophy, Medal, Star, Eye, ChevronLeft } from 'lucide-react';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const officialResults = useOfficialResults();
  const ranking = useRanking(officialResults);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gray-900 p-6 text-white rounded-b-[40px] shadow-2xl mb-8">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <Trophy className="text-yellow-400" size={28} />
            RANKING GENERAL
          </h1>
        </div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 pl-11">
          Bogotá HQ • Mundial 2026
        </p>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {ranking.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <Star size={48} className="mx-auto mb-4" />
            <p className="font-black italic">Esperando primeros resultados...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranking.map((player, index) => {
              const isTop3 = index < 3;
              const isMe = player.id === user?.uid;
              const medalColor =
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-400' :
                'text-orange-500';

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 bg-white rounded-[24px] shadow-sm border-2 transition-all ${
                    isMe
                      ? 'border-green-400 bg-green-50'
                      : isTop3
                      ? 'border-yellow-100 scale-[1.02]'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Posición */}
                    <div className="w-8 flex justify-center">
                      {isTop3 ? (
                        <Medal className={medalColor} size={24} />
                      ) : (
                        <span className="font-black text-gray-300 text-lg">#{index + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={player.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random`}
                        alt={player.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-100"
                      />
                      {index === 0 && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-lg">
                          <Star size={10} className="text-white fill-white" />
                        </div>
                      )}
                      {isMe && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white" />
                      )}
                    </div>

                    {/* Nombre */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-black text-sm uppercase ${isTop3 ? 'text-gray-900' : 'text-gray-600'}`}>
                          {player.name}
                        </span>
                        {isMe && (
                          <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Tú
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {player.bonuses > 0
                          ? `${player.bonuses} bono${player.bonuses > 1 ? 's' : ''} 🎯`
                          : player.points > 0
                          ? 'En racha 🔥'
                          : 'Preparando motores'}
                      </p>
                    </div>
                  </div>

                  {/* Puntos + botón Ver */}
                  <div className="flex items-center gap-3">
                    {/* ✅ Botón Ver pronósticos */}
                    <button
                      onClick={() => navigate(`/predicciones/${player.id}`)}
                      className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all active:scale-95"
                      title={`Ver pronósticos de ${player.name}`}
                    >
                      <Eye size={16} />
                    </button>

                    <div className="bg-gray-900 text-white px-4 py-2 rounded-2xl flex flex-col items-center min-w-[60px]">
                      <span className="text-xs font-black leading-none">{player.points}</span>
                      <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">PTS</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;