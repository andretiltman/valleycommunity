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
  if (item.website) {
    links.push(`<a href="${escapeHtml(item.website)}" target="_blank" rel="noopener">Website</a>`);
  }
  if (item.mapLink) {
    links.push(`<a href="${escapeHtml(item.mapLink)}" target="_blank" rel="noopener">View map</a>`);
  }

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    <span class="category">${escapeHtml(item.category || "")}</span>
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    ${item.address ? `<p>${escapeHtml(item.address)}</p>` : ""}
    ${
      item.area
        ? `<p><a href="area.html?name=${encodeURIComponent(item.area)}">${escapeHtml(item.area)}</a></p>`
        : ""
    }
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

function renderQrCode(url) {
  const section = document.getElementById("business-qr-section");
  const container = document.getElementById("business-qr");
  if (!section || !container || typeof qrcodegen === "undefined") return;

  const qr = qrcodegen.QrCode.encodeText(url, qrcodegen.QrCode.Ecc.MEDIUM);
  const svg = qr.toSvgString(4).replace(/^[\s\S]*?(<svg)/, "$1");

  container.innerHTML = svg;
  section.hidden = false;
}

async function loadBusiness() {
  const id = new URLSearchParams(window.location.search).get("id");
  const title = document.getElementById("business-title");
  const subtitle = document.getElementById("business-subtitle");
  const panel = document.getElementById("business-panel");

  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  if (!id) {
    panel.innerHTML = '<p class="list-status">No business specified.</p>';
    return;
  }

  try {
    const response = await fetch(`businesses/listings/${id}.json`);
    if (!response.ok) throw new Error("business fetch failed");
    const item = await response.json();

    if (title) title.textContent = item.name;
    if (subtitle) subtitle.textContent = item.category || "Business details";
    document.title = `${item.name} · Valley Community`;

    panel.innerHTML = "";
    panel.appendChild(renderBusiness(item));
    renderQrCode(window.location.href);
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this business. Try again later.</p>';
  }
}

loadBusiness();
