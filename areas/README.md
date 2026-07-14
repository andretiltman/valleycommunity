# Header Banners

This directory stores the banner image shown behind the header on every page
(`banners/default.jpg`), plus optional per-area overrides used on an area's
page (`area.html?name=...`).

## Replacing the default banner

Overwrite [`banners/default.jpg`](./banners/default.jpg) with a new image of
the same name — no code changes needed. It's used as the header background
on every page.

## Adding or replacing an area-specific banner

1. Name your image after the area, lowercased with punctuation removed and
   spaces turned into hyphens, e.g.:
   - `Fish Hoek` → `banners/fish-hoek.jpg`
   - `Simon's Town` → `banners/simons-town.jpg`
   - `Ocean View` → `banners/ocean-view.jpg`
2. Use `.jpg`, `.png`, or `.webp`.
3. Drop the file into [`banners/`](./banners). If a banner with that name
   already exists, it's simply overwritten — no code changes needed.
4. Open a pull request.

On `area.html`, the page tries `.jpg`, then `.png`, then `.webp` for the
current area's slug, and falls back to the default banner if none exist.
