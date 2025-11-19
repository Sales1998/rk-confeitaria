import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
})
export class LoginPage {

  email: string = '';
  senha: string = '';
  mostrarSenha: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {

    // Mensagem simples caso falte algum dado
    if (!this.email || !this.senha) {
      this.showToast('Preencha e-mail e senha.', 'warning');
      return;
    }

    try {
      const result = await this.authService.login(this.email, this.senha);

      if (result && result.success) {

        // Mensagem de sucesso
        this.showToast('Login realizado com sucesso!', 'success');

        // Navega para o menu
        this.router.navigateByUrl('/menu', { replaceUrl: true });
      } else {

        const code = result?.message || 'auth/unknown';

        // Mapeia erros comuns do Firebase
        switch (code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
          case 'auth/invalid-login-credentials':
            this.showToast('E-mail ou senha incorretos.', 'danger');
            break;

          case 'auth/invalid-email':
            this.showToast('Formato de e-mail inválido.', 'warning');
            break;

          case 'auth/too-many-requests':
            this.showToast('Muitas tentativas. Tente novamente mais tarde.', 'warning');
            break;

          default:
            this.showToast('Erro ao fazer login: ' + code, 'danger');
            break;
        }
      }

    } catch (error: any) {
      this.showToast(
        'Erro inesperado ao fazer login: ' + (error?.message || ''),
        'danger'
      );
    }
  }

  async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
      cssClass: 'custom-toast'
    });
    toast.present();
  }
}
