import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useFirestore } from '../../hooks/useFirestore';
import { useAuth } from '../../hooks/useAuth';
import { useOfficialFixture } from '../../hooks/useOfficialFixture';
import { useOfficialSpecial } from '../../hooks/useOfficialSpecial';

import { fixture } from '../../utils/fixture';
import { knockoutFixture } from '../../utils/KnockoutFixture';

import MatchCard from './MatchCard';
import GroupTable from './GroupTable';
import ThirdPlacesTable from './ThirdPlacesTable';
import SpecialPicks from './SpecialPicks';

import { calculateGroupTable } from '../../utils/groupLogic';
import { getBestThirdPlaces } from '../../utils/thirdPlacesLogic';
import { ChevronLeft, Send, Trophy, Eye, CloudFog, CheckCircle, AlertCircle } from 'lucide-react';

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Devuelve true si el partido ya comenzó (mercado cerrado)
const isMatchStarted = (match) => {
  return new Date() > new Date(match.date);
};

// En modo lectura, solo revela la predicción si el partido ya empezó
const getPredictionForView = (match, predictions, readOnly) => {
  if (!readOnly) return predictions[match.id];
  return isMatchStarted(match) ? predictions[match.id] : null;
};

// ✅ Los special picks se bloquean y revelan al pitazo inicial del torneo
// Jun 11 2026 19:00 UTC = 2:00 PM COT
const isPicksLocked = () => {
  return new Date() > new Date('2026-06-11T19:00:00Z');
};

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = type === 'success'
    ? 'bg-green-600 text-white'
    : 'bg-red-500 text-white';

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-wide transition-all ${colors}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {message}
    </div>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────
const PredictionScreen = ({ readOnly = false }) => {
  const navigate = useNavigate();
  const { uid } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { saveAllPredictions, saveSpecialPicks, getUserPredictions } = useFirestore();
  const officialData = useOfficialFixture();
  const officialSpecial = useOfficialSpecial();

  // Estado modo edición
  const [userPredictions, setUserPredictions] = useLocalStorage('mis_predicciones_2026', {});
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState(null);

  // Special picks del usuario autenticado (vienen de Firestore, no localStorage)
  const [savedSpecialPicks, setSavedSpecialPicks] = useState({});

  // Estado modo lectura
  const [viewedPredictions, setViewedPredictions] = useState({});
  const [viewedUser, setViewedUser] = useState(null);
  const [isLoadingView, setIsLoadingView] = useState(false);

  // Carga datos cuando es modo lectura
  useEffect(() => {
    if (!readOnly || !uid) return;
    const loadUserData = async () => {
      setIsLoadingView(true);
      const result = await getUserPredictions(uid);
      if (result.success && result.data) {
        setViewedPredictions(result.data || {});
        setViewedUser({
          name: result.data.userName || 'Anónimo',
          photo: result.data.userPhoto || null,
        });
      }
      setIsLoadingView(false);
    };
    loadUserData();
  }, [uid, readOnly]);

  // Carga los special picks del usuario autenticado al montar
  useEffect(() => {
    if (readOnly || !user) return;
    getUserPredictions(user.uid).then(result => {
      if (result.success && result.data?.specialPicks) {
        setSavedSpecialPicks(result.data.specialPicks);
      }
    });
  }, [user]);

  // Las predicciones activas dependen del modo
  const activePredictions = readOnly
    ? viewedPredictions.predictions || {}
    : userPredictions;

  const handleSavePrediction = (data) => {
    if (readOnly) return;
    setUserPredictions(prev => ({ ...prev, [data.matchId]: data }));
    setIsDirty(true);
  };

  const handleUpload = async () => {
    if (!user) return setToast({ message: 'Inicia sesión primero', type: 'error' });
    setIsSyncing(true);
    const result = await saveAllPredictions(user.uid, userPredictions, user);
    setToast(
      result.success
        ? { message: '¡Pronósticos guardados! 🏆', type: 'success' }
        : { message: 'Error al guardar. Intenta de nuevo.', type: 'error' }
    );
    if (result.success) setIsDirty(false);
    setIsSyncing(false);
  };

  // Guarda los special picks directo a Firestore
  const handleSaveSpecialPicks = async (picks) => {
    if (!user) return { success: false };
    const result = await saveSpecialPicks(user.uid, picks, user);
    if (result.success) setSavedSpecialPicks(picks);
    return result;
  };

  // ─── Loading states ──────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic text-gray-400">
        Preparando el campo...
      </div>
    );
  }

  if (readOnly && isLoadingView) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin" />
        <p className="font-black italic text-gray-400 uppercase text-sm tracking-widest">
          Cargando pronósticos...
        </p>
      </div>
    );
  }

  if (readOnly && !viewedUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 p-6">
        <p className="font-black italic text-gray-500 text-center">
          Este usuario aún no ha enviado sus pronósticos.
        </p>
        <button
          onClick={() => navigate('/ranking')}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest"
        >
          Volver al Ranking
        </button>
      </div>
    );
  }

  const bestThirds = getBestThirdPlaces(groups, fixture, activePredictions);

  return (
    <div className="min-h-screen bg-gray-100 pb-44">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className={`p-4 text-white sticky top-0 z-30 flex items-center justify-between shadow-xl ${
        readOnly ? 'bg-blue-900' : 'bg-gray-900'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(readOnly ? '/ranking' : '/')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          {readOnly ? (
            <div className="flex items-center gap-3">
              {viewedUser?.photo && (
                <img
                  src={viewedUser.photo}
                  alt={viewedUser.name}
                  className="w-8 h-8 rounded-xl border border-blue-700"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <Eye size={14} className="text-blue-300" />
                  <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">
                    Modo lectura
                  </span>
                </div>
                <h1 className="font-black italic tracking-tighter uppercase text-sm leading-none">
                  {viewedUser?.name?.split(' ')[0]}
                </h1>
              </div>
            </div>
          ) : (
            <h1 className="font-black italic tracking-tighter uppercase">Mis Pronósticos</h1>
          )}
        </div>

        {!readOnly && user && (
          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="text-[9px] font-black uppercase bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full animate-pulse">
                Sin guardar
              </span>
            )}
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-xl border border-gray-700"
            />
          </div>
        )}
      </div>

      {/* ─── Banner modo lectura ─────────────────────────────────────────── */}
      {readOnly && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between">
          <p className="text-blue-700 text-xs font-bold uppercase tracking-wide">
            Estás viendo los pronósticos de {viewedUser?.name}
          </p>
          <button
            onClick={() => navigate('/predicciones')}
            className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-800 transition-colors"
          >
            Ver los míos →
          </button>
        </div>
      )}

      <div className="p-4 max-w-2xl mx-auto">

        {/* ─── PICKS ESPECIALES ────────────────────────────────────────────── */}
        {/* ✅ En modo lectura: se revelan cuando arranca el torneo (isPicksLocked)
            En modo edición: se bloquean cuando arranca el torneo (manejado en SpecialPicks.jsx) */}
        <SpecialPicks
          savedPicks={readOnly
            ? (isPicksLocked() ? (viewedPredictions?.specialPicks || {}) : {})
            : savedSpecialPicks
          }
          officialSpecial={officialSpecial}
          tournamentOver={isPicksLocked()}
          onSave={handleSaveSpecialPicks}
          readOnly={readOnly}
        />

        {/* ─── FASE DE GRUPOS ──────────────────────────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8 bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-600">
            <Trophy className="text-green-600" size={20} />
            <h2 className="font-black italic text-gray-800 uppercase tracking-tight">Fase de Grupos</h2>
          </div>

          {groups.map(groupLetter => {
            const groupMatches = fixture.filter(m => m.group === groupLetter);
            if (groupMatches.length === 0) return null;
            const table = calculateGroupTable(groupLetter, fixture, activePredictions);

            return (
              <div key={groupLetter} className="mb-16">
                <h2 className="text-xl font-black italic mb-6 flex items-center gap-3 text-gray-700">
                  <span className="bg-green-600 text-white w-9 h-9 rounded-lg flex items-center justify-center shadow-md text-xs">
                    {groupLetter}
                  </span>
                  GRUPO {groupLetter}
                </h2>
                <div className="space-y-4">
                  {groupMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onSave={handleSavePrediction}
                      // ✅ En modo lectura, oculta predicciones de partidos no iniciados
                      savedPrediction={getPredictionForView(match, activePredictions, readOnly)}
                      readOnly={readOnly}
                    />
                  ))}
                </div>
                <GroupTable groupName={groupLetter} table={table} />
              </div>
            );
          })}
        </div>

        {/* ─── MEJORES TERCEROS ────────────────────────────────────────────── */}
        <ThirdPlacesTable thirds={bestThirds} />

        {/* ─── MUERTE SÚBITA ───────────────────────────────────────────────── */}
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-10 bg-gray-900 p-5 rounded-[32px] shadow-xl border-b-4 border-blue-500">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Trophy className="text-white" size={20} />
            </div>
            <h2 className="font-black italic text-white text-xl uppercase tracking-tighter">Muerte Súbita</h2>
          </div>

          <div className="space-y-10">
            {knockoutFixture.map(match => {
              const liveMatch = {
                ...match,
                home: officialData[match.id]?.home || match.home,
                away: officialData[match.id]?.away || match.away,
              };
              return (
                <div key={liveMatch.id} className="relative">
                  <span className="absolute -top-3 left-6 bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10 shadow-lg">
                    {liveMatch.phase}
                  </span>
                  <MatchCard
                    match={liveMatch}
                    onSave={handleSavePrediction}
                    // ✅ En modo lectura, oculta predicciones de partidos no iniciados
                    savedPrediction={getPredictionForView(liveMatch, activePredictions, readOnly)}
                    readOnly={readOnly}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Botón flotante (solo modo edición) ──────────────────────────── */}
      {!readOnly && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-100 via-gray-100 to-transparent z-40">
          <button
            onClick={handleUpload}
            disabled={isSyncing}
            className={`w-full max-w-md mx-auto h-18 text-white rounded-[24px] shadow-2xl font-black flex items-center justify-center gap-4 transition-all active:scale-95 ${
              isDirty
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-700 hover:bg-gray-800'
            }`}
          >
            {isSyncing ? <CloudFog className="animate-bounce" /> : <Send size={22} />}
            <span className="text-lg">
              {isSyncing ? 'GUARDANDO...' : isDirty ? 'ENVIAR PRONÓSTICOS 🚀' : 'PRONÓSTICOS GUARDADOS ✓'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PredictionScreen;