import * as Phaser from 'phaser';
import { CHAPTERS, FACILITATOR_CODE, SAVE_KEY, type Lang } from './config';
import { StageScene, WIDTH, HEIGHT } from './scenes/StageScene';
import { StoryRunner, type Step } from './story/StoryRunner';
import { setLang, t } from './ui/i18n';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

const stage = new StageScene();
new Phaser.Game({
  type: Phaser.AUTO, // WebGL si está disponible; si no, Canvas
  parent: 'stage',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#1d2333',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: stage,
});

let lang: Lang = 'es';
let runner: StoryRunner;
let pendingPause: string | null = null;

// ---------- Guardado local (sin datos personales) ----------

type Save = { lang: Lang; state: string };

function readSave(): Save | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? (JSON.parse(raw) as Save) : null;
  } catch {
    return null;
  }
}

function writeSave(): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ lang, state: runner.save() } satisfies Save));
  } catch {
    // Sin almacenamiento (modo privado, bloqueado): se juega igual, solo que no se guarda
  }
}

function clearSave(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}

// ---------- Flujo de la historia ----------

async function advance(): Promise<void> {
  await stage.ready;
  render(runner.next());
  writeSave();
}

function render(step: Step): void {
  const choicesEl = $('choices');
  const nextBtn = $('btn-next');
  choicesEl.replaceChildren();
  $('dialog').hidden = false;

  if (step.kind === 'end') {
    $('speaker').textContent = '';
    $('line').textContent = t('end');
    nextBtn.hidden = true;
    clearSave();
    return;
  }

  if (step.tags.escena) stage.setBackground(step.tags.escena);
  if (step.tags.ami) stage.setExpression(step.tags.ami);
  pendingPause = step.tags.pausa ?? null;

  $('speaker').textContent = step.speaker;
  $('line').textContent = step.text;

  if (step.choices.length) {
    nextBtn.hidden = true;
    step.choices.forEach((text, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = `${i + 1}. ${text}`;
      btn.addEventListener('click', () => {
        runner.choose(i);
        advance();
      });
      choicesEl.append(btn);
    });
    (choicesEl.firstElementChild as HTMLElement).focus();
  } else {
    nextBtn.hidden = false;
    nextBtn.focus();
  }
}

function onNext(): void {
  if (pendingPause) return openPause();
  advance();
}

// ---------- Pausa físico-digital ----------

function openPause(): void {
  $('dialog').hidden = true;
  $('pause').hidden = false;
  $('pause-error').textContent = '';
  const input = $<HTMLInputElement>('pause-code');
  input.value = '';
  input.focus();
}

function closePause(): void {
  pendingPause = null;
  $('pause').hidden = true;
  advance();
}

$('pause-form').addEventListener('submit', e => {
  e.preventDefault();
  const value = $<HTMLInputElement>('pause-code').value.trim().toUpperCase();
  if (value === pendingPause) closePause();
  else $('pause-error').textContent = t('wrongCode');
});

// ---------- Inicio ----------

function start(chosen: Lang, state?: string): void {
  lang = chosen;
  setLang(lang);
  runner = new StoryRunner(lang);
  if (state) runner.load(state);
  $('start').hidden = true;
  advance();
}

document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang as Lang;
    setLang(lang);
    document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  });
});

$('btn-new').addEventListener('click', () => {
  clearSave();
  start(lang);
});

const saved = readSave();
if (saved) {
  $('btn-continue').hidden = false;
  $('btn-continue').addEventListener('click', () => start(saved.lang, saved.state));
}

$('btn-next').addEventListener('click', onNext);

// Atajos de teclado: 1-9 para elegir opción
document.addEventListener('keydown', e => {
  if (e.target instanceof HTMLInputElement) return;
  const n = Number(e.key);
  if (n >= 1 && n <= 9) ($('choices').children[n - 1] as HTMLElement | undefined)?.click();
});

// ---------- Modo facilitador ----------

$('btn-facilitator').addEventListener('click', () => {
  $('facilitator').hidden = false;
  $('fac-code').focus();
});

$('fac-close').addEventListener('click', () => {
  $('facilitator').hidden = true;
});

$('fac-login').addEventListener('submit', e => {
  e.preventDefault();
  const input = $<HTMLInputElement>('fac-code');
  if (input.value.trim().toUpperCase() === FACILITATOR_CODE) {
    $('fac-login').hidden = true;
    $('fac-tools').hidden = false;
  }
  input.value = '';
});

$('fac-tools').addEventListener('click', e => {
  const action = (e.target as HTMLElement).dataset.fac;
  if (!action || !runner) return;
  $('facilitator').hidden = true;
  $('pause').hidden = true;

  if (action === 'skipPause') {
    if (pendingPause) closePause();
    return;
  }

  pendingPause = null;
  if (action === 'reset') runner.reset();
  else if (action === 'repeat') runner.jumpTo(runner.currentKnot);
  else if (CHAPTERS[action]) runner.jumpTo(CHAPTERS[action]);
  advance();
});
