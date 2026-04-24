import { db } from '../../services/firebase';
import { updateDoc, doc, collection, getDocs, where, query } from 'firebase/firestore';
import { calculateMatchPoints } from '../../services/scoringEngine';

const AdminResults = ({ match }) => {
  const handleFinalResult = async (resA, resB) => {
    // 1. Actualizar el partido real
    const matchRef = doc(db, "matches", match.id);
    const realWinner = resA > resB ? 'teamA' : resB > resA ? 'teamB' : 'draw';
    
    await updateDoc(matchRef, {
      scoreA: resA,
      scoreB: resB,
      status: 'finished',
      realWinner
    });

    // 2. Ejecutar Motor de Puntuación para todos los que predijeron este partido
    const predsRef = collection(db, "predictions");
    const q = query(predsRef, where("matchId", "==", match.id));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (predictionDoc) => {
      const predData = predictionDoc.data();
      const points = calculateMatchPoints(predData, { scoreA: resA, scoreB: resB, realWinner }, match);
      
      // Actualizar puntos de la predicción
      await updateDoc(doc(db, "predictions", predictionDoc.id), { pointsEarned: points });
      
      // Aquí también deberías disparar una actualización al total en 'rankings'
    });
  };

  return (
    // UI similar al MatchCard pero con botón "Finalizar Partido"
    <div>{/* ... */}</div>
  );
};