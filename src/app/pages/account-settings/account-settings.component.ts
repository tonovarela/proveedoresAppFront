import { SettingsService } from './../../services/settings.service';
import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {

  constructor(private _ajustes: SettingsService) { }

  ngOnInit(): void {
    this.colocarCheck();
  }

  cambiarColor(color: string, link: any) {
    //console.log(color);
    this.aplicarCheck(link);
    this._ajustes.aplicarTema(color);
    //this._document.getElementById('tema').setAttribute('href', url );

  }

  aplicarCheck(link: any) {
    const selectores: any = document.getElementsByClassName('working');
    for (const ref of selectores) {
      ref.classList.remove('working');
    }
    link.classList.add('working');


  }

  colocarCheck() {
    const selectores: any = document.getElementsByClassName('selector');
    const tema = this._ajustes.ajustes.tema;
    for (const ref of selectores) {
      if (ref.getAttribute('data-theme') === tema) {
        ref.classList.add('working');
      } else {
        ref.classList.remove('working');
      }
    }
  }

}
