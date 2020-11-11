export interface OpinionCumplimiento {

    nombre?:string,
    fecha?:Date;
}

export interface ResponseOpinionCumplimiento{
    documentos?:OpinionCumplimiento[]
}