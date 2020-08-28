import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comunicado } from '../models/comunicado';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {
    URL = "http://localhost:44382";
   comunicados:Comunicado[]=[];

  constructor(private http: HttpClient) { }
   
  agregar(comunicado:Comunicado){
    
    return this.http.post(`${this.URL}/api/comunicado`,comunicado);    
  }


  listar(){
    //console.log(`${this.URL}/api/comunicado`);
    return this.http.get(`${this.URL}/api/comunicado`).pipe(
      map(x=>{
        this.comunicados= x["comunicados"];
        return this.comunicados;
      })
    );    
  }

  detalle(id){

    return this.http.get(`${this.URL}/api/comunicado/${id}`).pipe(
      map(x=>{        
        return x["comunicados"];
      })
    );        
  }

  borrar(comunicado:Comunicado){

    return this.http.get(`${this.URL}/api/comunicado/borrar/${comunicado.id_comunicado}`).pipe(
      map(x=>{        
        return x["comunicados"];
      })
    );        
    //this.comunicados=this.comunicados.filter(x=>x.id_comunicado!==comunicado.id_comunicado);
  }

  actualizar(comunicado:Comunicado){    
    return this.http.post(`${this.URL}/api/comunicado/actualizar`,comunicado).pipe(
      map(x=>{        
        return x["comunicado"];
      })
    );        


    
  }

  cambiarDisponibilidad(comunicado:Comunicado){    
    return this.http.get(`${this.URL}/api/comunicado/general/${comunicado.id_comunicado}?valor=${comunicado.general}`).pipe(
      map(x=>{        
        return x["comunicado"];
      })
    );        

  }

  cambiarVisible(comunicado:Comunicado){    
    return this.http.get(`${this.URL}/api/comunicado/visible/${comunicado.id_comunicado}?valor=${comunicado.visible}`).pipe(
      map(x=>{        
        return x["comunicado"];
      })
    );        

  }
  
}
