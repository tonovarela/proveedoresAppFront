import { ResponseLogin, Usuario } from './../models/proveedor';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url: string = environment.URL_SERVICIOS;
  usuario: Usuario = {};
  constructor(
    public http: HttpClient,
    public router: Router
  ) {
    this.cargarStorage();
  }

  login(usuario: any) {
    const url = `${this.url}/cliente/login`;
    return this.http.post<ResponseLogin>(url, usuario).pipe(
      map((resp) => {
   //     console.log(resp.data);
        if (resp.validacion == true) {
          this.guardarStorage(resp.data[0]);          
        }
        return resp;
      })
    );
    // return this.http.post(url, usuario).pipe(
    //   map((resp: any) => {        
    //     if (resp.ok==false){
    //       //this.mostrarMensajeError("----",resp.mensaje);
    //       return false;
    //     }
    //    // this.guardarStorage("1", "fdsffs", usuario, this.menu);
    //     return true;
    //   }), catchError ( err => {
    //     console.log(err);
    //     //this.mostrarMensajeError('Error en el login', err.error.mensaje );
    //     return throwError(err);
    //   } )
    // );
  }

  estaLogueado() {
    return this.usuario != null;
  }
  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.usuario = null;
    }
  }
  guardarStorage(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuario = usuario;
  }
  logout() {
    this.usuario =null;
    localStorage.removeItem("usuario");
    this.router.navigate(["/login"]);
  }

}
