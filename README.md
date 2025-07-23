# Hidden Number Voting (Netlify Blobs)

Quick instructions:

1. Push this folder (NOT its parent) to Git.
2. In Netlify:
   * **Add new site → Import from Git**
   * Build command: *leave blank*
   * Publish directory: **public** (already set in `netlify.toml`)
3. Deploy – functions live at `netlify/functions/*` and the UI at `/`.

Troubleshooting 404:
* If root path 404 → ensure `publish` points to `public/`.
* If `/.netlify/functions/state` 404 → check that `netlify/functions/` is in repo root (same level as `public`).
