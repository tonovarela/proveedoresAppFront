export interface Mensaje {
  autor?: string;
  contenido: string;
  fecha?: Date | string;
  /** Indica si el mensaje pertenece al usuario actual (se alinea a la derecha). */
  propio?: boolean;
}
