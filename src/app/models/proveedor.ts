export interface Usuario {
    Proveedor?: string; //Id proveedor
    Estatus?: string;
    Nombre?: string;
    RFC?: string;
    PuedeAnexarDocumento?:boolean;
    PuedeGenerarContraRecibo?:boolean;
    // MetodoPago?:string,
    // FormaPago?:string,
    // Condicion?:string,
    MontoMaxContraRecibo?:number;
}

export interface ResponseLogin{
    validacion: boolean;
    data: Usuario[];
    mensaje: string;
}