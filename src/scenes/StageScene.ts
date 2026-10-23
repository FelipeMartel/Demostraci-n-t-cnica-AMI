import * as Phaser from 'phaser';

export const WIDTH = 1280;
export const HEIGHT = 720;

// Fondos provisionales: se sustituirán por las ilustraciones (PNG) de cada escena
const BACKGROUNDS: Record<string, [number, number]> = {
  patio: [0x9fd3f5, 0x7cbf6b],
  aula: [0xf3e3c3, 0xb98b5e],
  pasillo: [0xdfe4ee, 0x8d96a8],
};

export type Expression = 'neutral' | 'feliz' | 'preocupada' | 'pensativa';

/** Escenario visual. No sabe nada de la historia: solo obedece órdenes (fondo, expresión de AMI). */
export class StageScene extends Phaser.Scene {
  private sky!: Phaser.GameObjects.Rectangle;
  private ground!: Phaser.GameObjects.Rectangle;
  private ami!: Phaser.GameObjects.Container;
  private face!: Phaser.GameObjects.Graphics;
  private resolveReady!: () => void;
  readonly ready = new Promise<void>(r => (this.resolveReady = r));

  constructor() {
    super('Stage');
  }

  create(): void {
    this.sky = this.add.rectangle(0, 0, WIDTH, HEIGHT * 0.65, 0x9fd3f5).setOrigin(0);
    this.ground = this.add.rectangle(0, HEIGHT * 0.65, WIDTH, HEIGHT * 0.35, 0x7cbf6b).setOrigin(0);

    // AMI provisional, montada por piezas: así se animará también el diseño real de Hero4Help
    const body = this.add.ellipse(0, 90, 150, 170, 0x2f6fdb);
    const head = this.add.circle(0, -40, 95, 0xf5f7ff).setStrokeStyle(6, 0x2f6fdb);
    const antenna = this.add.rectangle(0, -150, 8, 40, 0x2f6fdb);
    const bulb = this.add.circle(0, -172, 12, 0xffb703);
    this.face = this.add.graphics();
    const label = this.add.text(0, 190, 'AMI (provisional)', { fontSize: '20px', color: '#1d2333' }).setOrigin(0.5);
    this.ami = this.add.container(1020, 330, [body, head, antenna, bulb, this.face, label]);

    this.tweens.add({ targets: this.ami, y: '-=10', duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: bulb, alpha: 0.4, duration: 900, yoyo: true, repeat: -1 });

    this.setExpression('neutral');
    this.resolveReady();
  }

  setBackground(id: string): void {
    const colors = BACKGROUNDS[id];
    if (!colors) return console.warn(`Fondo desconocido: ${id}`);
    this.sky.setFillStyle(colors[0]);
    this.ground.setFillStyle(colors[1]);
    this.cameras.main.flash(250, 255, 255, 255);
  }

  setExpression(expression: string): void {
    const g = this.face.clear();
    const cy = -40;
    g.fillStyle(0x1d2333);
    g.lineStyle(6, 0x1d2333);

    switch (expression as Expression) {
      case 'feliz':
        g.fillCircle(-32, cy - 10, 11).fillCircle(32, cy - 10, 11);
        g.beginPath().arc(0, cy + 22, 30, 0.15 * Math.PI, 0.85 * Math.PI).strokePath();
        break;
      case 'preocupada':
        g.fillCircle(-32, cy - 5, 10).fillCircle(32, cy - 5, 10);
        g.lineBetween(-48, cy - 32, -18, cy - 24).lineBetween(48, cy - 32, 18, cy - 24);
        g.beginPath().arc(0, cy + 52, 26, 1.2 * Math.PI, 1.8 * Math.PI).strokePath();
        break;
      case 'pensativa':
        g.fillCircle(-28, cy - 14, 10).fillCircle(36, cy - 14, 10);
        g.lineBetween(20, cy - 38, 52, cy - 32);
        g.lineBetween(-14, cy + 34, 22, cy + 28);
        break;
      default:
        g.fillCircle(-32, cy - 8, 10).fillCircle(32, cy - 8, 10);
        g.lineBetween(-20, cy + 32, 20, cy + 32);
    }

    this.tweens.add({ targets: this.ami, scale: { from: 1.06, to: 1 }, duration: 220, ease: 'Back.easeOut' });
  }
}
