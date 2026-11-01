# EmiVerse — Created by Emily

Primera aventura 2D original para celulares, tablets y navegador. Crea tu personaje, explora una casita y un jardín, cuida a Nubi y colecciona recuerdos. React 19, TypeScript y Vite 8.

## Estado inicial del repositorio

Al revisarlo, el remoto `mariovasco24/emiverse` no tenía referencias y el checkout no contenía archivos ni commits. Esta versión crea su estructura inicial.

```text
src/
  App.tsx          Mundo, controles táctiles, vestidor e interacciones
  Character.tsx    Personajes originales dibujados en SVG
  Scenery.tsx      Casita y jardín originales en SVG
  world.ts         Modelo de personajes, límites y guardado
  world.css        Diseño del mundo para móvil, tablet y escritorio
  MemoryGame.tsx   Minijuego de memoria con tres mundos
  game.ts          Reglas y progreso del minijuego
  *.test.ts        Pruebas de reglas, datos y guardado
  main.tsx         Entrada React
  styles.css       Estilos base y del minijuego
public/            Icono original
tests/             Pruebas funcionales Playwright
.github/workflows/ Compilación y despliegue en Pages
docs/              Guía para publicar desde el celular
```

## Ejecutar y comprobar

Node.js 22.12 o superior (validado con Node 24) y npm. Sin backend, cuentas ni claves de API.

```sh
npm ci
npm run dev
npm test
npm run build
npm run test:e2e
```

`npm run preview` sirve `dist/` después de compilar. Las pruebas de navegador usan Chromium en `/usr/bin/chromium`; configura `CHROMIUM_PATH` si está en otro lugar.

## Jugar desde el celular

- Crea hasta cinco personajes. Personaliza nombre, piel, ropa, cabello y accesorios.
- Toca un espacio del suelo para caminar o mantén pulsadas las flechas. En computadora funcionan las flechas y WASD.
- Cambia de escenario con **Casita** y **Jardín**.
- Toca los objetos etiquetados para cuidar a Nubi, regar Arcoflor, pintar, activar una melodía original y abrir un regalo que desbloquea una corona.
- Cambia de protagonista en el panel de personajes. El juego de memoria se abre desde la tarjeta inferior.

Personajes y recuerdos se conservan en `localStorage` por navegador y origen. Los logros del minijuego se guardan aparte. No se sincronizan entre dispositivos ni entre las URLs de preview y producción. La posición, el escenario, la música y el dibujo del caballete se reinician al recargar. Si el almacenamiento está bloqueado, se avisa y el juego sigue funcionando durante la sesión.

## Diseño y alcance

Personajes, mascota, fondos, ilustración y melodía creados para este proyecto. No se usan personajes ni recursos de Avatar World. Los emojis son símbolos nativos del dispositivo. Sin fuentes remotas, imágenes externas, publicidad ni rastreadores.

Primera versión: dos escenarios, cinco interacciones y un minijuego. No incluye multijugador, físicas, obstáculos sólidos, inventario general ni cuentas. Se puede caminar por el área de juego y las interacciones se activan al tocar un objeto, sin requisito de proximidad.

## Publicar y aprobar desde el celular

Consulta [la guía paso a paso](docs/PUBLICAR-DESDE-CELULAR.md). Incluye Vercel con vistas previas por pull request y GitHub Pages para producción, sin terminal local.

GitHub Actions compila y ejecuta las pruebas unitarias en cada pull request y cambio a `main`. El workflow de Pages publica cambios de `main` cuando Pages está configurado para usar **GitHub Actions**. Los tests Playwright se ejecutan en el entorno de desarrollo; no se anuncian como parte de CI.

No se considera publicada una versión hasta abrir su URL y verificar el juego.
