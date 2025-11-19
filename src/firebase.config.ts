// src/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDGpMoSWQx7GgSpdiRsYwmz3rGGAJ5cEu0",
  authDomain: "rk-confeitaria-cc2c5.firebaseapp.com",
  projectId: "rk-confeitaria-cc2c5",
  storageBucket: "rk-confeitaria-cc2c5.appspot.com",
  messagingSenderId: "444195340173",
  appId: "1:444195340173:web:29d410326d50c057dd47c4"
};

// Inicializa o app
const app = initializeApp(firebaseConfig);

// Exporta o auth para uso no app
export const auth = getAuth(app);
