import { SidebarService } from './../../services/sidebar.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public _usuarioService: UsuarioService,
    public _sidebarService: SidebarService,
    
  ) { }

  ngOnInit(): void {
    

  }



}
