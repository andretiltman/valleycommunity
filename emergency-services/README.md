# Emergency Services

This directory stores emergency services contacts for the Valley Community
(police, fire, medical, etc.).

Each entry is a single JSON file inside [`contacts/`](./contacts), named after
the service (lowercase, hyphen-separated), e.g. `contacts/fish-hoek-police.json`.

## Entry format

```json
{
  "name": "Service name",
  "category": "e.g. Police, Fire, Ambulance",
  "phone": "+27 00 000 0000",
  "address": "Street, area",
  "coordinates": { "lat": 0.0, "lng": 0.0 },
  "mapLink": "https://goo.gl/maps/example"
}
```

Only `name`, `category` and `phone` are required — omit any field that
doesn't apply.

## Adding an entry

1. Copy [`contacts/_template.json`](./contacts/_template.json).
2. Rename it to match the service name (lowercase, hyphens instead of spaces).
3. Fill in the details and remove any fields you don't need.
4. Add the file name (without `.json`) to [`contacts/index.json`](./contacts/index.json).
5. Open a pull request.
