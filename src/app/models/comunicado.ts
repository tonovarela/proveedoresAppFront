export interface Comunicado {
    id_comunicado?:string,
    titulo?:string;    
    mensaje?: string;
    fecha_registro?:Date,
    fecha_inicio?:Date,
    fecha_fin?:Date,
    fecha_actualizacion?:Date,
    visible?:boolean,
    general?:boolean
}


export interface ResponseComunicadosPorLeer{
     comunicadosPendientes?:Comunicado[],
     total?:number
}
