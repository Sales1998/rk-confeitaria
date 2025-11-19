import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Firebase Imports
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, setPersistence, indexedDBLocalPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// Firebase Config
import { firebaseConfig } from './firebase.config';

// ✅ Função utilitária para login
export async function loginTest(email: string, password: string) {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login Success:', userCredential.user.uid);
  } catch (err) {
    console.error('Login Failed:', err);
  }
}

// ✅ Função utilitária para cadastro
export async function registerTest(email: string, password: string) {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Registration Success:', userCredential.user.uid);
  } catch (err) {
    console.error('Registration Failed:', err);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Firebase App
    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    // Firebase Auth com persistência mobile
    provideAuth(() => {
      const auth = getAuth();
      setPersistence(auth, indexedDBLocalPersistence); // persistência mobile
      return auth;
    }),

    // Firestore
    provideFirestore(() => getFirestore()),
  ],
});
