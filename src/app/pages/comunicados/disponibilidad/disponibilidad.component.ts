import { UiService } from './../../../services/ui.service';
import { ProveedorAsignado } from './../../../models/proveedorAsignado';
import { ComunicadoService } from './../../../services/comunicado.service';

import { catchError } from 'rxjs/operators';

import { Component, OnInit, ViewChild, OnDestroy, TemplateRef, ElementRef, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { EditSettingsModel, PageSettingsModel, FilterSettingsModel, Grid, GridComponent } from '@syncfusion/ej2-angular-grids';
import { FechaDictionary } from 'src/app/utils/dates';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of } from 'rxjs';


@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css']
})
export class DisponibilidadComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('detalle') detalle: any;
  gridInstance: Grid;  
  cargando: boolean = false;
  editando: boolean = false;
  editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
  pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 10 };
  filterSettings: FilterSettingsModel = { type: "CheckBox", };
  filterMenu: FilterSettingsModel = { type: "Menu", mode: "Immediate" };
  formatoptions = { type: 'dateTime', format: 'dd/MM/y' };
  selectOptions: any = {
    //persistSelection: true, type: "Multiple",
    //checkboxOnly: true 
  };
  id_comunicado:string;
  proveedorAsignados: ProveedorAsignado[] = [];
  
  //_referencia:string="";

  public fechaEmisionFilter: any;
  public fechaVencimientoFilter: any;
  public contenedorFiltroFechaEmision: any = null;
  public contenedorFiltroFechaVencimiento: any = null;
  public fecha: FechaDictionary = new FechaDictionary();

  constructor(
    private activeRoute: ActivatedRoute,
     private router:Router,    
    private uiService:UiService,    
    public _comunicadoService: ComunicadoService
  ) {
  }



  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      if (params["id"] == undefined) {
        this.router.navigateByUrl("/");
      }
      this.id_comunicado=params["id"];
    });
    
    this.cargando = true;
    this._comunicadoService.obtenerDisponibilidadProveedor(this.id_comunicado).subscribe(x=>{
      this.cargando=false
        this.proveedorAsignados= x
    });
    
  }

  cambiarAsignacion(proveedorAsignado:ProveedorAsignado){
      proveedorAsignado.asignado=!proveedorAsignado.asignado;
      this.editando=true;
      this._comunicadoService.cambiarDisponibilidadProveedor(proveedorAsignado,this.id_comunicado)
      .pipe(
        catchError(x=>{
          this.uiService.mostrarAlertaError("Opps!",x["error"]["message"]);
          this.editando=false;            
          return of(`Bad Promise`);
          
        })
      )
      .subscribe(x=>{
       this.proveedorAsignados=this.proveedorAsignados.map(x=>{      
         if (x.proveedor!=proveedorAsignado.proveedor){
           return x
         }else{
           return proveedorAsignado;  
         }         
        });       
        this.editando=false;                             
      });
      
      
  }



  


  created(e) {

  }
  ngOnDestroy(): void {

    
  }



  
  actionComplete(args) {

  }

  


}

