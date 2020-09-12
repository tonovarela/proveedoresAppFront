import { Comunicado } from 'src/app/models/comunicado';
import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { ComunicadoService } from 'src/app/services/comunicado.service';

@Component({
  selector: 'app-comunicados-proveedor',
  templateUrl: './comunicados-proveedor.component.html',
  styleUrls: ['./comunicados-proveedor.component.css']
})
export class ComunicadosProveedorComponent implements OnInit {

   comunicados:Comunicado[]=[];
   cargando :boolean =false;
  constructor(private comunicadoService:ComunicadoService,
              private usuarioService:UsuarioService
    ) { }

  ngOnInit(): void {
    this.cargando=true;
    const proveedor = this.usuarioService.usuario.Proveedor;
    this.comunicadoService.porProveedor(proveedor).subscribe(data=>{
      this.comunicados= data;
      this.cargando=false;
    });     
     this.comunicadoService.marcarVistos(proveedor).subscribe();
  }

}
