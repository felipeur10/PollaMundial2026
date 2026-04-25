import React, { useState, useEffect } from 'react';
import { Trophy, Crosshair, Shield, CheckCircle, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  {
    key: 'champion',
    label: 'Campeón del Mundial',
    placeholder: 'Ej: Argentina',
    icon: Trophy,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50 border-yellow-200',
    iconBg: 'bg-yellow-500',
  },
  {
    key: 'topScorer',
    label: 'Goleador del torneo',
    placeholder: 'Ej: Mbappé',
    icon: Crosshair,
    color: 'text-blue-500',
    bg: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-500',
  },
  {
    key: 'bestGoalkeeper',
    label: 'Mejor arquero',
    placeholder: 'Ej: Courtois',
    icon: Shield,
    color: 'text-purple-500',
    bg: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-500',
  },
];

const SpecialPicks = ({ savedPicks = {}, officialSpecial = {}, onSave, readOnly = false }) => {
  const [picks, setPicks] = useState({
    champion: savedPicks.champion || '',
    topScorer: savedPicks.topScorer || '',
    bestGoalkeeper: savedPicks.bestGoalkeeper || '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Sincronizar si llegan savedPicks nuevos (modo lectura)
  useEffect(() => {
    setPicks({
      champion: savedPicks.champion || '',
      topScorer: savedPicks.topScorer || '',
      bestGoalkeeper: savedPicks.bestGoalkeeper || '',
    });
  }, [savedPicks.champion, savedPicks.topScorer, savedPicks.bestGoalkeeper]);

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(picks);
    setToast(result?.success
      ? { message: '¡Picks guardados! 🏆', type: 'success' }
      : { message: 'Error al guardar.', type: 'error' }
    );
    setTimeout(() => setToast(null), 3000);
    setSaving(false);
  };

  const getResultBadge = (key) => {
    const official = officialSpecial[key];
    const userPick = picks[key];
    if (!official || !userPick) return null;
    const normalize = s => s.trim().toLowerCase();
    const isCorrect = normalize(official) === normalize(userPick);
    return isCorrect
      ? <span className="text-[9px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ +8 pts</span>
      : <span className="text-[9px] font-black bg-red-100 text-red-500 px-2 py-0.5 rounded-full">✗ {official}</span>;
  };

  return (
    <div className="mb-12">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-wide ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 bg-yellow-500 p-4 rounded-2xl shadow-sm">
        <Trophy className="text-white" size={20} />
        <div>
          <h2 className="font-black italic text-white uppercase tracking-tight leading-none">Picks Especiales</h2>
          <p className="text-yellow-100 text-[10px] font-bold uppercase tracking-widest">+8 pts cada acierto</p>
        </div>
      </div>

      <div className="space-y-3">
        {CATEGORIES.map(({ key, label, placeholder, icon: Icon, bg, iconBg }) => (
          <div key={key} className={`bg-white rounded-3xl p-4 shadow-sm border ${readOnly ? 'border-gray-100' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 ${iconBg} rounded-xl`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="font-black text-gray-700 text-xs uppercase tracking-widest">{label}</span>
                {getResultBadge(key)}
              </div>
            </div>
            {readOnly ? (
              <div className={`p-3 rounded-xl border ${bg}`}>
                <p className="font-black text-gray-800 text-sm">
                  {picks[key] || <span className="text-gray-300 font-normal italic">Sin pronóstico</span>}
                </p>
              </div>
            ) : (
              <input
                type="text"
                value={picks[key]}
                onChange={e => setPicks(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
              />
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-yellow-100"
        >
          {saving ? 'GUARDANDO...' : 'GUARDAR PICKS ESPECIALES ⭐'}
        </button>
      )}
    </div>
  );
};

export default SpecialPicks;