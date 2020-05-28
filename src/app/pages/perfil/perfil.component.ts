import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/proveedor';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
   usuario: Usuario ={};
  constructor(private _usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuario= this._usuarioService.usuario;    
  }



}
