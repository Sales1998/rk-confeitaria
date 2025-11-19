import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  User
} from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser!: User | null;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
  ) {}

  // ✅ Login
  async login(email: string, senha: string) {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, senha);
      this.currentUser = result.user;

      // 🔐 Marca como logado para o guard funcionar no Android também
      localStorage.setItem('loggedIn', 'true');

      return { success: true };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { success: false, message: error.code };
    }
  }

  // ✅ Cadastro
  async cadastro(email: string, senha: string, nome?: string, telefone?: string) {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, senha);
      this.currentUser = cred.user;

      const userRef = doc(this.firestore, `users/${cred.user.uid}`);
      await setDoc(userRef, {
        nome: nome ?? '',
        telefone: telefone ?? '',
        email,
        createdAt: new Date()
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erro detalhado ao cadastrar:', error);
      return { success: false, message: error.code };
    }
  }

  recuperarSenha(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  alterarSenha(novaSenha: string) {
    if (!this.auth.currentUser) return Promise.reject('Usuário não autenticado');
    return updatePassword(this.auth.currentUser, novaSenha);
  }

  getUsuarioLogado() {
    return this.auth.currentUser;
  }

  // 🔓 Novo: checar flag simples de login
  isLogadoLocal() {
    return localStorage.getItem('loggedIn') === 'true';
  }

  async logout() {
    await this.auth.signOut();
    this.currentUser = null;
    localStorage.removeItem('loggedIn');
  }
}
