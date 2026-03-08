# SvelteKit + Appwrite Sites Agent Prompt

You are building a SvelteKit SSR web app with Appwrite Cloud as the backend, hosted on Appwrite Sites. Follow these rules exactly.

## Tech Stack

- SvelteKit (Svelte 5, TypeScript), `adapter-node`
- Appwrite Cloud (`node-appwrite` server-side, `appwrite` client-side)
- Tailwind CSS v4 + Skeleton UI v4
- Git + GitHub, deployed via Appwrite Sites (auto-deploy on push)

## Project Structure

```
src/
  lib/
    server/appwrite.ts     # Server SDK (node-appwrite, API key) — DB CRUD + auth helpers
    appwrite.ts            # Client SDK (appwrite) — auth only
    components/            # Reusable Svelte components
  routes/
    +layout.svelte         # Root layout (imports app.css)
    +page.server.ts        # Public data loader
    +page.svelte           # Public page
    admin/
      +layout.server.ts    # Auth guard (session + team membership check)
      +page.server.ts      # Form actions (CRUD)
      +page.svelte         # Admin dashboard
    auth/
      login/               # Email validation + magic link trigger
      callback/            # Client-side session creation (team verified server-side)
        set-session/       # Server endpoint to persist session cookie
      logout/              # Session revocation + cookie cleanup
  app.css                  # @import 'tailwindcss'; @import '@skeletonlabs/skeleton'; @import '@skeletonlabs/skeleton-svelte';
```

## Environment Variables — CRITICAL

Appwrite Sites injects env vars at **runtime only**. You MUST use `$env/dynamic/*`, never `$env/static/*`.

```ts
// Server: import { env } from '$env/dynamic/private';
// Client: import { env } from '$env/dynamic/public';
```

Read env vars inside functions, not at module top level — they aren't available during module init on Appwrite Sites.

| Variable | Scope | Example |
|----------|-------|---------|
| `PUBLIC_APPWRITE_ENDPOINT` | Public | `https://cloud.appwrite.io/v1` |
| `PUBLIC_APPWRITE_PROJECT_ID` | Public | `your-project-id` |
| `APPWRITE_API_KEY` | Private | `standard_xxxx...` |
| `APPWRITE_DATABASE_ID` | Private | `resume_db` |
| `ADMIN_TEAM_ID` | Private | `6xx...` (from Auth → Teams → Admins) |

Appwrite Sites also auto-injects `APPWRITE_SITE_PROJECT_ID` and `APPWRITE_SITE_API_ENDPOINT` (usable as alternatives).

Watch for **trailing spaces** in env var names in the Appwrite Console — they silently break lookups.

## Appwrite Database Rules

- **Indexes are required** for any `Query.orderAsc/orderDesc/equal` — without them, queries throw.
- Attribute names with underscores may be rejected (e.g. `job_title` → use `jobtitle`).
- Use `'unique()'` as the document ID for auto-generation.
- Permissions: Any=Read, Users=CRUD for a public site with admin editing.

## Authentication (Magic URL + Teams)

### Authorization via Appwrite Teams

Access is controlled by membership in an **Admins** team created in the Appwrite Console. Only users added to this team (via Console or server SDK) can access the admin UI. This replaces env-var-based email allowlisting — add/remove admins in the Console without redeploying.

Shared helpers in `src/lib/server/appwrite.ts`:
```ts
// Check if a user is in the Admins team
export async function isAdminTeamMember(userId: string): Promise<boolean> {
  const teams = new Teams(getAdminClient());
  const memberships = await teams.listMemberships(env.ADMIN_TEAM_ID, [
    Query.equal('userId', [userId])
  ]);
  return memberships.total > 0;
}

// Look up user by email
export async function findUserByEmail(email: string) {
  const users = new Users(getAdminClient());
  const result = await users.list([Query.equal('email', [email])]);
  return result.total > 0 ? result.users[0] : null;
}
```

### CRITICAL: Use Admin SDK for All Server-Side Auth

`node-appwrite`'s `client.setSession()` + `account.get()` **does not work on Appwrite Cloud** — returns `401 User (role: guests) missing scopes`. All server-side session operations must use the admin SDK (`Users`/`Teams` API with API key) instead.

### Security Model — Defense in Depth

The Appwrite project ID and endpoint are public. Anyone can call `createMagicURLToken()` directly against the API for any email. Therefore:

1. **Login form action** — verify user exists AND is in the Admins team (UX gate)
2. **Callback load** — re-verify team membership via admin SDK BEFORE passing credentials to the client for session creation
3. **Cookie set endpoint** — re-verify team membership AND session exists before persisting the cookie. **This is the real security boundary.**
4. **Auth guard** — validate session is active AND user is still in the Admins team on every admin request (so removing a user from the team instantly revokes access)

### Session Cookie Rules

```ts
cookies.set('session', JSON.stringify({ userId, sessionId, secret }), {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: !(url.hostname === 'localhost' || url.hostname === '127.0.0.1'),
  maxAge: 60 * 60 * 24 * 7
});
```

- **`httpOnly: true`** — always, prevents JS access
- **`secure`** — `true` in production, `false` only on localhost for dev
- **`sameSite: 'lax'`** — CSRF protection while allowing magic link redirects

### Auth Guard — Validate via Admin SDK

Never do this:
```ts
// BAD: any non-empty cookie value passes
if (!cookies.get('session')) redirect(302, '/auth/login');
```

Never do this either:
```ts
// BAD: setSession does NOT work with node-appwrite on Appwrite Cloud
client.setSession(parsed.secret);
const account = new Account(client);
await account.get(); // 401 — "User (role: guests) missing scopes"
```

Always do this:
```ts
// GOOD: use admin SDK to verify session exists AND team membership
import { getAdminClient, isAdminTeamMember } from '$lib/server/appwrite';

const users = new Users(getAdminClient());
const { sessions } = await users.listSessions(parsed.userId);
if (!sessions.some(s => s.$id === parsed.sessionId)) {
  throw new Error('Session not found');
}
if (!(await isAdminTeamMember(parsed.userId))) {
  throw new Error('Not a team member');
}
```

On failure, delete the cookie and redirect to login.

### Callback — Team Verification + Client-Side Session Creation

Session creation MUST happen in the user's browser (client-side SDK) so that Appwrite records the real user IP and user-agent. Creating sessions server-side with `node-appwrite` causes all sessions to show the server's IP in the Appwrite dashboard.

**Server load function (`+page.server.ts`)** — verify team membership, pass credentials to client:
```ts
import { isAdminTeamMember } from '$lib/server/appwrite';

// Verify user is in the Admins team BEFORE allowing session creation
if (!(await isAdminTeamMember(userId))) {
  redirect(302, '/auth/login?error=unauthorized');
}
// Return credentials to client (secret is already in the URL, single-use)
return { userId, secret };
```

**Client page (`+page.svelte`)** — create session in the browser:
```ts
import { getAccount } from '$lib/appwrite';
// Create session CLIENT-SIDE so Appwrite sees the real user
const account = getAccount();
const session = await account.createSession(userId, secret);
// POST session info to server to persist in httpOnly cookie
await fetch('/auth/callback/set-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId, sessionId: session.$id, secret: session.secret })
});
```

**Server endpoint (`set-session/+server.ts`)** — verify team membership, session, and set cookie:
```ts
import { getAdminClient, isAdminTeamMember } from '$lib/server/appwrite';

if (!(await isAdminTeamMember(userId))) return json({ error: 'Unauthorized' }, { status: 403 });
const users = new Users(getAdminClient());
const { sessions } = await users.listSessions(userId);
if (!sessions.some(s => s.$id === sessionId)) return json({ error: 'Not found' }, { status: 401 });
// Then set cookie with userId, sessionId, and secret
```

### Logout — Revoke via Admin SDK

Always invalidate the session on Appwrite before deleting the cookie:
```ts
const users = new Users(adminClient); // client with API key
await users.deleteSession(parsed.userId, parsed.sessionId);
cookies.delete('session', { path: '/' });
```

Wrap in try/catch — the session may already be expired.

### API Key Safety

- `APPWRITE_API_KEY` must ONLY be used in `.server.ts` files
- Import from `$env/dynamic/private` — SvelteKit blocks this from client bundles
- Never pass the API key to any client-side code or component props

### Appwrite Console Setup

1. Auth → Settings → Security: Enable Magic URL
2. Auth → Settings → Security → Users Limit: Set to current user count to block public signups
3. Overview → Integrations → Platforms: Add Web platform with your domain
4. Auth → Security → Session limit: Configure max concurrent sessions (default: 10)
5. Auth → Teams: Create "Admins" team, add authorized users as members
6. Set `ADMIN_TEAM_ID` env var to the Admins team ID

## Svelte 5 Patterns

- Use runes: `$props()`, `$state()`, `$derived()`
- Access data as `data.property`, don't destructure props into `const` (breaks reactivity)
- Form actions with `use:enhance` for CRUD without client-side JS
- Every `<label>` needs an associated control (`for`/`id` pair)

## Rendering Markdown/HTML

When using `marked` or similar to render user content via `{@html}`:
- If content is from trusted users only (e.g. single admin), this is acceptable without sanitization
- If content could come from untrusted users, pipe through `sanitize-html` or `isomorphic-dompurify` server-side before returning from load functions
- For external links, use `rel="noopener noreferrer"` with `target="_blank"`

## CSS Setup

```css
/* src/app.css */
@import 'tailwindcss';
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton-svelte';
@custom-variant dark (&:is(.dark *));
```

Do NOT import Skeleton theme CSS files — the base import is sufficient. Theme CSS imports break Tailwind v4 processing.

## Deployment Troubleshooting

| Symptom | Fix |
|---------|-----|
| Build fails re: `$env/static` | Switch to `$env/dynamic/*` |
| Data loads locally but not deployed | Create indexes for queried fields |
| Env vars return undefined | Check for trailing spaces in Console; read inside functions not module level |
| Auth callback fails | Add domain to Appwrite Web Platform |
| `setSession` + `account.get()` returns 401 | Use admin SDK (`Users` API with API key) instead — `setSession` does not work with `node-appwrite` on Appwrite Cloud |
| Login succeeds but admin redirects to login | Auth guard also needs admin SDK, not `setSession` |

## Commands

```bash
npm run dev      # Dev server
npm run build    # Production build (adapter-node)
npm run preview  # Preview build locally
```
