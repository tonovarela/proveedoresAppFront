import { Component, OnInit, ViewChild } from '@angular/core';
import { EditSettingsModel, FilterSettingsModel, Grid, GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Subscription } from 'rxjs';
import { Documento } from 'src/app/models/responseAnexo';
import { AnexoService } from 'src/app/services/anexo.service';

@Component({
  selector: 'app-docanexos',
  templateUrl: './docanexos.component.html',
  styleUrls: ['./docanexos.component.css']
})
export class DocanexosComponent implements OnInit {
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
  anexos:Documento[]=[];

  constructor(private anexoService: AnexoService) { }

  ngOnInit(): void {
    this.anexoService.listar().subscribe(response=>{
      this.anexos=response.documentos
    });
  }

  created(e) {
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
