import { ComunicadoService } from './../../../services/comunicado.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService,ResizeService, RichTextEditorComponent, QuickToolbarService, TableService } from '@syncfusion/ej2-angular-richtexteditor';

import { Comunicado } from 'src/app/models/comunicado';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css'],
  providers: [ToolbarService, LinkService,ResizeService ,ImageService, HtmlEditorService, QuickToolbarService, TableService],
})
export class DetalleComponent implements OnInit {

  comunicado: Comunicado = { mensaje: "" ,titulo:""};
  edicion: boolean;
  cargando:boolean =false;
  public insertImageSettings = {
    //display: 'inline'
  };

  

  public tools: object = {
    type: 'Expand',
    items: ['Bold', 'Italic', 'Underline',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateLink', 'Image', '|', 'ClearFormat', 'CreateTable',
      'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
  };

  constructor(    
    private activeRoute: ActivatedRoute,
    private _comunicadoService: ComunicadoService,
    private router:Router
  ) { }
  ngOnInit(): void {

    this.activeRoute.params.subscribe((params: Params) => {
      if (params["id"] == undefined) {
        this.comunicado = { mensaje: "", titulo:"" };
        this.edicion = false;
      } else {
        this.edicion = true;
        this.cargando=true;
         this._comunicadoService.detalle(params["id"]).subscribe(x=>{
           this.cargando=false;
           if (x!=undefined){
             this.comunicado =x;
           }else{
            this.router.navigateByUrl("/comunicados");
           }
         });                
      }

    });
  }

  rteCreated(): void {

    this.rteObj.element.focus();
    //this.rteObj.value = '';
    this.rteObj.insertImageSettings.saveFormat = 'Base64';
  }

  @ViewChild('blogRTE')
  public rteObj: RichTextEditorComponent;

  public cancelar = (): void => {    
    this.router.navigateByUrl("/comunicados");
  }



  public agregar = (): void => {

    const answerElement: HTMLElement = this.rteObj.contentModule.getEditPanel() as HTMLElement;
    const comment: string = answerElement.innerHTML;
    if (comment !== null && comment.trim() !== '' && (answerElement.innerText.trim() !== '' ||
      !isNOU(answerElement.querySelector('img')) || !isNOU(answerElement.querySelector('table')))) {
       //this.comunicado.id= `${Math.floor(Math.random() * (50000 - 10)) + 10}_${Math.floor(Math.random() * (50000 - 10)) + 10}`;
       this.comunicado.mensaje=comment;       
       this.comunicado.visible=false;
       this.comunicado.general=true;
       this.comunicado.fecha_registro=new Date();
      this._comunicadoService.agregar(this.comunicado).subscribe(x=>{
        this.router.navigateByUrl("/comunicados");
      });
      //this.rteObj.refresh();      
    }
  }


  public actualizar = (): void => {
    const answerElement: HTMLElement = this.rteObj.contentModule.getEditPanel() as HTMLElement;
    const comment: string = answerElement.innerHTML;
    if (comment !== null && comment.trim() !== '' && (answerElement.innerText.trim() !== '' ||
      !isNOU(answerElement.querySelector('img')) || !isNOU(answerElement.querySelector('table')))) {
        this.cargando=true;
      this.comunicado.mensaje = comment;
      this._comunicadoService.actualizar(this.comunicado).subscribe(x=>{
        this.cargando=false;
        this.router.navigateByUrl("/comunicados");
      });      
      
      
    }
  }




}
