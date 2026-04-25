import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export const useOfficialSpecial = () => {
  const [officialSpecial, setOfficialSpecial] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "officialSpecial", "picks"), (snap) => {
      if (snap.exists()) setOfficialSpecial(snap.data());
    });
    return () => unsubscribe();
  }, []);

  return officialSpecial;
};