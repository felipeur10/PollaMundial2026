import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDV2CTID7kQ1a2T_W2zsBWj9O8ZR4l9Qz0",
  authDomain: "pollamundial2026-a1bc1.firebaseapp.com",
  projectId: "pollamundial2026-a1bc1",
  storageBucket: "pollamundial2026-a1bc1.appspot.com",
  messagingSenderId: "562242912111",
  appId: "1:562242912111:web:50ab0447caee294ff6b29a"
};

// Inicialización
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Funciones de ayuda
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date()
    }, { merge: true });

    return user;
  } catch (error) {
    console.error("Error en Login:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);