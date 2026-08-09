#!/usr/bin/env python3
"""Generate static per-listing HTML pages with Open Graph meta tags.

Reads businesses/listings/*.json and services/listings/*.json and writes
one static HTML file per listing to businesses/<slug>.html and
services/<slug>.html. These pages exist purely so link crawlers that don't
execute JS (WhatsApp, Facebook, etc.) can render a proper preview card when
a listing URL is shared — the existing business.html/service.html?id=...
pages stay as the interactive, JS-rendered experience for humans and are
linked from the static page.

Run manually after adding/editing a listing:
    python3 scripts/generate_listing_pages.py
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_URL = "https://andretiltman.github.io/valleycommunity"
FALLBACK_IMAGE = f"{SITE_URL}/icons/icon-512.png"

KINDS = {
    "businesses": {"detail_page": "business.html", "logos_dir": "businesses/logos"},
    "services": {"detail_page": "service.html", "logos_dir": "services/logos"},
}

LOGO_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")


def truncate(text, limit=200):
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    return text[: limit - 1].rsplit(" ", 1)[0] + "…"


def find_logo(kind, slug):
    logos_dir = ROOT / KINDS[kind]["logos_dir"]
    for ext in LOGO_EXTENSIONS:
        candidate = logos_dir / f"{slug}{ext}"
        if candidate.exists():
            return f"{SITE_URL}/{KINDS[kind]['logos_dir']}/{slug}{ext}"
    return None


def render_contact_lines(listing):
    lines = []
    contact = listing.get("contact") or {}
    if listing.get("address"):
        area = f" ({listing['area']})" if listing.get("area") else ""
        lines.append(f"<p>📍 {html.escape(listing['address'])}{html.escape(area)}</p>")
    if contact.get("phone"):
        lines.append(f"<p>📞 {html.escape(contact['phone'])}</p>")
    if contact.get("whatsapp"):
        lines.append(
            f'<p>💬 <a href="{html.escape(contact["whatsapp"])}">WhatsApp</a></p>'
        )
    if listing.get("website"):
        lines.append(
            f'<p>🔗 <a href="{html.escape(listing["website"])}">{html.escape(listing["website"])}</a></p>'
        )
    if listing.get("hours"):
        lines.append(f"<p>🕒 {html.escape(listing['hours'])}</p>")
    if listing.get("tags"):
        tag_text = ", ".join(html.escape(t) for t in listing["tags"])
        lines.append(f'<p class="tags">{tag_text}</p>')
    return "\n    ".join(lines)


def render_page(kind, slug, listing):
    name = listing.get("name", slug)
    category = listing.get("category", "")
    description = listing.get("description", "")
    short_description = truncate(description) if description else f"{name} — {category}"
    image = find_logo(kind, slug) or FALLBACK_IMAGE
    canonical = f"{SITE_URL}/{kind}/{slug}.html"
    detail_link = f"../{KINDS[kind]['detail_page']}?id={slug}"

    title = html.escape(f"{name} · Valley Community")
    esc_name = html.escape(name)
    esc_category = html.escape(category)
    esc_short_description = html.escape(short_description)
    esc_description = html.escape(description) if description else ""

    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title>
<meta name="description" content="{esc_short_description}" />
<link rel="canonical" href="{canonical}" />

<meta property="og:type" content="website" />
<meta property="og:title" content="{esc_name}" />
<meta property="og:description" content="{esc_short_description}" />
<meta property="og:image" content="{image}" />
<meta property="og:url" content="{canonical}" />
<meta property="og:site_name" content="Valley Community" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{esc_name}" />
<meta name="twitter:description" content="{esc_short_description}" />
<meta name="twitter:image" content="{image}" />

<link rel="manifest" href="../manifest.webmanifest" />
<meta name="theme-color" content="#0f3a5c" />
<link rel="icon" href="../favicon.ico" sizes="any" />
<link rel="icon" href="../icons/icon-192.png" type="image/png" sizes="192x192" />
<link rel="apple-touch-icon" href="../icons/apple-touch-icon.png" />
<meta http-equiv="refresh" content="0; url={detail_link}" />
</head>
<body>
  <main class="listing-card">
    <img src="{image}" alt="{esc_name}" width="96" height="96" />
    <h1>{esc_name}</h1>
    <p class="category">{esc_category}</p>
    <p>{esc_description}</p>
    {render_contact_lines(listing)}
    <p><a href="{detail_link}">View full listing →</a></p>
  </main>
</body>
</html>
"""


def main():
    total = 0
    for kind in KINDS:
        listings_dir = ROOT / kind / "listings"
        out_dir = ROOT / kind
        for json_path in sorted(listings_dir.glob("*.json")):
            slug = json_path.stem
            if slug in ("index", "_template"):
                continue
            listing = json.loads(json_path.read_text())
            page = render_page(kind, slug, listing)
            out_path = out_dir / f"{slug}.html"
            out_path.write_text(page)
            total += 1
            print(f"wrote {out_path.relative_to(ROOT)}")
    print(f"\nGenerated {total} static listing pages.")


if __name__ == "__main__":
    main()
