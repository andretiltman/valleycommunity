# Business Listings

This directory stores local business listings for the Valley Community.

Each business is a single JSON file inside [`listings/`](./listings), named after
the business (lowercase, hyphen-separated), e.g. `listings/green-valley-bakery.json`.

## Listing format

```json
{
  "name": "Business name",
  "category": "e.g. Bakery, Plumber, Spaza Shop",
  "description": "One or two sentences about the business.",
  "contact": {
    "phone": "+27 00 000 0000",
    "whatsapp": "https://wa.me/27000000000",
    "email": "optional@example.com"
  },
  "address": "Street, area",
  "website": "https://optional-website.example.com",
  "hours": "Mon-Fri 08:00-17:00",
  "tags": ["food", "delivery"]
}
```

Only `name`, `category` and `description` are required — omit any field that
doesn't apply.

## Adding a listing

1. Copy [`listings/_template.json`](./listings/_template.json).
2. Rename it to match the business name (lowercase, hyphens instead of spaces).
3. Fill in the details and remove any fields you don't need.
4. Open a pull request.
