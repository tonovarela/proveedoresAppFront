
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

