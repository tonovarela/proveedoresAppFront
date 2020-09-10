import { UiService } from './../../services/ui.service';
import { Router } from '@angular/router';
import { ComunicadoService } from './../../services/comunicado.service';
import { Comunicado } from './../../models/comunicado';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, RichTextEditorComponent, QuickToolbarService, TableService } from '@syncfusion/ej2-angular-richtexteditor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-comunicados',
    templateUrl: './comunicados.component.html',
    providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, TableService],
    styleUrls: ['./comunicados.component.css']
})
export class ComunicadosComponent implements OnInit {

    comunicados: Comunicado[] = [];
    comunicado:Comunicado={};
    cargandoDetalleComunicado=false;

    @ViewChild('detalleComunicado') detalleComunicado: any;
    constructor(private router: Router,
        private _modalService: NgbModal,
        private _comunicadoService: ComunicadoService,
        private _uiService: UiService
    ) { }

    ngOnInit(): void {
        this.cargarComunicados();
    }

    cargarComunicados() {
        this._comunicadoService.listar().subscribe(x => {

            this.comunicados = x;
        });
    }

    verDetalle(comunicado: Comunicado) {
        this.cargandoDetalleComunicado=true;
        this._comunicadoService.detalle(comunicado.id_comunicado).subscribe(x => {
            comunicado.mensaje = x["mensaje"];
            this.comunicado= comunicado;
            this.cargandoDetalleComunicado=false;                   
        });
    }


    public agregar() {
        this.router.navigateByUrl(`/comunicados/agregar`);
    }

    public editarComunicado(comunicado: Comunicado) {

        this.router.navigateByUrl(`/comunicados/editar/${comunicado.id_comunicado}`);
    }

    public async borrarComunicado(comunicado: Comunicado) {

        let confirmacion = await this._uiService.mostrarAlertaConfirmacion("Borrar comunicado", "Confirma borrar este comunicado", "Si, borrar comunicado", "No");
        if (confirmacion.isConfirmed == false) {
            return;
        }
        this._comunicadoService.borrar(comunicado).subscribe(x => {
            this._uiService.mostrarAlertaSuccess("Listo", "Este comunicado ha sido borrado");
            this.cargarComunicados();
        });

    }

    public cambiarDisponibilidad(comunicado: Comunicado, valor: boolean) {
        this._comunicadoService.asignacion = comunicado;
        if (!comunicado.general && !valor) {
            this.router.navigateByUrl(`comunicados/disponibilidad/${comunicado.id_comunicado}`)
        }
        if (comunicado.general == valor) {
            return;
        }
        comunicado.general = valor;
        this._comunicadoService.cambiarDisponibilidad(comunicado).subscribe(() => { });
        if (!valor)
            this.router.navigateByUrl(`comunicados/disponibilidad/${comunicado.id_comunicado}`)


    }

    public mostrarModalDetalle(comunicado:Comunicado){
        this.verDetalle(comunicado);
        this._modalService.open(this.detalleComunicado, { size: 'lg' });
    }

    public async cambiarVisible(comunicado: Comunicado) {
        if (comunicado.visible) {
            
            this.mostrarModalDetalle(comunicado);
            return;
        }

        const respuesta = await this._uiService.mostrarAlertaConfirmacion("Confirmación", "Al publicar este comunicado no se podra editar en un futuro, Estas seguro de realizar esta acción?. ", "Si ", "No")
        if (!respuesta["isConfirmed"]) {
            return;
        }
        comunicado.visible = !comunicado.visible;
        this._comunicadoService.cambiarVisible(comunicado).subscribe(() => { });
    }






}
