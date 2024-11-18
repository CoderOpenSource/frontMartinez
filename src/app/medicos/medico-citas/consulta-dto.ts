export interface ConsultaDTO {
  citaId: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  diagnostico: string;
  sintomas: string[];
  tratamiento: string;
  notas: string;
}
