import { Compiler, Story } from 'inkjs/full';
import esSource from '../../story/es/main.ink?raw';
import enSource from '../../story/en/main.ink?raw';
import type { Lang } from '../config';

const SOURCES: Record<Lang, string> = { es: esSource, en: enSource };

export type Step =
  | { kind: 'line'; speaker: string; text: string; tags: Record<string, string>; choices: string[] }
  | { kind: 'end' };

/** Envuelve una historia de Ink y la traduce a pasos que la interfaz sabe pintar. */
export class StoryRunner {
  private story: Story;
  /** Estado justo antes de la última línea mostrada: al restaurarlo se repite esa línea. */
  private snapshot: string;
  /** Nodo (knot) de la última línea mostrada, para "repetir escena". */
  currentKnot = '';

  constructor(lang: Lang) {
    // TODO: precompilar a JSON en el build para no enviar el compilador al navegador
    const compiler = new Compiler(SOURCES[lang]);
    this.story = compiler.Compile();
    if (compiler.errors.length) throw new Error(compiler.errors.join('\n'));
    this.snapshot = this.story.state.toJson();
  }

  next(): Step {
    if (!this.story.canContinue) return { kind: 'end' };

    this.snapshot = this.story.state.toJson();
    const raw = (this.story.Continue() ?? '').trim();
    // Tras Continue(), previousPathString apunta al contenido recién mostrado (null al final)
    const path = this.story.state.previousPathString;
    if (path) this.currentKnot = path.split('.')[0];

    const tags: Record<string, string> = {};
    for (const tag of this.story.currentTags ?? []) {
      const [key, ...rest] = tag.split(':');
      tags[key.trim()] = rest.join(':').trim();
    }

    const match = raw.match(/^([^:]{1,24}):\s*(.*)$/);
    const choices = this.story.canContinue ? [] : this.story.currentChoices.map(c => c.text);
    return {
      kind: 'line',
      speaker: match ? match[1] : '',
      text: match ? match[2] : raw,
      tags,
      choices,
    };
  }

  choose(index: number): void {
    this.story.ChooseChoiceIndex(index);
  }

  jumpTo(knot: string): void {
    this.story.ChoosePathString(knot);
  }

  reset(): void {
    this.story.ResetState();
  }

  /** Estado serializable: solo progreso narrativo, sin datos personales. */
  save(): string {
    return this.snapshot;
  }

  load(json: string): void {
    this.story.state.LoadJson(json);
  }
}
