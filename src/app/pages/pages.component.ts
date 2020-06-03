import { Component, OnInit } from '@angular/core';
declare function iniciar_plugins();

import { loadCldr, L10n, setCulture } from "@syncfusion/ej2-base";
import { traduccion } from '../i18n/es-MX';

declare var require: any;
loadCldr(
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/es/ca-gregorian.json'),
  require('cldr-data/main/es/numbers.json'),
  require('cldr-data/main/es/timeZoneNames.json'),
  require('cldr-data/supplemental/weekdata.json') 
);

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciar_plugins();
    L10n.load(traduccion);
    setCulture("es");
  }

}
