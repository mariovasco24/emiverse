# EmiVerse — Created by Emily

Juego 2D original a pantalla completa para celulares, tablets y PC. Las habitaciones ocupan todo el espacio de juego, con personajes de ojos grandes, escenarios dibujados en SVG y controles flotantes. Crea tu personaje, recorre una casita, cocina, dormitorio y jardín conectados por puertas, cuida a Nubi y colecciona recuerdos. React 19, TypeScript y Vite 8.

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

- Crea hasta cinco personajes desde el botón **+** de la bandeja inferior. Personaliza nombre, piel, ropa, cabello y accesorios.
- Toca cualquier personaje —incluido Leo— y arrástralo directamente. También puedes seleccionarlo desde la bandeja y tocar el suelo para que camine. No hay flechas en pantalla.
- Toca una puerta para caminar hasta ella y pasar a la habitación siguiente con una transición de cámara. También puedes arrastrar al personaje hasta una salida lateral.
- Usa **Casita**, **Cocina**, **Dormitorio** o **Jardín** para pedir un recorrido. El personaje cruza las habitaciones intermedias; el selector no lo teletransporta.
- Si tocas otro punto del suelo, eliges otro personaje o abres un menú, se cancela el recorrido pendiente. La transición que ya empezó termina para mantener la vista coherente.
- Toca un objeto para seleccionarlo y arrástralo con el dedo o el mouse para moverlo. Puedes organizar los juguetes, el sofá, el armario, la mesita, el cuadro, las plantas y el banco del jardín.
- Pulsa **Usar** sobre un objeto seleccionado para cuidar a Nubi, regar Arcoflor, pintar, activar música o abrir la sorpresa. **Volver a su lugar** restaura su posición inicial.
- Selecciona el **Armario** y pulsa **Abrir armario**: arrastra las prendas entre espacios, o toca origen y destino. Selecciona una prenda y pulsa **Poner a…** para vestir a tu personaje.
- El personaje puede recorrer el escenario visible completo; los límites evitan que salga de pantalla.
- Cambia de protagonista en la bandeja inferior. Usa **Aventuras** para ver los objetos y recuerdos. El juego de memoria se abre desde **Memoria**.

Personajes y recuerdos se conservan en `localStorage` por navegador y origen. Los logros del minijuego se guardan aparte. No se sincronizan entre dispositivos ni entre las URLs de preview y producción. La apariencia de los personajes y el progreso existentes se conservan al actualizar. Las posiciones de objetos y la organización del armario también se guardan. La posición de cada personaje se guarda por separado en la casa, cocina, dormitorio y jardín al soltarlo o cuando termina de caminar. La última habitación también se recupera al recargar. La música y el dibujo del caballete se reinician al recargar. Si el almacenamiento está bloqueado, se avisa y el juego sigue funcionando durante la sesión.

## Pantalla de juego

No hay cabeceras de sitio, barras laterales, tarjetas de presentación ni desplazamiento de página en el mundo. Los controles se superponen al escenario. El tamaño del dibujo se adapta con ResizeObserver sin estirar los personajes, y funciona en vertical y horizontal.

En navegadores compatibles, el botón de pantalla completa oculta la interfaz del navegador. En celular también puedes añadir EmiVerse a la pantalla de inicio: el manifiesto solicita modo de aplicación. No se fuerza la orientación ni se bloquea el zoom accesible. Es necesario tener conexión para cargar: no se implementa juego offline.

## Diseño y alcance

Personajes, mascota, fondos, ilustración y melodía creados para este proyecto. No se usan personajes ni recursos de Avatar World. Los emojis son símbolos nativos del dispositivo. Sin fuentes remotas, imágenes externas, publicidad ni rastreadores.

La casa tiene cuatro zonas conectadas: casita, cocina, dormitorio y jardín, además de cinco interacciones y un minijuego. No incluye multijugador, físicas, obstáculos sólidos ni cuentas. El armario tiene seis espacios para cinco prendas y accesorios; no es un inventario general de objetos. Se puede caminar por el área de juego y las interacciones se activan al tocar un objeto, sin requisito de proximidad.

## Publicar y aprobar desde el celular

Consulta [la guía paso a paso](docs/PUBLICAR-DESDE-CELULAR.md). Incluye Vercel con vistas previas por pull request y GitHub Pages para producción, sin terminal local.

GitHub Actions compila y ejecuta las pruebas unitarias en cada pull request y cambio a `main`. El workflow `.github/workflows/deploy.yml` publica automáticamente cada cambio de `main` en GitHub Pages y permite ejecuciones manuales. Vite usa `base: '/emiverse/'` para cargar los recursos bajo la ruta del repositorio. La configuración alternativa de Vercel usa `--base=/`. Los tests Playwright se ejecutan en el entorno de desarrollo; no se anuncian como parte de CI.

No se considera publicada una versión hasta abrir su URL y verificar el juego.

## Arquitectura y mantenimiento

Consulta [ARQUITECTURA.md](docs/ARQUITECTURA.md): separación de dominio, aplicación, infraestructura, componentes de habitación/armario y controles de entrada. El guardado utiliza un contrato de repositorio inyectado; las reglas de organización son independientes del navegador.
