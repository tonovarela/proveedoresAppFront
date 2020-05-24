export interface RespuestaSAAM {
    ordenes:     { [key: string]: null | string }[];
    proveedores: Campania[];
    campanias:   Campania[];
    id_usuario:  string;
}

export interface Campania {
    label: string;
    value: string;
}

export class Orden {

    
    constructor() {
                
    }
    
    numero_orden: string;
    campania :string;
    estado: string;
    fecha_registro:Date;
    nombre_proveedor:String;
}
