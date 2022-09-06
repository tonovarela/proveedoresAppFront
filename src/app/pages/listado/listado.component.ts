import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GridComponent, Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {

  @ViewChild('grid') grid: GridComponent;

 
  gridInstance: Grid;
  subscription: Subscription;
  cargando: boolean = false;
  editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
  pageSettings: PageSettingsModel = { pageSizes: true, };
  filterSettings: FilterSettingsModel = { type: "CheckBox", };
  filterMenu: FilterSettingsModel = { type: "Menu", mode: "Immediate" };
  formatoptions = { type: 'dateTime', format: 'dd/MM/y' };
  selectOptions: any = {    
  };
  proveedores:any[] =[];
  constructor(private proveedorService:ProveedorService, private router:Router) { }

  ngOnInit(): void {

   this.cargarListadoProveedores();
  }


  cargarListadoProveedores(){
    this.proveedorService.listado().subscribe(response=>{
       this.proveedores= response['proveedores'];
    });
  }

  created(e) {
  }


  IrAnexo(proveedor){
    const { RFC,  Proveedor,Nombre}= proveedor;
     let usuario:Usuario = { RFC:RFC.trim(),Proveedor:Proveedor.trim(),Nombre:Nombre.trim()};
     this.proveedorService.usuario= usuario;
      this.router.navigateByUrl("/perfil-proveedor");          
  }

  resizeGrid() {
    if (this.grid === undefined) {
      return;
    }
    if (window.innerHeight >= 655) {
      this.grid.height = window.innerHeight * 0.60;
    }
    if (window.innerHeight <= 654) {
      this.grid.height = 250;
    }

  }
  dataBound() {
    this.resizeGrid();

  }

}
