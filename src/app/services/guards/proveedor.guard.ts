import { UsuarioService } from 'src/app/services/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorGuard implements CanActivate {

  constructor(public  usuarioService:UsuarioService) {
    

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return !this.usuarioService.esAdmin();
  }
  
}
