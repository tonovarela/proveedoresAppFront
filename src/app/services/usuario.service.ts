import { ResponseOpinionCumplimiento } from './../models/opinion_cumplimiento';
import { SettingsService } from './settings.service';
import { ResponseLogin, Usuario } from './../models/proveedor';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url: string = environment.URL_SERVICIOS;
  filtroGeneral = new EventEmitter<any>();
  filtroAplicar: any = null;
  usuario: Usuario = {};
  constructor(
    public http: HttpClient,
    public router: Router,
    public settingService: SettingsService
  ) {
    this.cargarStorage();

  }




  loginUsuario(usuario: any) {
    const url = `${this.url}/usuario/login`;
    return this.http.post<ResponseLogin>(url, usuario).pipe(
      map((resp) => {

        if (resp.validacion == true) {
          this.usuario = resp.data[0];
          this.guardarStorage(resp.data[0]);
        }
        return resp;
      })
    );
  }


  login(usuario: any) {
    const url = `${this.url}/cliente/login`;
    return this.http.post<ResponseLogin>(url, usuario).pipe(
      map((resp) => {        
        if (resp.validacion == true) {
          this.usuario = resp.data[0];
          this.guardarStorage(resp.data[0]);
        }
        return resp;
      })
    );
  }

  autorizacionCR() {
    const url = `${this.url}/usuario/autorizacioncr/${this.usuario.Proveedor}`;
    //this.usuario.PuedeGenerarContraRecibo=false;
    return this.http.get(url).pipe(
      map(resp=>{
          if (resp["validacion"]==true){
            const autorizacion = resp["autorizacion"][0];            
            this.usuario.PuedeGenerarContraRecibo =autorizacion["autorizacionCR"]=="Si"?true:false;
          }
      })
    );

  }


  obtenerHistorialOpinionCumplimiento(){
    const url = `${this.url}/usuario/opinioncumplimiento/${this.usuario.Proveedor}`;
    return this.http.get<ResponseOpinionCumplimiento>(url);
  } 

  esAdmin() {
    return this.usuario.idRol == "1";
  }

  estaLogueado() {
    return this.usuario != null;
  }
  cargarStorage() {
    if (localStorage.getItem('usuario')) {
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.settingService.cargarAjustes();
    } else {
      this.usuario = null;
    }
  }
  guardarStorage(usuario: Usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));

  }
  logout() {
    this.usuario = null;
    localStorage.removeItem("usuario");
    this.router.navigate(["/login"]);
  }

}
