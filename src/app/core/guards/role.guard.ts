import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Factoría de guards: recibe el rol permitido y devuelve una guard
 * configurada para ese rol.
 */
export const roleGuard = (allowedRole: string): CanActivateFn => {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    // Sin sesión → login
    if (!user?.isAuthenticated) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // Rol correcto → deja pasar
    if (user.role === allowedRole) {
      return true;
    }

    // Rol incorrecto → a su panel (ej: operador en /admin → /user-dashboard)
    return router.createUrlTree([authService.homeRoute()]);
  };
};
