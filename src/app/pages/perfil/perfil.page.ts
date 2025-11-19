import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonIcon,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  imports: [IonContent, IonFooter, IonIcon, CommonModule, FormsModule],
})
export class PerfilPage implements OnInit {

  emailUsuario: string | null = null;
  nomeUsuario: string = '';
  telefoneUsuario: string = '';
  editando = false;

  pedidos: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestore: Firestore,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    const user = this.authService.getUsuarioLogado();
    this.emailUsuario = user?.email ?? 'Não informado';

    if (user) {
      const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
      if (userDoc.exists()) {
        const data = userDoc.data();
        this.nomeUsuario = data['nome'] || '';
        this.telefoneUsuario = data['telefone'] || '';
      }
    }

    this.pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  }

  habilitarEdicao() {
    this.editando = true;
  }

  async salvarAlteracoes() {
    const user = this.authService.getUsuarioLogado();
    if (!user) return this.showToast('Usuário não autenticado', 'danger');

    const loading = await this.loadingController.create({
      message: 'Salvando alterações...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const ref = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(ref, {
        nome: this.nomeUsuario,
        telefone: this.telefoneUsuario
      });

      await loading.dismiss();
      this.showToast('Informações atualizadas com sucesso ✅', 'success');
      this.editando = false;
    } catch (error) {
      await loading.dismiss();
      this.showToast('Erro ao atualizar informações', 'danger');
    }
  }

  alterarSenha() {
    this.router.navigate(['/esquecisenha']);
  }

  logout() {
    this.authService.logout();
  }

  async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color
    });
    toast.present();
  }

  // ✅ Nova função: garante navegação funcional da barra inferior
  navegar(caminho: string) {
    this.router.navigate([caminho]);
  }
}
