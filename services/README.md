# Service Listings

This directory stores listings for tradespeople and service providers who
work across the Valley rather than operating out of a fixed premises — e.g.
plumbers, handymen, electricians, IT support. For businesses with a physical
address, use [`../businesses/`](../businesses) instead.

Each service is a single JSON file inside [`listings/`](./listings), named
after the provider (lowercase, hyphen-separated), e.g. `listings/valley-it.json`.

## Listing format

```json
{
  "name": "Provider or business name",
  "category": "e.g. Plumber, Handyman, Electrician, IT Support",
  "description": "One or two sentences about the service offered.",
  "featured": false,
  "contact": {
    "phone": "+27 00 000 0000",
    "whatsapp": "https://wa.me/27000000000",
    "email": "optional@example.com"
  },
  "website": "https://optional-website.example.com",
  "hours": "e.g. Mon-Fri 08:00-17:00, or Available 24/7",
  "tags": ["plumbing", "emergency callouts"]
}
```

Only `name`, `category` and `description` are required — omit any field that
doesn't apply. There's no `address` or `area` field: service providers are
assumed to cover the whole Valley, so every listing shows up regardless of
where the enquiry comes from.

Set `featured` to `true` to showcase a listing: it gets a green outline
everywhere it's listed, and appears first (ahead of alphabetical order).

## Adding a listing

1. Copy [`listings/_template.json`](./listings/_template.json).
2. Rename it to match the provider's name (lowercase, hyphens instead of spaces).
3. Fill in the details and remove any fields you don't need.
4. Add the file name (without `.json`) to [`listings/index.json`](./listings/index.json).
5. Open a pull request.

## Logos

A listing can have its own logo shown in place of the generic Valley
Community icon on its detail page (`service.html?id=...`). Add an image to
`logos/` (create the folder if it doesn't exist yet) named after the
listing's file name — e.g. `listings/valley-it.json` → `logos/valley-it.jpg`
(`.png`/`.webp` also work).

Services without a logo show an icon representing their `category` instead
(see `SERVICE_CATEGORY_ICONS` in `service-category-icons.js`), falling back
to 🧰 for categories without a specific icon.
