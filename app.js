if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

const banner = document.getElementById("install-banner");
const installText = document.getElementById("install-text");
const installButton = document.getElementById("install-button");

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (!isStandalone) {
    banner.style.display = "block";
  }
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  banner.style.display = "none";
});

if (isIos && !isStandalone) {
  installText.textContent =
    'Install this app: tap the Share icon, then "Add to Home Screen".';
  installButton.style.display = "none";
  banner.style.display = "block";
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

function renderBusiness(item) {
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

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    <span class="category">${escapeHtml(item.category || "")}</span>
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    ${item.address ? `<p>${escapeHtml(item.address)}</p>` : ""}
    ${links.length ? `<p>${links.join(" &middot; ")}</p>` : ""}
  `;
  return el;
}

function renderEmergencyContact(item) {
  const el = document.createElement("div");
  el.className = "list-item";

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    <span class="category">${escapeHtml(item.category || "")}</span>
    ${item.phone ? `<p><a href="tel:${escapeHtml(item.phone.replace(/\s+/g, ""))}">${escapeHtml(item.phone)}</a></p>` : ""}
    ${item.address ? `<p>${escapeHtml(item.address)}</p>` : ""}
    ${item.mapLink ? `<p><a href="${escapeHtml(item.mapLink)}" target="_blank" rel="noopener">View map</a></p>` : ""}
  `;
  return el;
}

const DIRECTORIES = [
  {
    toggleId: "businesses-toggle",
    panelId: "businesses-panel",
    manifest: "businesses/listings/index.json",
    base: "businesses/listings/",
    render: renderBusiness,
    emptyText: "No businesses listed yet.",
  },
  {
    toggleId: "emergency-toggle",
    panelId: "emergency-panel",
    manifest: "emergency-services/contacts/index.json",
    base: "emergency-services/contacts/",
    render: renderEmergencyContact,
    emptyText: "No emergency contacts listed yet.",
  },
];

function setupDirectory(config) {
  const toggle = document.getElementById(config.toggleId);
  const panel = document.getElementById(config.panelId);
  if (!toggle || !panel) return;

  let loaded = false;

  toggle.addEventListener("click", async () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";

    if (expanded) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      return;
    }

    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;

    if (loaded) return;

    panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

    try {
      const manifestResponse = await fetch(config.manifest);
      if (!manifestResponse.ok) throw new Error("manifest fetch failed");
      const files = await manifestResponse.json();

      const items = await Promise.all(
        files.map(async (file) => {
          const response = await fetch(`${config.base}${file}.json`);
          if (!response.ok) throw new Error(`${file} fetch failed`);
          return response.json();
        })
      );

      panel.innerHTML = "";

      if (!items.length) {
        panel.innerHTML = `<p class="list-status">${config.emptyText}</p>`;
      } else {
        items
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((item) => panel.appendChild(config.render(item)));
      }

      loaded = true;
    } catch (err) {
      panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
    }
  });
}

DIRECTORIES.forEach(setupDirectory);
