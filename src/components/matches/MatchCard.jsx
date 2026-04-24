import React, { useState, useEffect } from 'react';
import { Lock, Save, Eye } from 'lucide-react';

// ✅ Se agrega readOnly prop (false por defecto — no rompe nada existente)
const MatchCard = ({ match, onSave, savedPrediction, readOnly = false }) => {
  const [homeScore, setHomeScore] = useState(savedPrediction?.homeScore ?? "");
  const [awayScore, setAwayScore] = useState(savedPrediction?.awayScore ?? "");
  const [advances, setAdvances] = useState(savedPrediction?.advances || null);

  const now = new Date();
  const matchDate = new Date(match.date);
  const isExpired = now > matchDate;

  // ✅ Los inputs se bloquean si el partido expiró O si estamos en modo lectura
  const isLocked = isExpired || readOnly;

  useEffect(() => {
    if (savedPrediction) {
      setHomeScore(savedPrediction.homeScore ?? "");
      setAwayScore(savedPrediction.awayScore ?? "");
      setAdvances(savedPrediction.advances || null);
    } else {
      // ✅ Si no hay predicción guardada en modo lectura, limpiar estado
      setHomeScore("");
      setAwayScore("");
      setAdvances(null);
    }
  }, [savedPrediction]);

  const handleInternalSave = () => {
    if (isLocked) return;
    if (homeScore === "" || awayScore === "") return;

    let winner = 'draw';
    if (Number(homeScore) > Number(awayScore)) winner = 'home';
    if (Number(homeScore) < Number(awayScore)) winner = 'away';

    onSave({
      matchId: match.id,
      homeScore: Number(homeScore),
      awayScore: Number(awayScore),
      winner,
      advances: (match.phase !== 'grupos' && homeScore === awayScore) ? advances : winner,
      timestamp: new Date().toISOString()
    });
  };

  // ✅ Estado visual: sin predicción en modo lectura
  const hasNoPrediction = readOnly && homeScore === "" && awayScore === "";

  return (
    <div className={`p-5 rounded-3xl border-2 transition-all mb-4 ${
      readOnly
        ? 'bg-blue-50/50 border-blue-100'          // ← azul suave en modo lectura
        : isExpired
        ? 'bg-gray-50 border-gray-100 opacity-75'
        : 'bg-white border-white shadow-md'
    }`}>

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
          {match.phase === 'grupos' ? `Grupo ${match.group}` : match.phase}
        </span>

        {/* ✅ Badge de estado según contexto */}
        {readOnly ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase">
            <Eye size={10} /> Solo lectura
          </span>
        ) : isExpired ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full uppercase">
            <Lock size={10} /> Mercado Cerrado
          </span>
        ) : (
          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase">
            Abierto
          </span>
        )}
      </div>

      {/* ✅ Si no hay pronóstico en modo lectura → placeholder amigable */}
      {hasNoPrediction ? (
        <div className="py-6 flex flex-col items-center justify-center gap-2 opacity-40">
          <div className="flex items-center justify-around gap-2 w-full">
            <span className="font-bold text-sm text-gray-500 text-center flex-1">{match.home}</span>
            <div className="text-gray-300 font-black italic">–</div>
            <span className="font-bold text-sm text-gray-500 text-center flex-1">{match.away}</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Sin pronóstico</p>
        </div>
      ) : (
        <>
          {/* Marcadores */}
          <div className="flex items-center justify-around gap-2">
            <div className="flex flex-col items-center flex-1">
              <span className="font-bold text-sm mb-2 text-gray-800 text-center">{match.home}</span>
              <input
                type="number"
                disabled={isLocked}          // ✅ usa isLocked en vez de isExpired
                value={homeScore}
                onChange={(e) => setHomeScore(e.target.value)}
                className="w-14 h-14 text-center text-2xl font-black rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
            </div>

            <div className="text-gray-300 font-black italic pt-6">VS</div>

            <div className="flex flex-col items-center flex-1">
              <span className="font-bold text-sm mb-2 text-gray-800 text-center">{match.away}</span>
              <input
                type="number"
                disabled={isLocked}          // ✅ usa isLocked en vez de isExpired
                value={awayScore}
                onChange={(e) => setAwayScore(e.target.value)}
                className="w-14 h-14 text-center text-2xl font-black rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Desempate Knockout */}
          {match.phase !== 'grupos' && homeScore === awayScore && homeScore !== "" && (
            <div className="mt-5 p-3 bg-blue-50 rounded-2xl text-center border border-blue-100 animate-in fade-in duration-500">
              <p className="text-[10px] text-blue-700 mb-2 uppercase tracking-widest font-black italic">
                {readOnly ? '¿Quién clasificó en penales?' : '¿Quién clasifica en penales?'}
              </p>
              <div className="flex justify-center gap-3">
                <button
                  disabled={isLocked}        // ✅ usa isLocked en vez de isExpired
                  onClick={() => setAdvances('home')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    advances === 'home' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400'
                  }`}
                >
                  {match.home}
                </button>
                <button
                  disabled={isLocked}        // ✅ usa isLocked en vez de isExpired
                  onClick={() => setAdvances('away')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    advances === 'away' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400'
                  }`}
                >
                  {match.away}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ✅ Botón de guardar: oculto en modo lectura Y cuando el partido expiró */}
      {!isLocked && (
        <button
          onClick={handleInternalSave}
          className="w-full mt-5 bg-gray-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-lg"
        >
          <Save size={16} /> GUARDAR PRONÓSTICO
        </button>
      )}
    </div>
  );
};

export default MatchCard;