import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export const useOfficialFixture = () => {
  const [officialData, setOfficialData] = useState({});

  useEffect(() => {
    // Escuchamos la colección en tiempo real
    const unsubscribe = onSnapshot(collection(db, "official_fixture"), (snapshot) => {
      const data = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setOfficialData(data);
    });

    return () => unsubscribe();
  }, []);

  return officialData;
};