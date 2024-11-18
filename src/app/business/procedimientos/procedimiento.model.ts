export interface Procedimiento {
  id: number;
  descripcion: string;
  fecha: string;
  observaciones: string;
  archivoUrl: string;
  medicoNombre: string;
  medicoApellido: string;
  pacienteNombre: string;
  pacienteApellido: string;
  consultaId: number;
}
