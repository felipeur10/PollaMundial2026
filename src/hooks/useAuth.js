import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setNotAllowed(false);
        setLoading(false);
        return;
      }

      // Verificar si el email está en la lista blanca
      try {
        const snap = await getDoc(doc(db, "config", "allowedEmails"));
        const allowedEmails = snap.exists() ? snap.data().emails || [] : [];
        const isAllowed = allowedEmails
          .map(e => e.trim().toLowerCase())
          .includes(currentUser.email.trim().toLowerCase());

        if (isAllowed) {
          setUser(currentUser);
          setNotAllowed(false);
        } else {
          // No está en la lista — cerramos sesión automáticamente
          await signOut(auth);
          setUser(null);
          setNotAllowed(true);
        }
      } catch (error) {
        console.error("Error verificando lista blanca:", error);
        await signOut(auth);
        setUser(null);
        setNotAllowed(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, notAllowed };
}