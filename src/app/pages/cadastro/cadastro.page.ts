import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule
  ],
})
export class CadastroPage {

  nome: string = '';
  email: string = '';
  telefone: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  mostrarSenha: boolean = false;
  mostrarConfirmar: boolean = false;
  carregando: boolean = false;

  sucessoCadastro: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async cadastrar() {
    const nome = this.nome.trim();
    const email = this.email.trim();
    const telefone = this.telefone.trim();
    const senha = this.senha;
    const confirmarSenha = this.confirmarSenha;

    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
      await this.showToast('Preencha todos os campos corretamente.', 'warning');
      return;
    }

    if (senha !== confirmarSenha) {
      await this.showToast('As senhas não coincidem.', 'danger');
      return;
    }

    this.carregando = true;

    try {
      // 👉 Se o Firebase não estourar erro, consideramos sucesso.
      await this.authService.cadastro(
        email,
        senha,
        nome,
        telefone
      );

      this.sucessoCadastro = true;
      await this.showToast('Conta criada com sucesso! Faça login.', 'success');

      // 👉 FORÇAR REDIRECIONAMENTO PARA LOGIN
      this.router.navigateByUrl('/login');
      // caso o de cima não funcione, descomente o de baixo:
      // this.router.navigate(['login']);

    } catch (error: any) {
      await this.showToast('Erro ao criar conta. Tente novamente.', 'danger');
      console.error('Erro ao cadastrar:', error);
    } finally {
      this.carregando = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async showToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}
