import { db } from '../services/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export const useFirestore = () => {

  // ✅ merge: true para no pisar specialPicks al guardar predicciones
  const saveAllPredictions = async (userId, predictions, user) => {
    try {
      const userRef = doc(db, "predictions", userId);
      await setDoc(userRef, {
        userName: user.displayName || "Anónimo",
        userPhoto: user.photoURL || null,
        predictions: predictions,
        updatedAt: new Date()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error guardando en Firebase:", error);
      return { success: false, error };
    }
  };

  // ✅ NUEVO: guarda campeón, goleador y arquero del usuario
  const saveSpecialPicks = async (userId, specialPicks, user) => {
    try {
      const userRef = doc(db, "predictions", userId);
      await setDoc(userRef, {
        userName: user.displayName || "Anónimo",
        userPhoto: user.photoURL || null,
        specialPicks: specialPicks,
        updatedAt: new Date()
      }, { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error guardando picks especiales:", error);
      return { success: false, error };
    }
  };

  const getUserPredictions = async (userId) => {
    try {
      const userRef = doc(db, "predictions", userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) return { success: true, data: snap.data() };
      return { success: false, data: null };
    } catch (error) {
      console.error("Error leyendo predicciones:", error);
      return { success: false, error };
    }
  };

  const getAllPredictions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "predictions"));
      const all = {};
      snapshot.forEach(doc => { all[doc.id] = doc.data(); });
      return { success: true, data: all };
    } catch (error) {
      console.error("Error leyendo todas las predicciones:", error);
      return { success: false, error };
    }
  };

  return { saveAllPredictions, saveSpecialPicks, getUserPredictions, getAllPredictions };
};