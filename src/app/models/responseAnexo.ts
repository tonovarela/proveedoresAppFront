export interface ResponseAnexo {
    documentos: Documento[];
}

export interface Documento {
    IDR:             string;
    cuenta:          string;
    nombreProveedor: string;
    nombreArchivo:   string;
    ruta:            string;
    Alta:            Date;
}
