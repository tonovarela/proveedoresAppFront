import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { ComunicadoService } from 'src/app/services/comunicado.service';

@Component({
  selector: 'app-comunicados-proveedor',
  templateUrl: './comunicados-proveedor.component.html',
  styleUrls: ['./comunicados-proveedor.component.css']
})
export class ComunicadosProveedorComponent implements OnInit {

  constructor(private comunicadoService:ComunicadoService,
              private usuarioService:UsuarioService
    ) { }

  ngOnInit(): void {
     const proveedor = this.usuarioService.usuario.Proveedor;
     this.comunicadoService.marcarVistos(proveedor).subscribe();
  }

}
