import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('admin/123 obtiene rol admin', () => {
    expect(service.login('admin', '123')).toBe(true);
    expect(service.currentUser()?.role).toBe('admin');
  });

  it('operador/123 obtiene rol user', () => {
    expect(service.login('operador', '123')).toBe(true);
    expect(service.currentUser()?.role).toBe('user');
  });

  it('credenciales incorrectas fallan', () => {
    expect(service.login('admin', 'xxx')).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });
});
