import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonFooter,
  ToastController
} from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonFooter,
    CommonModule,
    FormsModule
  ],
})
export class MenuPage implements OnInit {

  emailUsuario: string | null = null;
  searchTerm: string = '';
  rotaAtiva: string = '';

  produtos = [
    { nome: 'Torta de Limão', preco: 19.90, imagem: 'assets/img/tortadelimao.jpeg' },
    { nome: 'Bombom de Uva', preco: 19.90, imagem: 'assets/img/bombomdeuva.jpeg' },
    { nome: 'Cookies de Nutella', preco: 18.90, imagem: 'assets/img/cookiesdenutella.jpeg' },
    { nome: 'Copo de Morangos com Nutella', preco: 16.90, imagem: 'assets/img/coposdemorangocomnutella.jpeg' },
    { nome: 'Copo da Felicidade Banoffe', preco: 14.90, imagem: 'assets/img/copodafelicidadebanoffe.jpeg' }
  ];

  produtosFiltrados = [...this.produtos];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    // 🔁 Detecta rota ativa
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rotaAtiva = event.url;
      }
    });
  }

  ngOnInit() {
    const user = this.authService.getUsuarioLogado();
    this.emailUsuario = user?.email ?? null;
  }

  // ✅ Agora faz logout E navega para login
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

  filtrarProdutos() {
    const termo = this.searchTerm.toLowerCase();
    this.produtosFiltrados = this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(termo)
    );
  }

  async addToCart(produto: any) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    const toast = await this.toastController.create({
      message: `${produto.nome} foi adicionado ao carrinho 🛒`,
      buttons: [
        {
          text: 'Ver Carrinho',
          handler: () => this.router.navigate(['/carrinho'])
        }
      ],
      duration: 2500,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }
}
