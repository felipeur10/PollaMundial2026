import React from 'react';

const ThirdPlacesTable = ({ thirds }) => {
  return (
    <div className="mt-12 mb-20 bg-slate-900 rounded-[32px] p-6 shadow-2xl text-white border-t-4 border-blue-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black italic tracking-tighter">MEJORES TERCEROS</h3>
          <p className="text-[9px] text-blue-400 uppercase font-bold tracking-widest">Clasifican los mejores 8</p>
        </div>
        <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Global</span>
      </div>

      <div className="space-y-2">
        {thirds.map((team, index) => {
          const isQualified = index < 8;
          return (
            <div 
              key={team.name} 
              className={`flex items-center justify-between p-3 rounded-xl border ${
                isQualified ? 'bg-white/5 border-white/10' : 'bg-red-900/10 border-red-900/20 opacity-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black ${isQualified ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-sm leading-none">{team.name}</p>
                  <p className="text-[9px] text-gray-500 uppercase font-bold">Grupo {team.originGroup}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">DG</p>
                  <p className="font-bold text-xs">{team.gd > 0 ? `+${team.gd}` : team.gd}</p>
                </div>
                <div className="text-right min-w-[30px]">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">PTS</p>
                  <p className={`font-black text-sm ${isQualified ? 'text-blue-400' : 'text-gray-500'}`}>{team.pts}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {!thirds.length && <p className="text-center text-gray-500 text-xs italic py-4">Ingresa resultados para calcular...</p>}
    </div>
  );
};

export default ThirdPlacesTable;