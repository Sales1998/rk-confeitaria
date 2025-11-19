import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonFooter,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonIcon,
  ToastController
} from '@ionic/angular/standalone';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonFooter,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class CarrinhoPage implements OnInit {
  carrinho: any[] = [];
  total: number = 0;
  formaPagamento: string = 'pix';
  rotaAtiva: string = '';

  mostrarResumo: boolean = false;
  numeroPedido: string = '';

  // 🪪 Dados de cartão (apenas para teste)
  cartao = {
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  };

  // 💵 Troco (quando pagar na entrega)
  valorTroco: number | null = null;

  // 🏠 Endereço de entrega (fictício e simples)
  endereco = {
    rua: '',
    numero: '',
    bairro: '',
    complemento: ''
  };

  constructor(
    private router: Router,
    private toastController: ToastController
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.rotaAtiva = event.url;
      }
    });
  }

  ngOnInit() {
    this.carregarCarrinho();
  }

  carregarCarrinho() {
    this.carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

    // ✅ Garante que todo item tenha quantidade (padrão = 1)
    this.carrinho = this.carrinho.map(item => ({
      ...item,
      quantidade: item.quantidade && item.quantidade > 0 ? item.quantidade : 1
    }));

    this.calcularTotal();
  }

  calcularTotal() {
    // ✅ Agora considera quantidade
    this.total = this.carrinho.reduce((acc, item) => {
      const preco = item.preco || 0;
      const qtd = item.quantidade || 1;
      return acc + preco * qtd;
    }, 0);
  }

  // ✅ Aumentar quantidade de um item
  aumentarQuantidade(item: any) {
    if (!item.quantidade || item.quantidade < 1) {
      item.quantidade = 1;
    }
    item.quantidade++;
    this.salvarCarrinho();
    this.calcularTotal();
  }

  // ✅ Diminuir quantidade de um item (mínimo 1)
  diminuirQuantidade(item: any) {
    if (!item.quantidade || item.quantidade <= 1) {
      item.quantidade = 1;
      return;
    }
    item.quantidade--;
    this.salvarCarrinho();
    this.calcularTotal();
  }

  // ✅ Sempre que mudar quantidade, salva no localStorage
  private salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
  }

  removerItem(index: number) {
    this.carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
    this.calcularTotal();
  }

  navegar(rota: string) {
    this.router.navigate([rota]);
  }

  // 🔑 Copiar PIX fictício
  async copiarPix() {
    try {
      await navigator.clipboard.writeText('rkconfeitaria@gmail.com');
      const toast = await this.toastController.create({
        message: 'Chave PIX copiada!',
        duration: 1500,
        color: 'success',
        position: 'top'
      });
      await toast.present();
    } catch (e) {
      const toast = await this.toastController.create({
        message: 'Não foi possível copiar. Copie manualmente: rkconfeitaria@gmail.com',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      await toast.present();
    }
  }

  async finalizarCompra() {
    if (this.carrinho.length === 0) {
      const toast = await this.toastController.create({
        message: 'Seu carrinho está vazio!',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
      return;
    }

    // ✅ Verifica endereço antes de finalizar
    if (!this.endereco.rua || !this.endereco.numero) {
      const toast = await this.toastController.create({
        message: 'Preencha o endereço de entrega (rua e número).',
        duration: 2000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
      return;
    }

    this.numeroPedido = 'RK' + Math.floor(Math.random() * 90000 + 10000);
    this.mostrarResumo = true;

    // 🎊 Cria confetes animados
    for (let i = 0; i < 15; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      document.body.appendChild(confetti);

      // Remove após animação
      setTimeout(() => confetti.remove(), 3000);
    }

    localStorage.removeItem('carrinho');
    this.carrinho = [];
    this.total = 0;
  }

  voltarMenu() {
    this.mostrarResumo = false;
    this.router.navigate(['/menu']);
  }
}
