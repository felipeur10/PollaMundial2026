import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export const useOfficialResults = () => {
  const [officialResults, setOfficialResults] = useState({});

  useEffect(() => {
    // Escuchamos la colección "results" en tiempo real
    const unsubscribe = onSnapshot(collection(db, "results"), (snapshot) => {
      const resultsData = {};
      snapshot.forEach(doc => {
        // El ID del documento es el matchId (ej: 'm1', 'r32-1')
        resultsData[doc.id] = doc.data();
      });
      setOfficialResults(resultsData);
    });

    // Limpiamos la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  return officialResults;
};