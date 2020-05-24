import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cambiarImagen() {
    //this._usuarioService.cambiarImagen(this.imagenSubir);
  }
  guardar(usuario: any) {
    // this.usuario.nombre = usuario.nombre;
    // if (!this.usuario.google) {
    //   this.usuario.email = usuario.email;
    // }

    //this._usuarioService.actualizarUsuario(this.usuario).subscribe();
  }

}
