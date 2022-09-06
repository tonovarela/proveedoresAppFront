import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
    private URL: string = environment.URL_SERVICIOS;
    usuario :Usuario  = null;
    tipoArchivo:string ="";
    revisarArchivo:string="1";
  constructor(private http:HttpClient) { }


  public listado(){
    return this.http.get(`${this.URL}/cliente/listado`);
  }


}
