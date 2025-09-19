import { SidebarService } from './../../services/sidebar.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menu$:Observable<any>;
  constructor(public _usuarioService: UsuarioService,public _sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.menu$ =this._sidebarService.menu.pipe(
      map(x => {
        const esAdmin = this._usuarioService.esAdmin();
        if (esAdmin) 
          return x.filter(element => {
            if (element.admin == true)
              return element;
          });
                
          return x.filter(element => {
            if (element.admin == false)
              return element;
          });
        }

      )
    );

  }

  esREPSE(){
    return this._usuarioService.esREPSE();
  }



}
