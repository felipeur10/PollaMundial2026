import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import { fixture } from '../../utils/fixture';
import { knockoutFixture } from '../../utils/KnockoutFixture';
import { Trophy, Settings, Users, Zap, CheckCircle } from 'lucide-react';

const AdminPanel = () => {
  // ✅ Estado para resultados — cargados desde Firestore
  const [results, setResults] = useState({});
  // ✅ Estado para equipos de knockout — cargados desde Firestore
  const [teams, setTeams] = useState({});
  // ✅ Estado para picks especiales — cargados desde Firestore
  const [specialPicks, setSpecialPicks] = useState({
    champion: '',
    topScorer: '',
    bestGoalkeeper: '',
  });

  // ✅ Cargar resultados desde Firestore al montar
  useEffect(() => {
    const unsubResults = onSnapshot(collection(db, "results"), (snapshot) => {
      const data = {};
      snapshot.forEach(doc => { data[doc.id] = doc.data(); });
      setResults(data);
    });

    const unsubTeams = onSnapshot(collection(db, "official_fixture"), (snapshot) => {
      const data = {};
      snapshot.forEach(doc => { data[doc.id] = doc.data(); });
      setTeams(data);
    });

    const unsubSpecial = onSnapshot(doc(db, "officialSpecial", "picks"), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setSpecialPicks({
          champion: d.champion || '',
          topScorer: d.topScorer || '',
          bestGoalkeeper: d.bestGoalkeeper || '',
        });
      }
    });

    return () => {
      unsubResults();
      unsubTeams();
      unsubSpecial();
    };
  }, []);

  // 1. DEFINIR EQUIPOS
  const updateMatchTeams = async (matchId) => {
    const h = teams[matchId]?.homeInput || '';
    const a = teams[matchId]?.awayInput || '';
    if (!h || !a) return alert("Escribe ambos nombres antes de actualizar.");
    try {
      await setDoc(doc(db, "official_fixture", matchId), {
        home: h,
        away: a,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      alert(`Llave ${matchId} lista: ${h} vs ${a} 🏟️`);
    } catch (e) {
      console.error(e);
    }
  };

  // 2. PUBLICAR RESULTADOS
  const saveOfficialResult = async (matchId) => {
    const hScore = results[matchId]?.homeInput ?? '';
    const aScore = results[matchId]?.awayInput ?? '';
    if (hScore === '' || aScore === '') return alert("Ingresa el marcador oficial");
    try {
      await setDoc(doc(db, "results", matchId), {
        homeScore: Number(hScore),
        awayScore: Number(aScore),
        status: 'finished',
        publishedAt: new Date().toISOString()
      });
      alert("Resultado publicado. ¡Ranking actualizado para todos! 📣");
    } catch (e) {
      console.error(e);
    }
  };

  // 3. PUBLICAR PICKS ESPECIALES
  const saveOfficialSpecial = async () => {
    const { champion, topScorer, bestGoalkeeper } = specialPicks;
    if (!champion || !topScorer || !bestGoalkeeper)
      return alert("Completa los tres campos antes de publicar.");
    try {
      await setDoc(doc(db, "officialSpecial", "picks"), {
        champion,
        topScorer,
        bestGoalkeeper,
        publishedAt: new Date().toISOString()
      });
      alert("Picks especiales publicados. ¡Puntos actualizados! ⭐");
    } catch (e) {
      console.error(e);
    }
  };

  // Helper: valor del input de resultado (prioriza lo que el admin está editando,
  // si no hay edición pendiente muestra el valor guardado en Firestore)
  const getHomeValue = (matchId) => {
    if (results[matchId]?.homeInput !== undefined) return results[matchId].homeInput;
    if (results[matchId]?.homeScore !== undefined) return results[matchId].homeScore;
    return '';
  };
  const getAwayValue = (matchId) => {
    if (results[matchId]?.awayInput !== undefined) return results[matchId].awayInput;
    if (results[matchId]?.awayScore !== undefined) return results[matchId].awayScore;
    return '';
  };

  const isPublished = (matchId) => results[matchId]?.status === 'finished';

  return (
    <div className="p-6 bg-gray-100 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 bg-white p-8 rounded-[32px] shadow-sm border border-gray-200">
          <h1 className="text-3xl font-black italic text-gray-900 flex items-center gap-3">
            <Settings className="text-blue-600" /> BOGOTÁ HQ ADMIN
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
            Mundial 2026 • Panel de Control Oficial
          </p>
        </header>

        {/* --- BLOQUE 1: DEFINIR CRUCES DE MUERTE SÚBITA --- */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-blue-600" size={20} />
            <h2 className="text-xl font-black italic uppercase tracking-tighter">1. Definir Llaves</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knockoutFixture.map(match => (
              <div key={match.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200">
                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase mb-4 inline-block">
                  {match.phase}
                </span>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    placeholder={teams[match.id]?.home || "Local"}
                    value={teams[match.id]?.homeInput ?? teams[match.id]?.home ?? ''}
                    onChange={e => setTeams(prev => ({
                      ...prev,
                      [match.id]: { ...prev[match.id], homeInput: e.target.value }
                    }))}
                    className="flex-1 p-3 bg-gray-50 rounded-xl font-bold text-xs border focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="font-black italic text-gray-300">VS</span>
                  <input
                    placeholder={teams[match.id]?.away || "Visitante"}
                    value={teams[match.id]?.awayInput ?? teams[match.id]?.away ?? ''}
                    onChange={e => setTeams(prev => ({
                      ...prev,
                      [match.id]: { ...prev[match.id], awayInput: e.target.value }
                    }))}
                    className="flex-1 p-3 bg-gray-50 rounded-xl font-bold text-xs border focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                {/* ✅ Muestra los nombres ya guardados */}
                {teams[match.id]?.home && (
                  <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
                    <CheckCircle size={10} /> Guardado: {teams[match.id].home} vs {teams[match.id].away}
                  </p>
                )}
                <button
                  onClick={() => updateMatchTeams(match.id)}
                  className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors"
                >
                  Actualizar Nombres
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* --- BLOQUE 2: CARGAR RESULTADOS (GRUPOS + LLAVES) --- */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-green-600" size={20} />
            <h2 className="text-xl font-black italic uppercase tracking-tighter">2. Publicar Marcadores Reales</h2>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-gray-200 overflow-hidden">
            {[...fixture, ...knockoutFixture].map((match, index) => (
              <div
                key={match.id}
                className={`flex items-center justify-between p-6 ${
                  isPublished(match.id) ? 'bg-green-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                } border-b border-gray-100 last:border-0`}
              >
                <div className="flex-1">
                  <p className="text-[9px] font-black text-blue-500 uppercase">{match.group || match.phase}</p>
                  <p className="font-black text-sm text-gray-800 uppercase italic tracking-tighter">
                    {match.home} vs {match.away}
                  </p>
                  {/* ✅ Muestra badge si ya fue publicado */}
                  {isPublished(match.id) && (
                    <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-0.5">
                      <CheckCircle size={10} /> Publicado: {results[match.id].homeScore} - {results[match.id].awayScore}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-2xl p-1 border">
                    <input
                      type="number"
                      placeholder="0"
                      value={getHomeValue(match.id)}
                      onChange={e => setResults(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], homeInput: e.target.value }
                      }))}
                      className="w-10 h-10 text-center font-black bg-transparent outline-none text-blue-600"
                    />
                    <span className="text-gray-400 font-bold mx-1">:</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={getAwayValue(match.id)}
                      onChange={e => setResults(prev => ({
                        ...prev,
                        [match.id]: { ...prev[match.id], awayInput: e.target.value }
                      }))}
                      className="w-10 h-10 text-center font-black bg-transparent outline-none text-red-600"
                    />
                  </div>
                  <button
                    onClick={() => saveOfficialResult(match.id)}
                    className="bg-green-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-600 transition shadow-lg shadow-green-100 active:scale-90"
                  >
                    <Zap size={18} fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- BLOQUE 3: PICKS ESPECIALES OFICIALES --- */}
        <section className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-yellow-500" size={20} />
            <h2 className="text-xl font-black italic uppercase tracking-tighter">3. Picks Especiales Oficiales</h2>
          </div>
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-200 space-y-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Publicar solo al final del torneo. Cada acierto vale +8 pts.
            </p>
            {[
              { key: 'champion', label: '🏆 Campeón del Mundial', placeholder: 'Ej: Argentina' },
              { key: 'topScorer', label: '⚽ Goleador del torneo', placeholder: 'Ej: Mbappé' },
              { key: 'bestGoalkeeper', label: '🧤 Mejor arquero', placeholder: 'Ej: Courtois' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">{label}</label>
                <input
                  placeholder={placeholder}
                  value={specialPicks[key]}
                  onChange={e => setSpecialPicks(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full p-3 bg-gray-50 rounded-xl font-bold text-sm border border-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            ))}
            <button
              onClick={saveOfficialSpecial}
              className="w-full bg-yellow-500 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yellow-600 transition-all active:scale-95 shadow-lg shadow-yellow-100"
            >
              Publicar resultados oficiales ⭐
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminPanel;