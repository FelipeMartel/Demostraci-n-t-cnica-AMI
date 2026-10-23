// Ajustes del taller. Los códigos viven en el cliente: sirven para ordenar el aula, no como seguridad.
export const FACILITATOR_CODE = 'PROFE';

export const SAVE_KEY = 'ami-mensaje:partida';

// Nodos de Ink a los que el facilitador puede saltar directamente
export const CHAPTERS: Record<string, string> = {
  ch1: 'capitulo1',
  ch2: 'capitulo2',
  ch3: 'capitulo3',
};

export type Lang = 'es' | 'en';
