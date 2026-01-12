import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

// Configuración de Firebase
// Las variables de entorno tienen prioridad, pero si no están definidas, usa estos valores por defecto
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBd-T0eXiAohVj2dvInIKnghW_PvR2Y0xE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "cashflow-casa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "cashflow-casa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "cashflow-casa.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "195730493308",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:195730493308:web:d222728b8a9a77421b9ef9"
};

// Inicializar Firebase solo en el cliente
let app: any = null;
let db: any = null;

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
  }
}

export { db, doc, setDoc, getDoc, onSnapshot };

