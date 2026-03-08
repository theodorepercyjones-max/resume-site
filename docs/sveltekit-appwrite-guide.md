# SvelteKit + Appwrite Sites + Skeleton UI — Development & Deployment Guide

A reusable reference for building and deploying SvelteKit apps with Appwrite as the backend-as-a-service, hosted on Appwrite Sites.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | SvelteKit (Svelte 5) | Full-stack JS framework (SSR + client) |
| Backend | Appwrite Cloud | Database, auth, storage (BaaS) |
| Hosting | Appwrite Sites | SSR hosting via adapter-node |
| Styling | Tailwind CSS v4 + Skeleton UI v4 | Utility CSS + component library |
| Rich Text | Tiptap | Extensible rich text editor |
| VCS | Git + GitHub | Source control + CI/CD trigger |

---

## Project Setup

### Scaffold SvelteKit

```bash
npx sv create my-app --no-add-ons
cd my-app
npm install
```

### Install Dependencies

```bash
# Appwrite SDKs
npm install node-appwrite appwrite

# Styling
npm install @skeletonlabs/skeleton @skeletonlabs/skeleton-svelte
npm install -D tailwindcss @tailwindcss/vite @tailwindcss/typography

# Rich text (optional)
npm install @tiptap/core @tiptap/starter-kit @tiptap/extension-link @tiptap/pm
```

### Switch to adapter-node

Appwrite Sites requires `adapter-node` for SSR apps:

```bash
npm install -D @sveltejs/adapter-node
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-node';

const config = {
  kit: {
    adapter: adapter()
  }
};
export default config;
```

### Configure Vite

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

### CSS Setup

```css
/* src/app.css */
@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton-svelte';

@custom-variant dark (&:is(.dark *));
```

**Important:** Do NOT import Skeleton theme CSS files (e.g., `@skeletonlabs/skeleton/themes/cerberus.css`). The base `@skeletonlabs/skeleton` import is sufficient. Theme CSS imports fail during Tailwind's CSS processing in v4.

---

## Environment Variables

### CRITICAL: Use `$env/dynamic/*` on Appwrite Sites

Appwrite Sites injects environment variables at **runtime only** (into `process.env`), NOT at build time. This means:

- **`$env/static/private`** and **`$env/static/public`** → **WILL NOT WORK** (these read env vars at Vite build time)
- **`$env/dynamic/private`** and **`$env/dynamic/public`** → **USE THESE** (these read from `process.env` at runtime)

```typescript
// Server-side: src/lib/server/appwrite.ts
import { env } from '$env/dynamic/private';       // APPWRITE_API_KEY, APPWRITE_DATABASE_ID
import { env as publicEnv } from '$env/dynamic/public';  // PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID
```

```typescript
// Client-side: src/lib/appwrite.ts
import { env } from '$env/dynamic/public';  // PUBLIC_* vars only
```

### Variable Naming Convention

SvelteKit enforces a naming convention:
- `PUBLIC_` prefix → accessible on both server and client (`$env/dynamic/public`)
- No prefix → server-only (`$env/dynamic/private`)

### Required Variables

| Variable | Scope | Example |
|----------|-------|---------|
| `PUBLIC_APPWRITE_ENDPOINT` | Public | `https://nyc.cloud.appwrite.io/v1` |
| `PUBLIC_APPWRITE_PROJECT_ID` | Public | `69aca87c001009f7865d` |
| `APPWRITE_API_KEY` | Private | `standard_6daeccce...` |
| `APPWRITE_DATABASE_ID` | Private | `resume_db` |
| `ADMIN_EMAIL` | Private | `user@example.com` |

### Local Development

Create a `.env` file (gitignored) in the project root. SvelteKit/Vite loads it automatically.

### Appwrite Sites

Set env vars in: **Appwrite Console → Sites → Your Site → Settings → Environment Variables**

**Watch for trailing spaces in variable names!** The Appwrite Console input doesn't trim whitespace. A variable named `PUBLIC_APPWRITE_PROJECT_ID ` (with trailing space) is different from `PUBLIC_APPWRITE_PROJECT_ID` and will silently fail.

---

## Appwrite SDK Usage

### Two SDKs

Appwrite provides two separate npm packages:

| Package | Where | Purpose |
|---------|-------|---------|
| `node-appwrite` | Server-side only | Database CRUD, uses API key for auth |
| `appwrite` | Client-side only | User auth (magic link, OAuth, etc.) |

### Server-Side Client (node-appwrite)

```typescript
// src/lib/server/appwrite.ts
import { Client, Databases, Query } from 'node-appwrite';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

function getClient() {
  const client = new Client();
  client
    .setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
    .setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);
  return client;
}

function getDb() {
  return new Databases(getClient());
}

// Example: list documents with ordering
export async function getItems() {
  const db = getDb();
  try {
    const result = await db.listDocuments(env.APPWRITE_DATABASE_ID, 'collection_id', [
      Query.orderAsc('sort_order'),
      Query.limit(100)
    ]);
    return result.documents;
  } catch (e) {
    console.error('getItems error:', e);
    return [];
  }
}
```

**Important:** The database ID must be read at call time (inside functions), not at module level, because `$env/dynamic/*` values aren't available during module initialization on Appwrite Sites.

### Client-Side Client (appwrite)

```typescript
// src/lib/appwrite.ts
import { Client, Account } from 'appwrite';
import { env } from '$env/dynamic/public';

let client: Client;

export function getClient() {
  if (!client) {
    client = new Client();
    client.setEndpoint(env.PUBLIC_APPWRITE_ENDPOINT).setProject(env.PUBLIC_APPWRITE_PROJECT_ID);
  }
  return client;
}

export function getAccount() {
  return new Account(getClient());
}
```

---

## Appwrite Database Gotchas

### Attribute Names

Appwrite has restrictions on attribute names. It may reject names with underscores in certain positions. If creation fails, try a concatenated name:
- `job_title` → might be rejected → use `jobtitle` instead

### Indexes Are Required for Queries

**Any `Query.orderAsc()`, `Query.orderDesc()`, `Query.equal()`, etc. requires a corresponding index on the collection.** Without an index, the query fails silently (throws an exception caught by try/catch).

Create indexes via the Appwrite Console or API:

```bash
curl -X POST "https://nyc.cloud.appwrite.io/v1/databases/{DB_ID}/collections/{COLLECTION_ID}/indexes" \
  -H "X-Appwrite-Project: {PROJECT_ID}" \
  -H "X-Appwrite-Key: {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"key": "sort_order_asc", "type": "key", "attributes": ["sort_order"], "orders": ["ASC"]}'
```

### Collection Permissions

For a public-facing site with admin-only editing:
- **Any** role: Read
- **Users** role: Create, Read, Update, Delete

Set these in: **Appwrite Console → Database → Collection → Settings → Permissions**

### Document IDs

Use `'unique()'` as the document ID when creating to let Appwrite auto-generate IDs:

```typescript
db.createDocument(DB_ID, COLLECTION_ID, 'unique()', data);
```

---

## Authentication (Magic Link)

### Flow

1. User enters email on login page
2. Client-side SDK calls `account.createMagicURLToken()`
3. User clicks link in email → redirected to `/auth/callback?userId=...&secret=...`
4. Server-side callback creates session, stores in httpOnly cookie
5. Admin routes check for cookie in layout server load

### Login Page (Client-Side)

```typescript
const account = getAccount();
await account.createMagicURLToken(
  'unique()',
  email,
  `${window.location.origin}/auth/callback`
);
```

### Callback (Server-Side)

```typescript
// src/routes/auth/callback/+page.server.ts
import { Client, Account } from 'node-appwrite';

const client = new Client();
client.setEndpoint(env.PUBLIC_APPWRITE_ENDPOINT).setProject(env.PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const session = await account.createSession(userId, secret);

cookies.set('session', JSON.stringify({
  userId,
  sessionId: session.$id,
  secret: session.secret
}), {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: false,  // set to true in production with HTTPS
  maxAge: 60 * 60 * 24 * 7
});
```

### Auth Guard

```typescript
// src/routes/admin/+layout.server.ts
import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
  const session = cookies.get('session');
  if (!session) redirect(302, '/auth/login');
};
```

### Appwrite Console Setup

1. **Auth → Settings → Security**: Enable Magic URL authentication
2. **Overview → Integrations → Platforms**: Add a Web platform with your domain (e.g., `resume-site-theodore.appwrite.network`)

---

## Svelte 5 Patterns

### Props and Reactivity

Svelte 5 uses runes (`$props`, `$state`, `$derived`) instead of Svelte 4's reactive declarations.

```svelte
<script lang="ts">
  // Props from server load function
  let { data } = $props();

  // Derived values (reactive — updates when data changes)
  let fullName = $derived(data.profile?.full_name || 'Default');

  // Local state
  let openSection = $state<string | null>('profile');
</script>
```

**Avoid destructuring props into `const`** — this captures the initial value and triggers `state_referenced_locally` warnings:

```svelte
<!-- BAD: captures initial value only -->
const { profile, workExperiences } = data;

<!-- GOOD: access via data.property (reactive) -->
{#each data.workExperiences as exp}
```

### Form Actions

SvelteKit form actions handle CRUD without client-side JS:

```typescript
// +page.server.ts
export const actions: Actions = {
  updateProfile: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('full_name') as string;
    // ... call Appwrite
    return { message: 'Saved!' };
  }
};
```

```svelte
<!-- +page.svelte -->
<form method="POST" action="?/updateProfile" use:enhance>
  <input name="full_name" value={data.profile?.full_name || ''} />
  <button type="submit">Save</button>
</form>
```

### A11y Labels

Svelte 5 enforces `a11y_label_has_associated_control`. Every `<label>` must be associated with a form control:

```svelte
<!-- Option 1: for/id pair -->
<label for="name">Name</label>
<input id="name" name="name" />

<!-- Option 2: for dynamic IDs in loops -->
<label for="field-{item.$id}">Field</label>
<input id="field-{item.$id}" name="field" />

<!-- Option 3: use <span> for labels that can't associate (e.g., wrapping a custom component) -->
<span class="label-style">Description</span>
<TiptapEditor name="description" content="" />
```

---

## Tiptap Rich Text Editor

### Component Pattern

```svelte
<!-- src/lib/components/TiptapEditor.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';

  let props: {
    content?: string;
    name: string;
    onupdate?: (html: string) => void;
  } = $props();

  let element: HTMLDivElement;
  let editor = $state<Editor | undefined>(undefined);
  let internalHtml = $state(props.content || '');
  let hiddenValue = $derived(internalHtml);

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({ heading: false, codeBlock: false, blockquote: false, horizontalRule: false, code: false }),
        Link.configure({ openOnClick: false })
      ],
      content: props.content || '',
      onTransaction: () => { editor = editor; },
      onUpdate: ({ editor: e }) => {
        internalHtml = e.getHTML();
        props.onupdate?.(internalHtml);
      }
    });
  });

  onDestroy(() => { editor?.destroy(); });
</script>

<div bind:this={element}></div>
<input type="hidden" name={props.name} value={hiddenValue} />
```

Key points:
- Uses a hidden `<input>` to sync HTML content for form submission
- `editor` must be `$state` for toolbar reactivity
- Content initialization is intentionally one-time (editor manages its own state)

---

## Deployment to Appwrite Sites

### Prerequisites

1. GitHub repo (Appwrite Sites connects to GitHub)
2. Appwrite Cloud project
3. `adapter-node` configured in `svelte.config.js`

### Steps

1. **Appwrite Console → Sites → Create Site → Connect Git Repository**
2. Select your GitHub repo and branch (`main`)
3. Build settings (auto-detected for SvelteKit):
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `build`
4. **Add environment variables** — all 5 vars listed above
5. Deploy

### Auto-Deploy

Every push to the connected branch triggers a rebuild and redeploy automatically.

### Troubleshooting Deployment

| Symptom | Cause | Fix |
|---------|-------|-----|
| Build fails: "X is not exported by $env/static/public" | `$env/static/*` can't read env vars at build time on Appwrite Sites | Switch to `$env/dynamic/*` |
| Data loads locally but not deployed | Missing Appwrite database indexes | Create indexes for all `Query.orderAsc/orderDesc/equal` fields |
| Data returns null/empty on deployed site | Env var name has trailing space or typo | Delete and recreate the env var in Appwrite Console |
| Profile loads but lists don't | Lists use `Query.orderAsc('sort_order')` which requires an index | Create a `key` index on `sort_order` for each collection |
| 404 on API routes | Old deployment cached; new build not deployed yet | Wait for build to finish; check build logs |
| Auth callback fails | Site domain not added to Appwrite Web Platform | Add domain in Console → Overview → Integrations → Platforms |

### Debug Endpoint (Temporary)

Add this to verify env vars and data loading on the deployed server:

```typescript
// src/routes/api/debug/+server.ts
import { json } from '@sveltejs/kit';

export async function GET() {
  return json({
    processEnv: {
      hasApiKey: !!process.env.APPWRITE_API_KEY,
      databaseId: process.env.APPWRITE_DATABASE_ID || 'MISSING',
      endpoint: process.env.PUBLIC_APPWRITE_ENDPOINT || 'MISSING',
      projectId: process.env.PUBLIC_APPWRITE_PROJECT_ID || 'MISSING'
    },
    allAppwriteKeys: Object.keys(process.env).filter(k => k.includes('APPWRITE'))
  });
}
```

**Remove this endpoint before going to production** — it exposes configuration details.

---

## Appwrite Sites Built-in Environment Variables

Appwrite Sites automatically injects these variables at runtime (no need to set them):

| Variable | Description |
|----------|-------------|
| `APPWRITE_SITE_NAME` | Site name |
| `APPWRITE_SITE_ID` | Site ID |
| `APPWRITE_SITE_PROJECT_ID` | Project ID (alternative to setting your own) |
| `APPWRITE_SITE_API_ENDPOINT` | API endpoint (alternative to setting your own) |
| `APPWRITE_REGION` | Deployment region |
| `APPWRITE_VERSION` | Appwrite version |
| `APPWRITE_VCS_COMMIT_HASH` | Git commit hash of current deployment |
| `APPWRITE_VCS_REPOSITORY_BRANCH` | Git branch name |
| `APPWRITE_DEPLOYMENT_TYPE` | Deployment type |

You could use `APPWRITE_SITE_PROJECT_ID` and `APPWRITE_SITE_API_ENDPOINT` instead of setting custom env vars for the project ID and endpoint.

---

## Project Structure Reference

```
src/
  lib/
    server/appwrite.ts     # Server-side Appwrite (node-appwrite, API key)
    appwrite.ts            # Client-side Appwrite (auth only)
    components/
      TiptapEditor.svelte  # Rich text editor component
  routes/
    +page.server.ts        # Public page data loader
    +page.svelte           # Public page
    +layout.svelte         # Root layout (imports app.css)
    admin/
      +layout.server.ts    # Auth guard
      +layout.svelte       # Admin chrome
      +page.server.ts      # Admin form actions (CRUD)
      +page.svelte         # Admin dashboard
    auth/
      login/+page.svelte   # Magic link login form
      callback/+page.server.ts  # Session creation
      logout/+page.server.ts    # Session destruction
  app.css                  # Tailwind + Skeleton imports
  app.html                 # HTML shell
```

---

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build locally
```
