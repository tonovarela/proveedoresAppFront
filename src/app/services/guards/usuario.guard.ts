import { UsuarioService } from './../usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  
  constructor(public _usuarioService: UsuarioService,public _router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (this._usuarioService.estaLogueado()){
        return true;
      }else{
        //console.log("bloqueado por el guard");
        this._router.navigate(['/login']);
        return false;
      }
    
  }
  
}
