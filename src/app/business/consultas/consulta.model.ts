export interface Consulta {
  id: number;
  citaId: number;
  pacienteId: number;
  pacienteNombre: string;
  medicoId: number;
  fecha: string; // ISO string format (YYYY-MM-DD)
  diagnostico: string;
  sintomas: string[];
  tratamiento: string;
  notas: string;
  derivoProcedimiento: boolean;
  especialidadId: number;
  especialidadNombre: string;
  nombreMedico: string;
}
