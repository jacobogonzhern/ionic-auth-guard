import { Injectable, signal, computed } from '@angular/core';

export interface UserSession {
  username: string;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Clave usada en la Web Storage API
  private readonly STORAGE_KEY = 'DAM2_AUTH_SESSION';

  // Usuarios permitidos
  private readonly USERS: { username: string; password: string; role: 'admin' | 'user' }[] = [
    { username: 'admin',    password: '123', role: 'admin' },
    { username: 'operador', password: '123', role: 'user'  }
  ];

  // Signal reactivo con el estado en memoria (se inicializa desde sessionStorage)
  private _currentUser = signal<UserSession | null>(this.readSessionFromStorage());

  // Selectores de solo lectura expuestos a la app
  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => this._currentUser()?.isAuthenticated ?? false);

  /**
   * Valida credenciales: admin/123 (admin) y operador/123 (user)
   */
  public login(user: string, pass: string): boolean {
    const found = this.USERS.find(u => u.username === user && u.password === pass);
    if (!found) {
      return false;
    }

    const sessionData: UserSession = {
      username: found.username,
      role: found.role,
      isAuthenticated: true
    };

    // 1. Guardar en memoria reactiva
    this._currentUser.set(sessionData);
    // 2. Persistir en el navegador
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    return true;
  }

  /**
   * Destruye la sesión en memoria y en sessionStorage
   */
  public logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this._currentUser.set(null);
  }

  /**
   * Devuelve la ruta "home" según el rol del usuario
   */
  public homeRoute(): string {
    return this._currentUser()?.role === 'admin' ? '/admin' : '/user-dashboard';
  }

  /**
   * Recupera la sesión al recargar la página
   */
  private readSessionFromStorage(): UserSession | null {
    const rawData = sessionStorage.getItem(this.STORAGE_KEY);
    if (!rawData) {
      return null;
    }
    try {
      return JSON.parse(rawData) as UserSession;
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
}
