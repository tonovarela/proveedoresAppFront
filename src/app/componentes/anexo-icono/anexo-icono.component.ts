import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-anexo-icono',
  templateUrl: './anexo-icono.component.html',
  styleUrls: ['./anexo-icono.component.css']
})
export class AnexoIconoComponent implements OnInit {

  constructor() { }

  @Input('tipo') tipo:string;
  icono: string;
  color: string;

  ngOnInit(): void {    
    this.icono="mdi mdi-file";
    this.color="icon-file file";    
    this.obtenerIcono();
  }

  obtenerIcono(){
     if (this.tipo.includes("pdf")){
       this.icono="mdi mdi-file-pdf";
       this.color="icon-file pdf";
     }
     if (this.tipo.includes("image")){
      this.icono="mdi mdi-file-image";
      this.color="icon-file image";
    }
    if (this.tipo.includes("word")){
      this.icono="mdi mdi-file-word";
      this.color="icon-file word";
    }
    if (this.tipo.includes("spreadsheet")){
      this.icono="mdi mdi-file-excel";
      this.color="icon-file excel";
    }

  }

}
