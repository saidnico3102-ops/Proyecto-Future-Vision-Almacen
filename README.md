This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Login simulado

Las cuentas de prueba para acceder a `/login` son:

| Rol | Usuario | Contraseña |
| --- | --- | --- |
| Encargado de Recepción | `recepcion` | `recepcion123` |
| Responsable de Despacho | `despacho` | `despacho123` |
| Encargado de Inventario | `inventario` | `inventario123` |
| Administrador | `admin` | `admin123` |

En producción, configura `AUTH_SECRET` con una clave aleatoria de al menos 32 bytes. Puedes generarla con `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. La aplicación falla explícitamente al firmar sesiones si esta variable no está configurada; el valor de desarrollo es solo para el login simulado local.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



#AGENTS

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