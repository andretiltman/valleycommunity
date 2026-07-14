function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function parseEventPath(path) {
  const match = path.match(/^([^/]+)\/(.+)-(\d{4}-\d{2}-\d{2})\.[a-z0-9]+$/i);
  if (!match) return null;
  const [, businessId, , expiry] = match;
  return { path, businessId, expiry };
}

async function fetchEvents() {
  const manifestResponse = await fetch("events/index.json");
  if (!manifestResponse.ok) throw new Error("events manifest fetch failed");
  const paths = await manifestResponse.json();
  return paths.map(parseEventPath).filter(Boolean);
}

function isEventActive(event) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(`${event.expiry}T23:59:59`);
  return expiry >= today;
}

function renderEventImage(event, href, caption) {
  const el = document.createElement(href ? "a" : "div");
  el.className = "list-item event-card";
  if (href) el.href = href;

  el.innerHTML = `
    <img src="events/${event.path}" alt="${escapeHtml(caption ? `${caption} event flyer` : "Event flyer")}" loading="lazy" />
    ${caption ? `<div class="event-caption">${escapeHtml(caption)}</div>` : ""}
  `;
  return el;
}
