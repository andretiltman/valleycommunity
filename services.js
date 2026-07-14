if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function renderService(item) {
  const el = document.createElement("div");
  el.className = "list-item";

  const links = [];
  if (item.contact?.phone) {
    links.push(
      `<a href="tel:${escapeHtml(item.contact.phone.replace(/\s+/g, ""))}">${escapeHtml(item.contact.phone)}</a>`
    );
  }
  if (item.contact?.whatsapp) {
    links.push(`<a href="${escapeHtml(item.contact.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`);
  }
  if (item.contact?.email) {
    links.push(`<a href="mailto:${escapeHtml(item.contact.email)}">Email</a>`);
  }
  if (item.website) {
    links.push(`<a href="${escapeHtml(item.website)}" target="_blank" rel="noopener">Website</a>`);
  }

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    <span class="category">${escapeHtml(item.category || "")}</span>
    ${item.contactPerson ? `<p>${escapeHtml(item.contactPerson)}</p>` : ""}
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    ${item.area ? `<p>${escapeHtml(item.area)}</p>` : ""}
    ${item.hours ? `<p>${escapeHtml(item.hours)}</p>` : ""}
    ${links.length ? `<p>${links.join(" &middot; ")}</p>` : ""}
    ${
      Array.isArray(item.tags) && item.tags.length
        ? `<p>${item.tags.map((tag) => escapeHtml(tag)).join(" &middot; ")}</p>`
        : ""
    }
  `;
  return el;
}

async function loadServices() {
  const panel = document.getElementById("services-panel");
  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const manifestResponse = await fetch("services/listings/index.json");
    if (!manifestResponse.ok) throw new Error("manifest fetch failed");
    const files = await manifestResponse.json();

    const items = await Promise.all(
      files.map(async (file) => {
        const response = await fetch(`services/listings/${file}.json`);
        if (!response.ok) throw new Error(`${file} fetch failed`);
        return response.json();
      })
    );

    panel.innerHTML = "";

    if (!items.length) {
      panel.innerHTML = '<p class="list-status">No services listed yet.</p>';
      return;
    }

    const groups = new Map();
    items.forEach((item) => {
      const key = item.category || "Other";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    const keys = [...groups.keys()].sort((a, b) => a.localeCompare(b));

    keys.forEach((key) => {
      const heading = document.createElement("h4");
      heading.className = "list-group-heading";
      heading.textContent = key;
      panel.appendChild(heading);
      groups
        .get(key)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((item) => panel.appendChild(renderService(item)));
    });
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadServices();
