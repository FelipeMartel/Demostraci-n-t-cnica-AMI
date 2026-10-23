# AMI · El mensaje que nadie vio completo — prototipo

Aventura narrativa 2D para navegador. Phaser 4 (escenario), Ink (guion) y HTML (interfaz accesible).

## Uso

```bash
npm install
npm run dev            # http://localhost:5173, con recarga automática
npm run dev -- --host  # además accesible desde una tableta en la misma wifi
npm run build          # genera dist/ (archivos estáticos para cualquier servidor)
```

## Estructura

| Ruta | Contenido |
|---|---|
| `story/es/main.ink`, `story/en/main.ink` | Guion. Se edita con [Inky](https://github.com/inkle/inky). Mismos nodos, variables y etiquetas en ambos idiomas |
| `src/story/StoryRunner.ts` | Conecta Ink con la app: líneas, opciones, guardado y saltos |
| `src/scenes/StageScene.ts` | Escenario Phaser: fondos y AMI (provisional, por piezas) |
| `src/main.ts` | Flujo: diálogo, opciones, pausas físicas, modo facilitador |
| `src/ui/` | Textos de interfaz (ES/EN) y estilos |
| `src/config.ts` | Código de facilitador, capítulos y clave de guardado |

## Convenciones del guion

- `Nombre: texto` → línea con personaje.
- `# escena: patio` → cambia el fondo.
- `# ami: feliz` → expresión de AMI (`neutral`, `feliz`, `preocupada`, `pensativa`).
- `# pausa: LUPA42` → pausa física; se reanuda con esa palabra clave.

## Pruebas manuales

- Facilitador: botón esquina superior derecha, código `PROFE` (en `src/config.ts`).
- Teclado: Tab/Enter para navegar, teclas 1-9 para elegir opción.
- Guardado: recargar la página → «Continuar partida».

## Pendiente

- Precompilar Ink a JSON en el build (ahora se compila en el navegador; añade peso).
- Sustituir AMI y fondos provisionales por el arte de Hero4Help.
- Sonido, subtítulos de audio y versión de demostración.
- Exportación de indicadores agregados (Escenario B).
