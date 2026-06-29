import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Mensaje } from 'src/app/models';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements AfterViewInit, OnChanges {

  @Input() mensajes: Mensaje[] = [];
  @Input() titulo: string = 'Mensajes';
  @Input() textoVacio: string = 'No hay mensajes para mostrar';
  /** Usuario que escribe los mensajes. */
  @Input() usuario: string = '';
  /** Habilita o bloquea la captura/emisión de nuevos mensajes. */
  @Input() puedeCapturarMensajes: boolean = false;

  @Output() enviarMensaje = new EventEmitter<Mensaje>();

  @ViewChild('mensajesBody') mensajesBody: ElementRef<HTMLElement>;

  nuevoMensaje: string = '';

  ngAfterViewInit(): void {
    this.scrollAlFinal();
  }

  ngOnChanges(): void {
    this.scrollAlFinal();
  }

  trackByMensaje(index: number, mensaje: Mensaje): string | number {
    return mensaje.fecha ? `${mensaje.fecha}-${index}` : index;
  }

  emitirMensaje(): void {
    const contenido = this.nuevoMensaje.trim();
    if (!this.puedeCapturarMensajes || !contenido) {
      return;
    }

    this.enviarMensaje.emit({
      autor: this.usuario,
      contenido,
      fecha: new Date(),
      propio: true
    });

    this.nuevoMensaje = '';
  }

  private scrollAlFinal(): void {
    setTimeout(() => {
      const el = this.mensajesBody?.nativeElement;
      if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    });
  }
}
