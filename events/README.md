# Events

This directory stores event flyer images, one subfolder per business, named
to match that business's listing file, e.g.
`businesses/listings/sandis-bistro.json` → `events/sandis-bistro/`.

## Adding an event

1. Create (or reuse) a folder here named after the business, e.g.
   `events/sandis-bistro/`.
2. Name the image `<anything>-<expiry date>.<ext>`, where the expiry date is
   the last day the event should be shown, in `YYYY-MM-DD` format, e.g.:
   - `events/sandis-bistro/busking-lineup-2026-07-31.jpg`
3. Use `.jpg` (`.png`/`.webp` also work).
4. Add the path (`folder/filename`) to [`index.json`](./index.json).
5. Open a pull request.

Once the expiry date passes, the event stops showing automatically — on both
the business's own page and the homepage — no need to remove the file or
its entry in `index.json`, though you're welcome to clean up old ones
whenever convenient.

## Where events show up

- The business's own detail page (`business.html?id=...`), under "Events".
- The homepage, under "Upcoming Events" — every currently active event
  across all businesses, in one vertically-scrolling list.
