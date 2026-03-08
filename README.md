# Resume Site

A personal resume/portfolio site built with SvelteKit and Appwrite.

## Tech Stack

- **Framework**: SvelteKit (Svelte 5, TypeScript)
- **Backend**: Appwrite Cloud (database, magic link auth)
- **Styling**: Tailwind CSS v4 + Skeleton UI v4
- **Markdown**: EasyMDE editor + `marked` for server-side rendering
- **Hosting**: Appwrite Sites (SSR via `adapter-node`)

## Features

- Public resume page with work experience, freelance work, and education sections
- Admin dashboard with magic link authentication
- Markdown editing for rich text fields
- Server-side rendering

## Setup

1. Clone the repo and install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Appwrite credentials:

   ```sh
   cp .env.example .env
   ```

3. Set up Appwrite:
   - Create collections: `profile`, `work_experience`, `freelance_work`, `education`
   - Enable Magic URL auth in Auth settings
   - Add your domain as a Web Platform

4. Run the dev server:

   ```sh
   npm run dev
   ```

## Commands

```sh
npm run dev      # Dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Support

If you use this project for your own site, consider leaving a tip: [ko-fi.com/theopjones](https://ko-fi.com/theopjones)

## License

AGPL-3.0 -- see [LICENSE](LICENSE).
