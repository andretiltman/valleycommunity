# Services Directory

This directory stores local service provider listings for the Valley
Community — tradespeople and services like IT, painting, and handyman work,
as opposed to shops with a physical location (see [`businesses/`](../businesses)
for those).

Each service is a single JSON file inside [`listings/`](./listings), named
after the business/provider (lowercase, hyphen-separated), e.g.
`listings/paintit.json`.

## Listing format

```json
{
  "name": "Service or business name",
  "contactPerson": "Optional individual's name",
  "category": "e.g. IT, Painting, Handyman",
  "description": "One or two sentences about the service.",
  "contact": {
    "phone": "+27 00 000 0000",
    "whatsapp": "https://wa.me/27000000000",
    "email": "optional@example.com"
  },
  "area": "e.g. Fish Hoek",
  "website": "https://optional-website.example.com",
  "hours": "Mon-Fri 08:00-17:00",
  "tags": ["renovations", "waterproofing"]
}
```

Only `name`, `category` and `description` are required — omit any field that
doesn't apply.

## Adding a listing

1. Copy [`listings/_template.json`](./listings/_template.json).
2. Rename it to match the service (lowercase, hyphens instead of spaces).
3. Fill in the details and remove any fields you don't need.
4. Add the file name (without `.json`) to [`listings/index.json`](./listings/index.json).
5. Open a pull request.
