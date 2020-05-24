import { Component, OnInit } from '@angular/core';
declare function iniciar_plugins();
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciar_plugins();
  }

}
