# Area Banners

This directory stores optional banner images shown at the top of an area's
page (`area.html?name=...`).

## Adding or replacing a banner

1. Name your image after the area, lowercased with punctuation removed and
   spaces turned into hyphens, e.g.:
   - `Fish Hoek` → `banners/fish-hoek.jpg`
   - `Simon's Town` → `banners/simons-town.jpg`
   - `Ocean View` → `banners/ocean-view.jpg`
2. Use `.jpg`, `.png`, or `.webp`.
3. Drop the file into [`banners/`](./banners). If a banner with that name
   already exists, it's simply overwritten — no code changes needed.
4. Open a pull request.

The area page tries `.jpg`, then `.png`, then `.webp` for the current area's
slug, and just shows no banner if none of them exist.
