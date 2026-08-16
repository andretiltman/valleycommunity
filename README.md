# Valley Community

The Valley is a group of small coastal towns situated on the southernmost
tip of South Africa. This is the open repo behind the community's website
and WhatsApp groups.

Repo: https://github.com/valleycommunity/valleycommunity

## Groups

- **Announcement group (Main Group):** https://chat.whatsapp.com/CIU1zbOdx4i7CuKqRQPb2a
- **Chat Group:** https://chat.whatsapp.com/FlMuCSpyfqsH3lFpOtLCqf?s=cl&p=a&mlu=0&ilr=0
- **Buy and Sell:** https://chat.whatsapp.com/FzwOR5R8HIaL66ZxbYNmmL

## Website / PWA

`index.html` is an installable PWA (manifest + service worker) meant to be served
with GitHub Pages: Settings → Pages → deploy from the `main` branch, root folder.
Once enabled, visitors can "Add to Home Screen" on mobile to install it like an app.

Live site: https://valleycommunity.github.io/valleycommunity/

## Adding a Listing

Every listing on the site — businesses, services, emergency services, music
artists/venues — is added by submitting a pull request. There's no
membership or login: anyone can propose a listing, and a maintainer reviews
and merges it before it goes live. You can do the whole thing from a browser,
no git install or local setup required:

1. Pick the section that matches what you're adding (Business, Service
   Provider, Emergency Service, or Music — see below) and open its
   `README.md` for the exact entry format and required fields.
2. In that section's listings folder, use GitHub's **Add file → Create new
   file** button, type the new file's path (e.g.
   `businesses/listings/green-valley-bakery.json`), and paste in the filled-out
   JSON based on that folder's `_template.json`.
3. Open that folder's `index.json`, click the pencil (✏️) icon to edit it, and
   add your new file's name (without the `.json` extension) to the list.
4. For both changes, when GitHub asks how to commit, choose "Create a new
   branch for this commit and start a pull request", then open the pull
   request.
5. A maintainer reviews and merges the pull request — once merged, the
   listing appears on the live site automatically.

## Business Listings

Local business listings live under [`businesses/`](./businesses) — see that
folder's README for the listing format and how to add one. Listings with an
`area` set can also be browsed by area on the [Areas](./areas.html) page.

## Service Providers

Plumbers, handymen and other tradespeople without a fixed premises live
under [`services/`](./services) and are browsable on the
[Services](./services.html) page — see that folder's README for the entry
format and how to add one.

## Emergency Services

Emergency services contacts (police, fire, medical, etc.) live under
[`emergency-services/`](./emergency-services) — see that folder's README for
the entry format and how to add one.

## Music

Local artists and venues live under [`music/`](./music) and are browsable on
the [Music](./music.html) page — see that folder's README for the entry
format and how to add one.
