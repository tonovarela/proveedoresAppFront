export interface Usuario {
    Proveedor?: string; //Id proveedor
    Estatus?: string;
    Nombre?: string;
    RFC?: string;
    MetodoPago?:string,
    FormaPago?:string,
    Condicion?:string,
    MontoMaxContraRecibo?:number;
}

export interface ResponseLogin{
    validacion: boolean;
    data: Usuario[];
    mensaje: string;
}