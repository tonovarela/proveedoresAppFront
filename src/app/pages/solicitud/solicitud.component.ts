import { Component, OnInit, ViewChild } from '@angular/core';
import { Grid, EditSettingsModel, PageSettingsModel, FilterSettingsModel } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent implements OnInit {
 @ViewChild('grid') grid: Grid;
 solicitudes = [];
 editSettings: EditSettingsModel = { allowDeleting: false, allowEditing: false };
   pageSettings: PageSettingsModel = { pageSizes: true, pageCount: 10 };
   filterSettings: FilterSettingsModel = { type: "CheckBox" };
   filterMenu: FilterSettingsModel = { type: "Menu" };
   formatoptions = { type: 'dateTime', format: 'dd/MM/yyyy' };
   selectOptions: any = {
     //persistSelection: true, type: "Multiple",
     //checkboxOnly: true 
   };
  constructor() { }

  ngOnInit(): void {
  }


  resizeGrid() {
    if (this.grid === undefined) {
      return;
    }
    if (window.innerHeight >= 655) {
      this.grid.height = window.innerHeight * 0.75;
    }
    if (window.innerHeight <= 654) {
      this.grid.height = 250;
    }

  }

  dataBound() {
    this.resizeGrid();

  }

  onresize(e) {
    this.resizeGrid();
  }

}
