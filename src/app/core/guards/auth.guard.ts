import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Sesión válida → deja pasar
  if (authService.isAuthenticated()) {
    return true;
  }

  // Sin sesión → redirige a login guardando la URL que intentó visitar
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
