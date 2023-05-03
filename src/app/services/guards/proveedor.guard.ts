import { UsuarioService } from 'src/app/services/usuario.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProveedorGuard implements CanActivate {

  constructor(public usuarioService: UsuarioService,
              private router: Router) {


  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    const { cambiarContrasenia } = this.usuarioService.usuario;
    if (cambiarContrasenia == "1") {      
      this.router.navigate(["/cambiar-password"]);
      return false
    }


    return !this.usuarioService.esAdmin();
  }

}
