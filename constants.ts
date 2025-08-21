import { ScheduleItem, SanctionCatalogItem } from './types';

export const COURSES = [
  "1° A", "1° B", "1° C", "1° D", "1° E", "1° F",
  "2° A", "2° B", "2° C", "2° D",
  "3° A", "3° B", "3° C", "3° D",
  "4° A", "4° B", "4° C", "4° D",
  "5° A", "5° B", "5° C", "5° D",
];

export const COMPETITIONS_BY_DAY = [
  {
    day: "Puntajes del primer día",
    competitions: [
      "Presentación y Decoración de Tribuna",
      "Juego de la Silla",
      "Juego del Huevo",
      "Reventa",
    ],
  },
  {
    day: "Puntajes del segundo día",
    competitions: [
      "Fútbol",
      "Vóley",
    ],
  },
  {
    day: "Puntajes del tercer día",
    competitions: [
      "Carretilla Humana",
      "Juego de la Bolsa",
      "Elección Rey y Reina (1° Pasada)",
      "Juego Sorpresa",
    ],
  },
];

export const COMPETITIONS = COMPETITIONS_BY_DAY.flatMap(d => d.competitions);

export const SCHEDULE: ScheduleItem[] = [
    { id: 'sch-1', time: '08:00 - 09:00', activity: 'Recepción de Cursos y Acreditaciones', location: 'Acceso Principal' },
    { id: 'sch-2', time: '09:00 - 09:30', activity: 'Acto de Apertura', location: 'Escenario Principal' },
    { id: 'sch-3', time: '09:30 - 12:30', activity: 'Ronda 1: Fútbol y Vóley', location: 'Campos de Deporte' },
    { id: 'sch-4', time: '12:30 - 14:00', activity: 'Almuerzo / Receso', location: 'Zona de Comedor' },
    { id: 'sch-5', time: '14:00 - 16:00', activity: 'Competencia de Conocimiento', location: 'SUM' },
    { id: 'sch-6', time: '16:00 - 18:00', activity: 'Presentación de Tribunas', location: 'Patio Central' },
    { id: 'sch-7', time: '18:00 - 20:00', activity: 'Show de Talentos Artísticos', location: 'Escenario Principal' },
    { id: 'sch-8', time: '20:00', activity: 'Cierre de Jornada', location: 'Patio Central' },
];

export const RULES = [
    "Puntualidad: Es obligatorio respetar los horarios de cada actividad. Los equipos ausentes perderán los puntos.",
    "Respeto: Se exige una conducta de respeto hacia compañeros, rivales, jurados y personal de la institución.",
    "Limpieza: Cada curso es responsable de mantener limpio su espacio asignado en la tribuna y áreas comunes.",
    "Identificación: Todos los alumnos deben portar su credencial en un lugar visible durante todo el evento.",
    "Fair Play: Se promueve el juego limpio. Cualquier acto de violencia o agresión resultará en la descalificación inmediata.",
    "Prohibiciones: Está terminantemente prohibido el ingreso de bebidas alcohólicas, sustancias ilegales y objetos punzocortantes.",
    "Decisiones del Jurado: Las decisiones del jurado son inapelables en todas las competencias.",
];

export const SANCTIONS_CATALOG: SanctionCatalogItem[] = [
    { id: 1, infraction: 'Retraso en la presentación', description: 'El curso no se presenta en el horario asignado sin justificación.', points: 1 },
    { id: 2, infraction: 'Abandono de escenario sin autorización', description: 'Salida intempestiva del escenario sin orden previa.', points: 2 },
    { id: 3, infraction: 'Intervención de adultos', description: 'Participación directa de un adulto en montaje, armado, dirección, etc.', points: 1 },
    { id: 4, infraction: 'Burlas a otro curso', description: 'Gestos, risas o señas de desprecio a competidores.', points: 2 },
    { id: 5, infraction: 'Uso de materiales no autorizados', description: 'Utilización de elementos prohibidos por el reglamento.', points: 1 },
    { id: 6, infraction: 'Coreografía ofensiva', description: 'Representación que afecte valores, moral o símbolos institucionales.', points: 2 },
    { id: 7, infraction: 'Falta de respeto al jurado', description: 'Frases o actitudes de falta de respeto hacia el jurado u organización.', points: 2 },
    { id: 8, infraction: 'Exceso del tiempo de presentación', description: 'Exceder el tiempo estipulado para la puesta en escena.', points: 1 },
    { id: 9, infraction: 'Falta de identificación', description: 'No portar señalética del curso en escena.', points: 0.5 },
    { id: 10, infraction: 'Desorden al finalizar', description: 'Dejar basura o no desmontar elementos tras su participación.', points: 1 },
    { id: 11, infraction: 'Retraso en zona de espera', description: 'Llegada tardía sin aviso al espacio de prearmado.', points: 1 },
    { id: 12, infraction: 'Salida del tinglado', description: 'Cada salida injustificada equivale a -1.66 pts. A la tercera: -5 puntos.', points: 1.66 },
    { id: 13, infraction: 'Participante sin acreditación', description: 'Estudiante sin credencial oficial del evento.', points: 0.5 },
    { id: 14, infraction: 'Lenguaje vulgar en escena', description: 'Palabras ofensivas o inapropiadas en la presentación.', points: 1 },
    { id: 15, infraction: 'Desobediencia a fiscalización', description: 'Rechazo de advertencias o sugerencias reglamentarias.', points: 1 },
    { id: 16, infraction: 'Obstaculizar otra delegación', description: 'Interferir en el desarrollo escénico de otro curso.', points: 1.5 },
    { id: 17, infraction: 'Falta a ensayo general', description: 'No asistir o llegar tarde al ensayo oficial.', points: 0.5 },
    { id: 18, infraction: 'Uso de pirotecnia no permitida', description: 'Uso de fuego o artefactos peligrosos sin autorización.', points: 2 },
    { id: 19, infraction: 'No respetar la temática', description: 'La propuesta artística no responde a la consigna oficial.', points: 1 },
    { id: 20, infraction: 'Agresión entre participantes', description: 'Agresión física o verbal grave hacia otro estudiante.', points: 5 },
];