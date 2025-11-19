import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Redireciona automaticamente para "login"
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 🔐 Login
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },

  // 🔑 Esqueci minha senha
  {
    path: 'esquecisenha',
    loadComponent: () =>
      import('./pages/esquecisenha/esqueci.senha.page').then((m) => m.EsqueciSenhaPage),
  },

  // 🧍 Cadastro
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/cadastro/cadastro.page').then((m) => m.CadastroPage),
  },

  // 🍰 Menu principal (acessível apenas logado)
  {
    path: 'menu',
    loadComponent: () =>
      import('./pages/menu/menu.page').then((m) => m.MenuPage),
    canActivate: [authGuard],
  },

  // 🛒 Carrinho (acessível apenas logado)
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./pages/carrinho/carrinho.page').then((m) => m.CarrinhoPage),
    canActivate: [authGuard],
  },

  // 👤 Perfil (acessível apenas logado)
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
    canActivate: [authGuard],
  },

  // 🚨 Rota curinga — caso o usuário tente acessar uma página inexistente
  {
    path: '**',
    redirectTo: 'menu',
    pathMatch: 'full'
  }
];