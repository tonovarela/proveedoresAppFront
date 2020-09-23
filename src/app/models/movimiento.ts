
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
    tipo?:string  //Factura-Ingreso , Pago o Contra-recibo
    usoCFDI?:string,
    usoCDFIDesc?:string,
    tipoCambio?:number,
    metodopago?:string,    
    metodoPagoDesc?:string,
    formaPago?:string,
    formaPagoDesc?:string,
    anexos?:Anexo[],
    estaActualizando?:boolean,
    EV?:string
    
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
    tipo?:string,
    solicitaContraRecibo?: boolean,
    detalle?:Movimiento[],
    anexos?:Anexo[],
    estaActualizando?:boolean

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
    detalle?: PagoDetalle[],
    anexos?:Anexo[],
    estaActualizando?:boolean,
    esRequerido?:boolean,
    
    
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


export interface RespuestaAnexo{
    total?:number,
    anexos?:Anexo[]
}

export interface Anexo{
    id?:string,
    url?:string,
    tipo?:string,
    nombre?:string,
    fecha_registro?:string
}
