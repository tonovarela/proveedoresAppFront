export interface Comunicado {
    id_comunicado?:string,
    titulo?:string;    
    mensaje?: string;
    fecha_registro?:Date,
    fecha_actualizacion?:Date,
    visible?:boolean,
    general?:boolean
}