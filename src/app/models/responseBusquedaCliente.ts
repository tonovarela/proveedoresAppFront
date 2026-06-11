export interface ResponseBusquedaCliente {
    data: ClienteBusqueda[];
}

export interface ClienteBusqueda { 

    Nombre:             string;
    RFC:                string;
    Proveedor:          string;    
    
}