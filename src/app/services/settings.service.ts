import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default.css',
    tema: 'default'
  };
  constructor(private _router: Router,) { 
    this.cargarAjustes();
  }

  cargarAjustes() {
    if (localStorage.getItem('ajustes')) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));     
    }
    this.aplicarTema(this.ajustes.tema);
  }
  aplicarTema(color: string) {
    const url = `assets/css/colors/${color}.css`;
    document.getElementById('tema').setAttribute('href', url);
    this.ajustes.tema = color;
    this.ajustes.temaUrl = url;
    this.guardarAjustes();
  }
  guardarAjustes() {
    // console.log('Guardando en el storage');
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  


}



interface Ajustes {
  temaUrl: string;
  tema: string;
}
