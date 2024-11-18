export interface Analisis {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteApellido: string;
  medicoId: number;
  medicoNombre: string;
  medicoApellido: string;
  tipoAnalisis: string;
  resultado: string;
  fechaRealizacion: string;
  archivoUrl: string;
}
