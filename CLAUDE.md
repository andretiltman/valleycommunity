# CLAUDE.md

Context for PilotBot (and any other AI assistant) working in this repository.

## What this is

A static website + installable PWA for the Valley Community — a group of
small coastal towns situated on the southernmost tip of South Africa.
Vanilla HTML/CSS/JS, no build step, no framework, no `package.json`. It's
designed to be trivial to host: point GitHub Pages at the `main` branch
root and it just works.

## Hosting

- GitHub Pages, deployed from `main`, root folder (Settings → Pages).
- `.nojekyll` disables Jekyll processing — required because listing
  directories use `_template.json` filenames, which Jekyll ignores by
  default.
- All asset paths are relative (`./`), so the site works unmodified whether
  it's served at the root of a domain or under a project-pages subpath
  (`https://<org>.github.io/<repo>/`).
- No CNAME — served from the default `github.io` address unless one is
  added later.
- Repo: https://github.com/valleycommunity/valleycommunity

## Data model: the generic listing template

Every content section (businesses, services, emergency services, music
artists/venues, ...) follows the same reusable pattern. When adding a new
content type, replicate this rather than inventing a new structure:

```
<section>/
  README.md               # human-facing docs: entry format + how to add one
  <items>/
    _template.json         # blank entry with every field, for copy-paste
    index.json              # array of file names (no .json) that are "live"
    <entry-name>.json       # one file per entry, lowercase-hyphenated
```

- A page (`<section>.js` / `<section>.html`) reads `index.json`, fetches
  each listed entry's JSON, and renders it. Entries not in `index.json` are
  ignored even if the file exists — this lets a contributor stage a listing
  before it goes live.
- Only a handful of fields are ever required (`name`, plus `category` or
  `genre`, plus `description`); everything else is optional and should be
  omitted from a real entry rather than left blank.
- Logos/images follow the same convention: an optional file in a sibling
  `logos/`/`banners/` folder named after the entry's file name, with the
  page falling back to a category icon or default image when it's absent.

Adding a new listing is always: copy `_template.json` → rename → fill in →
add to `index.json` → open a PR. Don't add a new required field to an
existing template without checking every page that reads it — the JS
renders directly off these JSON shapes; there's no schema/validation layer
in between.

## Conventions

- No build step: don't introduce bundlers, transpilers, or a `package.json`
  unless asked — the whole point is that it's just static files anyone can
  host.
- Keep new pages/scripts named `<thing>.html` / `<thing>.js`, matching the
  existing businesses/services/music/emergency-services pattern.
- The service worker (`sw.js`) caches an explicit `APP_SHELL` list and
  bumps `CACHE_NAME` (`valley-community-vNN`) on deploys that change cached
  files — bump it when editing anything in that list.
