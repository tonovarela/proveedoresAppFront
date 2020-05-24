import { Component, OnInit } from '@angular/core';
declare function iniciar_plugins();
@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styleUrls: ['./nopagefound.component.css']
})
export class NopagefoundComponent implements OnInit {

  constructor() { }
  anio: number = new Date().getFullYear();
  ngOnInit(): void {
    iniciar_plugins();
  }
}
