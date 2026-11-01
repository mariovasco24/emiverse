# Trabajar y publicar EmiVerse desde el celular

Todo el ciclo puede hacerse con este chat y los sitios móviles de GitHub y Vercel. No necesitas una computadora, instalar Node ni usar una terminal local.

## 0. Primera versión integrada

El [PR #1](https://github.com/mariovasco24/emiverse/pull/1) está integrado en `main`. GitHub Pages está configurado con **GitHub Actions** como origen. No es necesario volver a crear ese PR ni integrar su rama.

## 1. Publicar por primera vez en Vercel (opción recomendada)

1. En el navegador del celular entra a Vercel e inicia sesión con GitHub.
2. Elige **Add New → Project**, importa `mariovasco24/emiverse` y autoriza el acceso al repositorio.
3. Selecciona **Vite**. La configuración ya indica `npm ci`, `npm run build -- --base=/` y salida `dist`. Usa Node 24 y rama de producción `main`. No necesitas variables ni secretos.
4. Pulsa **Deploy**. Espera a que el despliegue termine correctamente.
5. Abre la URL que Vercel te muestre. Comprueba que carga «EmiVerse — Created by Emily», crea un personaje, camina, cambia al jardín y recarga para comprobar el guardado.
6. Guarda la URL en tus favoritos o añádela a la pantalla de inicio (Safari: Compartir → Añadir a pantalla de inicio; Chrome: menú → Añadir a pantalla de inicio). El manifiesto permite abrir el juego en modo de aplicación, sin barra de dirección, cuando el navegador lo admite. Esta versión requiere conexión para cargar; no es una aplicación offline.

Conecta Vercel al repositorio una vez. Sus despliegues de vista previa permiten probar cada pull request en el celular antes de aprobarlo. Las vistas previas pueden requerir iniciar sesión en Vercel según la protección que configures. No compartas una URL como pública hasta comprobarla sin iniciar sesión.

## 2. Alternativa: GitHub Pages

1. En GitHub, abre el repositorio → **Settings → Pages**. Si no ves la opción en móvil, activa «Sitio de escritorio» en el navegador.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Integra el pull request en `main`. El workflow **Publicar EmiVerse en GitHub Pages** (`.github/workflows/deploy.yml`) ejecutará las pruebas, compilará con la base `/emiverse/` definida en Vite y desplegará `dist`. Cada cambio integrado en `main` genera automáticamente un nuevo despliegue.
4. Revisa la ejecución en la pestaña **Actions**. Si necesitas repetirla, abre el workflow y pulsa **Run workflow** sobre `main`.
5. Abre la URL que aparezca en la sección `github-pages` del despliegue. Para este repositorio, la dirección prevista es `https://mariovasco24.github.io/emiverse/`; es solo una dirección prevista hasta comprobar un despliegue real.

El repositorio debe tener Pages disponible en tu plan de GitHub. El workflow no modifica por sí mismo la configuración de Pages. Las credenciales `GITHUB_TOKEN` e identidad OIDC de Actions se generan automáticamente; no pegues tokens en archivos.

## 3. Pedir, probar y aprobar nuevas funcionalidades

1. Escribe en este chat lo que quieres: por ejemplo, «Añade una cocina donde Emily pueda preparar cupcakes».
2. Pide que el cambio se prepare en una rama y un pull request. El asistente ejecutará pruebas y compartirá el resultado y los límites pendientes.
3. Abre el PR desde el celular. Comprueba la marca verde de **Verificar EmiVerse**.
4. Si conectaste Vercel, abre su enlace **Preview** en el PR. Prueba los controles táctiles, el nuevo contenido y el guardado en tu celular. Si algo falla, descríbelo aquí antes de integrar.
5. Cuando estés conforme, aprueba el PR y pulsa **Merge pull request**. Eso dispara el despliegue de producción en Vercel o Pages.
6. Espera a que termine, abre la URL de producción y verifica la nueva función. Solo entonces considérala publicada.

GitHub Pages en esta configuración tiene una URL de producción; no crea una vista previa diferente por PR. Para revisar cambios antes de integrarlos desde el celular, usa las vistas previas de Vercel.

## 4. Recuperar una versión

Desde la página del PR integrado, usa **Revert** si está disponible y crea un PR de reversión. Al integrarlo, se volverá a desplegar. En Vercel también puedes promover un despliegue anterior desde su panel, según los permisos de tu cuenta.

## Datos y privacidad

El progreso se guarda en el navegador que usas, asociado a la URL. Una vista previa y producción guardan datos separados. Borrar los datos del sitio elimina los personajes y recuerdos. No se envían a un servidor. No uses información sensible como nombre de personaje.
