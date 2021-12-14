
import { mergeMap, tap, map } from 'rxjs/operators';
import { UiService } from './../services/ui.service';
import { UsuarioService } from './../services/usuario.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ResponseLogin } from '../models/proveedor';
import { of ,forkJoin} from 'rxjs';
declare function iniciar_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  fondo="";
  usuario = { usuario: "", password: "" };
  constructor(private _usuarioService: UsuarioService,
    private _uiService: UiService,
    public router: Router
  ) { }


  get esMesNavidenio(){
    const mes= (new Date().getMonth() + 1);
    return mes ==12;    
  }

  ngOnInit(): void {
    

    



    let fondos=["assets/images/background/login-register3.jpg",
                "assets/images/background/login-register2.jpg",
                "assets/images/background/login-register4.jpg",
                "assets/images/background/login-register5.jpg",
                "assets/images/background/login-register6.jpg",
                "assets/images/background/material-bg.jpg",                
              ];              
    const random=Math.floor(Math.random() * ((fondos.length-1) - 0 + 1) + 0);
    this.fondo=`url(${fondos[random]})`;    
    iniciar_plugins();
    if (this._usuarioService.estaLogueado()) {
      if (this._usuarioService.esAdmin()){
        this.router.navigate(['/comunicados']);
        return;
      }
      this.router.navigate(['/pendientes-cobro']);
    }
  }



  irAvisoPrivacidad() {
    window.open('https://www.litoprocess.com/aviso-de-privacidad/', '_blank');
  }


  cargarSesion(){    
    if (this._usuarioService.esAdmin()) {
      this.router.navigate(['/comunicados']);
    } else {
      this.router.navigate(['/']);
    }
  }

  ingresar(form: NgForm) {
    const usuario = { usuario: form.value.usuario, password: form.value.password };    
    const login$= forkJoin([this._usuarioService.login(usuario) , //Proveedor
                            this._usuarioService.loginUsuario(usuario)])  //Usuario Litoapps
                            .pipe(
                              map(x=> {
                                const responseProveedores=x[0];
                                const responseUsuarios=x[1];
                                if (responseProveedores["validacion"]==false 
                                      && responseUsuarios["validacion"]==false ){
                                  return responseProveedores;
                                }        
                              return responseProveedores["validacion"]==true ? responseProveedores:responseUsuarios;         
                              })
                            );
     

     login$.subscribe((resp:ResponseLogin)=>{    
        if (resp.validacion == false) {
        this._uiService.mostrarAlertaError("Acceso", "Login incorrecto");
      } else {
       this.cargarSesion();
      }
     });
   
   
   
    // this._usuarioService.login(usuario).subscribe((resp: ResponseLogin) => {
    //   if (resp.validacion == false) {
    //     this._uiService.mostrarAlertaError("Acceso", "Login incorrecto");

    //   } else {
    //    this.cargarSesion();

    //   }

    // });

  }
}
