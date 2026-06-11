export interface Solicitud {
    id_solicitud?:string,
    proveedor:string,
    nombreProveedor?:string,
    rfc?:string,
    anio?:number,
    mes?:number,
    nota?:string,
    prefijo?:string,
    id_estado:number,
    fecha_registro:Date,    
    estado?:string,
    totalNotas:number
}

export interface EstadoSolicitud {
    id_estado?:number,
    estado?:string
}

export interface ResponseSolicitudes {
    solicitudes?:Solicitud[],
}


interface RequestSolicitud {
  proveedor:string;
  prefijo:string;
  id_usuario:number;
  mensaje:string;
}
