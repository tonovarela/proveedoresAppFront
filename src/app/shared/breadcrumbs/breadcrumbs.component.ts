import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {
  etiqueta: string;
  constructor(private _router: Router, private _title: Title, private _meta: Meta, ) {
    this.getDataRoute().subscribe(data => {
      this._title.setTitle(data.titulo);
      this.etiqueta = data.titulo;
      const metaTag: MetaDefinition = {
        name : 'Description',
       content : this.etiqueta
      };
      this._meta.updateTag(metaTag);
    });
   }

  ngOnInit(): void {
  }


  getDataRoute() {
    return this._router.events.pipe(
      filter(event => {
        return event instanceof ActivationEnd && event.snapshot.firstChild === null;
      }),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

}
