import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // 🔐 Usa flag simples de login, que funciona tanto no navegador quanto no app
  const logado = auth.isLogadoLocal();

  if (!logado) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
