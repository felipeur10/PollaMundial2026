import { db } from '../services/firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

export const useFirestore = () => {

  // ✅ Guarda todas las predicciones en UN SOLO documento por usuario
  const saveAllPredictions = async (userId, predictions, user) => {
    try {
      const userRef = doc(db, "predictions", userId); // <- ID = userId
      await setDoc(userRef, {
        userName: user.displayName || "Anónimo",
        userPhoto: user.photoURL || null,
        predictions: predictions, // <- Todo el objeto de una vez
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error("Error guardando en Firebase:", error);
      return { success: false, error };
    }
  };

  // ✅ Lee las predicciones de UN usuario específico (para modo lectura)
  const getUserPredictions = async (userId) => {
    try {
      const userRef = doc(db, "predictions", userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return { success: true, data: snap.data() };
      }
      return { success: false, data: null };
    } catch (error) {
      console.error("Error leyendo predicciones:", error);
      return { success: false, error };
    }
  };

  // ✅ Lee predicciones de TODOS los usuarios (para el ranking)
  const getAllPredictions = async () => {
    try {
      const snapshot = await getDocs(collection(db, "predictions"));
      const all = {};
      snapshot.forEach(doc => {
        all[doc.id] = doc.data();
      });
      return { success: true, data: all };
    } catch (error) {
      console.error("Error leyendo todas las predicciones:", error);
      return { success: false, error };
    }
  };

  return { saveAllPredictions, getUserPredictions, getAllPredictions };
};