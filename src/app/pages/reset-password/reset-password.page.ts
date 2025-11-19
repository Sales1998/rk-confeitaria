import { Component } from '@angular/core';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  templateUrl: './recuperar-senha.page.html',
  styleUrls: ['./recuperar-senha.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecuperarSenhaPage {

  novaSenha: string = '';
  confirmarSenha: string = '';
  mostrarSenha: boolean = false;
  mostrarConfirmarSenha: boolean = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  get senhaForte(): boolean {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]|:;"'<>,.?/~`]).{8,}$/.test(this.novaSenha);
  }

  async alterarSenha() {
    if (!this.novaSenha || !this.confirmarSenha) {
      return this.showToast("Preencha todos os campos!", "warning");
    }

    if (this.novaSenha !== this.confirmarSenha) {
      return this.showToast("As senhas não coincidem!", "danger");
    }

    if (!this.senhaForte) {
      return this.showToast(
        "Senha fraca! Deve ter 8+ caracteres, 1 maiúscula, 1 número e 1 símbolo!",
        "danger"
      );
    }

    const loading = await this.loadingController.create({
      message: 'Alterando senha...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.authService.alterarSenha(this.novaSenha);
      await loading.dismiss();
      this.showToast("Senha alterada com sucesso!", "success");
      this.router.navigate(['/login']);
    } catch (erro) {
      await loading.dismiss();
      this.showToast("Erro ao alterar senha!", "danger");
    }
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}