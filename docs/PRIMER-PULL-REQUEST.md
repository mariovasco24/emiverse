## Primera aventura de EmiVerse

El repositorio estaba vacío. Esta versión crea un juego 2D móvil con React, TypeScript y Vite: personajes originales personalizables, casita y jardín, movimiento por toque o controles direccionales, cinco interacciones y progreso local. Incluye un minijuego de memoria y la firma «EmiVerse — Created by Emily».

Vercel queda configurado para vistas previas por PR al conectar el repositorio. GitHub Actions verifica compilación y pruebas; el workflow de Pages publica main tras activar Pages con origen GitHub Actions. La guía docs/PUBLICAR-DESDE-CELULAR.md explica cómo probar, aprobar y publicar desde el celular.

## Validación

- npm ci con lockfile, npm run build y 17 pruebas unitarias correctos.
- 4 pruebas Playwright correctas: partida completa, desbloqueo, personalización, movimiento, cinco interacciones y persistencia al recargar; sin desbordamiento móvil ni errores de JavaScript.
- Gráficos SVG/CSS y melodía originales; sin recursos de Avatar World.

## Alcance

Sin backend ni secretos. Los datos se guardan por navegador y URL. Los escenarios no tienen obstáculos sólidos y los objetos se activan al tocarlos. Las vistas previas públicas requieren conectar Vercel o configurar GitHub Pages; no se declara ninguna URL publicada sin verificarla.

La compilación de producción también se validó bajo `/emiverse/` con Chromium táctil: recursos HTTP 200, edición de personaje, cambio al jardín y riego correctos, sin errores de JavaScript. Para reproducir esa prueba local, usa `VITE_BASE_PATH=/emiverse/` tanto en `npm run build` como en `npm run preview`.
