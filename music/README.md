# Music

This directory stores local artist and venue listings for the Valley
Community's Music section (`../music.html`).

- [`artists/`](./artists) — local musicians, bands and performers.
- [`venues/`](./venues) — places that host live music (bars, restaurants, halls, etc.).

Each entry is a single JSON file, named after the artist or venue
(lowercase, hyphen-separated), e.g. `artists/the-fish-hoek-four.json`.

## Artist format

```json
{
  "name": "Artist or band name",
  "genre": "e.g. Acoustic, Rock, Jazz",
  "description": "One or two sentences about the artist.",
  "contact": {
    "phone": "+27 00 000 0000",
    "whatsapp": "https://wa.me/27000000000",
    "email": "optional@example.com"
  },
  "area": "e.g. Fish Hoek",
  "website": "https://optional-website.example.com",
  "socials": {
    "instagram": "https://instagram.com/optional",
    "facebook": "https://facebook.com/optional",
    "youtube": "https://youtube.com/optional",
    "spotify": "https://open.spotify.com/optional"
  }
}
```

Only `name` and `description` are required — omit any field that doesn't apply.

## Venue format

```json
{
  "name": "Venue name",
  "description": "One or two sentences about the venue.",
  "contact": {
    "phone": "+27 00 000 0000",
    "whatsapp": "https://wa.me/27000000000",
    "email": "optional@example.com"
  },
  "address": "Street, area",
  "area": "e.g. Fish Hoek",
  "mapLink": "https://maps.app.goo.gl/optional-google-maps-link",
  "website": "https://optional-website.example.com"
}
```

Only `name` and `description` are required — omit any field that doesn't apply.

## Adding an entry

1. Copy [`artists/_template.json`](./artists/_template.json) or
   [`venues/_template.json`](./venues/_template.json).
2. Rename it to match the artist/band or venue name (lowercase, hyphens
   instead of spaces).
3. Fill in the details and remove any fields you don't need.
4. Add the file name (without `.json`) to that folder's `index.json`.
5. Open a pull request.
