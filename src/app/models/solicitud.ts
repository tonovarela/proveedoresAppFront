export interface Solicitud {
    id_solicitud?:string,
    proveedor:string,
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