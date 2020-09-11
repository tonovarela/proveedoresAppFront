import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  //menu:any;
  menu: Observable<any>;
  constructor(private http:HttpClient) {
    this.menu = this.http.get("assets/data/menu.json");
    
  }

  obtenerMenu(){
    
  }

}
