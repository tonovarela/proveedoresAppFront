export interface Usuario {
    idRol?:string;
    Proveedor?: string; //Id proveedor
    Estatus?: string;
    Nombre?: string;
    RFC?: string;
    RegimenFiscal?:string;
    //PuedeAnexarDocumento?:boolean;
    PuedeGenerarContraRecibo?:boolean;   
    MontoMaxContraRecibo?:number;    
    
}

export interface ResponseLogin{
    validacion: boolean;
    data: Usuario[];
    mensaje: string;
}