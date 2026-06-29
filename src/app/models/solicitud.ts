export interface Solicitud {
    id_solicitud?:string,
    proveedor:string,
    nombreProveedor?:string,
    nombre?:string,
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


export interface ResponseSolicitud {
    solicitud:Solicitud,
}
export interface ResponseSolicitudes {
    solicitudes:Solicitud[],
    estados:EstadoSolicitud[]
}

export interface RequestSolicitud {
  proveedor:string;
  prefijo:string;
  id_usuario:number;
  mensaje:string;
}


export interface EstadoSolicitud {
  id_estado?:number,
  descripcion?:string
}




export type EstadoDocumento = 'Requerimiento' | 'En revision' | 'Rechazado' | 'Aceptado';



export interface DocumentoRepse {
  id_tipo_documento: string;
  descripcion: string;
  tipo: string;
  ruta?: string;
  nombre?: string;
  fechaSubida: Date | null;
  estado: EstadoDocumento;
}

export interface ResponseDocumentosSolicitud {
  documentos: DocumentoSolicitud[]
}

export interface DocumentoSolicitud {

  id_tipo_documento?:string,
  descripcion?:string,
  formato?:string,
  nomenclatura?:string,
  estadoDocumento?:string,
  descripcionEstado?:string,
  ruta?:string,
  nombre?:string,
  fecha_registro?:Date

}

export interface SolicitudNotasResponse {
  notas: SolicitudNota[]
}

export interface SolicitudNota {
 
  id_usuario:string,
   autor:string,
  contenido:string,  
  fecha_registro:Date
}



