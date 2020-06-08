
export interface Movimiento {
    movimientoID?: number;
    folio?:number;
    movimientoDescripcion?:string;
    referencia?: string;
    fechaEmision?: Date;
    fechaVencimiento?:Date;
    saldo?: number;
    importe?:number,    
    moneda?: string;
    montoMaximoContraRecibo?:number;
    tieneXML?:boolean;
    tienePDF?: boolean    
    solicitaContraRecibo?: boolean,
    tipo?:string  //Factura-Ingreso o  Pago
    usoCFDI?:string,
    metodopago?:string,
    formaPago?:string
    
}

export interface Contrarecibo {
    movimientoID?: number;
    folio?:number;
    movimientoDescripcion?:string;
    referencia?: string;
    fechaEmision?: Date;
    fechaVencimiento?:Date;
    saldo?: number;
    importe?: number;
    moneda?: string;
    montoMaximoContraRecibo?:number;
    tieneXML?:boolean;
    tienePDF?: boolean    
    solicitaContraRecibo?: boolean,
    detalle?:Movimiento[]

}

export interface PagoAprobado{
    movimientoID?: number;
    folio?:number;
    movimientoDescripcion?:string;
    referencia?: string;
    fechaEmision?: Date;
    fechaVencimiento?:Date;
    saldo?: number;
    importe?:number,    
    moneda?: string;
    montoMaximoContraRecibo?:number;
    tieneXML?:boolean;
    tienePDF?: boolean    
    solicitaContraRecibo?: boolean,
    tipo?:string  //Factura-Ingreso o  Pago    
    metodopago?:string,
    formaPago?:string,
    detalle?: PagoDetalle[]
}

export interface PagoDetalle{
    movPago?:string,
    fechaEmision?:Date,
    numeroCR?:string,
    numE?: string,
    factura?: string,
    importe?: number
}


export interface Factura{
    referencia?:string,
    modulo?:string,
    folio?:string,    
}
