# Resume Site - Theodore Jones

## Project Overview
Personal resume/portfolio site. SvelteKit frontend/backend, Appwrite BaaS (database, auth), Skeleton UI + Tailwind CSS, EasyMDE markdown editor.

## Tech Stack
- **Framework**: SvelteKit (Svelte 5, TypeScript)
- **Database/Auth**: Appwrite Cloud (NYC region)
- **Styling**: Tailwind CSS v4 + Skeleton UI v4
- **Markdown Editor**: EasyMDE (bold, italic, lists, links, preview) + marked (server-side rendering)
- **VCS**: Git + GitHub
- **Hosting**: Appwrite Sites (SSR via adapter-node)

## Project Structure
```
src/
  lib/
    server/appwrite.ts     # Server-side Appwrite (node-appwrite, API key)
    appwrite.ts            # Client-side Appwrite (auth)
    components/
      MarkdownEditor.svelte # EasyMDE markdown editor component
  routes/
    +page.server.ts        # Public page data loader
    +page.svelte           # Public resume page
    +layout.svelte         # Root layout (imports app.css)
    admin/
      +layout.server.ts    # Auth guard (cookie check)
      +layout.svelte       # Admin chrome (header, nav)
      +page.server.ts      # Admin data + form actions
      +page.svelte         # Admin dashboard (accordion sections)
    auth/
      login/               # Magic link login (client-side SDK)
      callback/            # Magic link callback (creates session cookie)
      logout/              # Clears session cookie
  app.css                  # Tailwind + Skeleton imports + custom theme vars
  app.html                 # HTML shell (Google Fonts)
```

## Commands
- **Dev server**: `npm run dev`
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Appwrite Notes
- Server-side uses `node-appwrite` (Databases API with API key)
- Client-side uses `appwrite` (Account API for magic link auth)
- Attribute name `jobtitle` (not `job_title` -- Appwrite rejected the underscore variant)
- Magic URL auth and Web Platform are console-only config
- Table permissions: Any=read, Users=CRUD
- Collections: profile, work_experience, freelance_work, education

## Key Conventions
- Markdown fields (summary, descriptions, details): EasyMDE editor, stored as markdown, rendered to HTML server-side via `marked`
- Short text fields (names, locations, dates): plain text inputs
- Freelance status: `accepting` or `not_accepting`
- Admin auth: Appwrite Magic URL (email link), session stored in httpOnly cookie
- Admin email: configured in `.env` as `ADMIN_EMAIL`
- Environment vars: `PUBLIC_` prefix for client-accessible, no prefix for server-only
