import React from 'react';

const GroupTable = ({ groupName, table }) => {
  return (
    <div className="mt-4 mb-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 italic">
        Tabla Proyectada • Grupo {groupName}
      </h3>
      <div className="space-y-2">
        <div className="grid grid-cols-6 text-[9px] font-black uppercase text-gray-300 pb-2 border-b">
          <span className="col-span-3">Equipo</span>
          <span className="text-center">PJ</span>
          <span className="text-center">DG</span>
          <span className="text-center text-green-600">PTS</span>
        </div>
        {table.map((team, index) => (
          <div 
            key={team.name} 
            className={`grid grid-cols-6 py-2 items-center ${index < 2 ? 'text-gray-800' : 'text-gray-400'}`}
          >
            <div className="col-span-3 flex items-center gap-2">
              <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${index < 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                {index + 1}
              </span>
              <span className="font-bold text-xs truncate">{team.name}</span>
            </div>
            <span className="text-center text-xs font-medium">{team.p}</span>
            <span className="text-center text-xs font-medium">{team.gd > 0 ? `+${team.gd}` : team.gd}</span>
            <span className={`text-center text-sm font-black ${index < 2 ? 'text-green-600' : ''}`}>{team.pts}</span>
          </div>
        ))}
      </div>
      {/* Indicador de Bono */}
      <div className="mt-4 pt-4 border-t border-dashed border-gray-100">
        <p className="text-[9px] text-gray-400 italic">
          * Si este orden coincide con el final de la FIFA, sumas <span className="font-bold text-green-600">+3 PTS</span> de bono.
        </p>
      </div>
    </div>
  );
};

export default GroupTable;