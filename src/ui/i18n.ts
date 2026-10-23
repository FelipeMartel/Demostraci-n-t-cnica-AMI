import type { Lang } from '../config';

const TEXTS: Record<Lang, Record<string, string>> = {
  es: {
    subtitle: 'El mensaje que nadie vio completo',
    demoNote: 'Demostración técnica: arte, guion y sonido provisionales.',
    start: 'Empezar',
    continue: 'Continuar partida',
    next: 'Siguiente',
    end: 'Fin. ¡Gracias por investigar!',
    pauseTitle: '¡Pausa de investigación!',
    pauseText: 'Revisad las tarjetas en vuestra mesa. Cuando terminéis, vuestro docente os dará una palabra clave.',
    codeLabel: 'Palabra clave',
    resume: 'Seguir',
    wrongCode: 'Esa palabra clave no es correcta. Preguntad a vuestro docente.',
    facilitator: 'Facilitador',
    enter: 'Entrar',
    facRepeat: 'Repetir escena',
    facSkip: 'Saltar pausa',
    facCh1: 'Ir al capítulo 1',
    facCh2: 'Ir al capítulo 2',
    facCh3: 'Ir al capítulo 3',
    facReset: 'Reiniciar partida',
    close: 'Cerrar',
  },
  en: {
    subtitle: 'The message nobody saw in full',
    demoNote: 'Technical demo: placeholder art, script and sound.',
    start: 'Start',
    continue: 'Continue game',
    next: 'Next',
    end: 'The end. Thanks for investigating!',
    pauseTitle: 'Investigation break!',
    pauseText: 'Check the cards on your table. When you finish, your teacher will give you a keyword.',
    codeLabel: 'Keyword',
    resume: 'Continue',
    wrongCode: "That keyword isn't right. Ask your teacher.",
    facilitator: 'Facilitator',
    enter: 'Enter',
    facRepeat: 'Repeat scene',
    facSkip: 'Skip break',
    facCh1: 'Go to chapter 1',
    facCh2: 'Go to chapter 2',
    facCh3: 'Go to chapter 3',
    facReset: 'Restart game',
    close: 'Close',
  },
};

let current: Lang = 'es';

export function setLang(lang: Lang): void {
  current = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n!);
  });
}

export function t(key: string): string {
  return TEXTS[current][key] ?? key;
}
