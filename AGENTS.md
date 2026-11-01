# EmiVerse: flujo de trabajo acordado

- Mantener el juego utilizable y comprobable desde celulares y tablets.
- Preparar cada entrega en una rama y crear un pull request en GitHub.
- El usuario autorizó integrar los cambios verificados en `main` como flujo habitual, sin pedir confirmación de nuevo para esas acciones. Respetar cualquier instrucción posterior de esperar aprobación.
- Ejecutar las comprobaciones pertinentes antes de integrar. Revisar el estado del despliegue y abrir la URL de producción para verificar que el juego carga y funciona.
- Entregar enlaces al PR y al juego funcionando. Nunca presentar una URL prevista, un enlace localhost o una captura como un despliegue público verificado.
- Si permisos, red, credenciales o servicios impiden crear el PR, integrar o desplegar, completar el trabajo independiente y explicar con precisión el bloqueo y la acción necesaria. No afirmar que se completaron pasos bloqueados.
- Mantener la firma «EmiVerse — Created by Emily» y usar personajes y recursos originales.
- Documentación de publicación desde el celular: docs/PUBLICAR-DESDE-CELULAR.md.

## Código y arquitectura

- Mantener las reglas y los modelos en `src/domain`, sin dependencias de React ni APIs del navegador.
- Mantener los gestos y componentes de habitación/armario en sus features; reutilizar los adaptadores de entrada de `src/ui`.
- El acceso a almacenamiento debe implementar `WorldRepository`; inyectarlo en `useWorld`, sin usar localStorage directamente en componentes.
- Conservar las partidas existentes al añadir campos; probar la migración y validar los datos cargados.
- Ejecutar `npm run format` tras editar y comprobar `npm run format:check`, build y pruebas pertinentes antes de integrar.
- Ver `docs/ARQUITECTURA.md` para responsabilidades y reglas de extensión.
