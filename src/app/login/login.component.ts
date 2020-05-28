import { UiService } from './../services/ui.service';
import { UsuarioService } from './../services/usuario.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ResponseLogin } from '../models/proveedor';
declare function iniciar_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   usuario = { usuario: "1065", password: "CIG9811174W2" };
  constructor(private _usuarioService: UsuarioService,
              private _uiService: UiService,
              public router: Router              
              ) { }

  ngOnInit(): void {
    iniciar_plugins();
    if (this._usuarioService.estaLogueado()){
      this.router.navigate(['/pendientes-cobro']);
    }
  }

  ingresar(form: NgForm) {
    const usuario = { usuario:form.value.usuario, password: form.value.password };
    this._usuarioService.login(usuario).subscribe((resp: ResponseLogin) => {
      if (resp.validacion == false) {
        //console.log("Login incorrecto");
        this._uiService.mostrarAlertaError("Acceso","Login incorrecto");
              
      } else {
        //console.log("Login correcto");
        this.router.navigate(['/pendientes-cobro']);
      }

    });

  }
}
