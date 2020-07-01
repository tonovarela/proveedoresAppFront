
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
    CR?:boolean,
    solicitaContraRecibo?: boolean,
    tipo?:string  //Factura-Ingreso o  Pago
    usoCFDI?:string,
    tipoCambio?:number,    
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
    totalMovimientos?:number,
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
    usoCFDI?:string,
    formaPago?:string,
    totalMovimientos?:number,
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


 export interface  RevisionCP{
   existeEnXML:boolean,
   idDocumento:string,
   importeRegistrado:number,
   importeXML:number,
   statusImporte:number
 }



export interface CR_Request{
    proveedor?:string;
    movimiento?:string;
    movimientos?:MovCR[]

}

export interface MovCR{
    referencia?:string;
    folio?:number;
    importe?:number;
}
