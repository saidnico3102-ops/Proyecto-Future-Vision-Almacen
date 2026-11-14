<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
## Proyecto: Almacén Future Visions

Sistema web de almacén de zapatillas (curso de Ingeniería de Software).
Módulos: Inventario/Stock Central, Recepción, Despacho, Conteos y Ajustes.

- Idioma de la interfaz y mensajes: español.
- Roles: Encargado de Recepción, Responsable de Despacho, Encargado de Inventario (y Administrador, que aprueba ajustes).
- RNF de seguridad: cerrar la sesión tras 15 minutos de inactividad y redirigir a /login.
- Por ahora no hay base de datos: se usan datos simulados en `src/data/`.
- No cambiar el diseño existente del panel salvo que se pida.