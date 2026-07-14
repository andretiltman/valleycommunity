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
    ${item.hours ? `<p>${escapeHtml(item.hours)}</p>` : ""}
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

async function fetchListings(baseDir) {
  const manifestResponse = await fetch(`${baseDir}/index.json`);
  if (!manifestResponse.ok) throw new Error("manifest fetch failed");
  const files = await manifestResponse.json();

  return Promise.all(
    files.map(async (file) => {
      const response = await fetch(`${baseDir}/${file}.json`);
      if (!response.ok) throw new Error(`${file} fetch failed`);
      return response.json();
    })
  );
}

async function loadArea() {
  const area = new URLSearchParams(window.location.search).get("name") || "";
  const title = document.getElementById("area-title");
  const businessesPanel = document.getElementById("area-businesses-panel");
  const emergencyPanel = document.getElementById("area-emergency-panel");

  if (title) title.textContent = area || "Area";
  document.title = `${area || "Area"} · Valley Community`;

  businessesPanel.innerHTML = '<p class="list-status">Loading&hellip;</p>';
  emergencyPanel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const businesses = await fetchListings("businesses/listings");
    const matching = businesses
      .filter((item) => item.area && item.area.toLowerCase() === area.toLowerCase())
      .sort((a, b) => a.name.localeCompare(b.name));

    businessesPanel.innerHTML = "";
    if (!matching.length) {
      businessesPanel.innerHTML = '<p class="list-status">No businesses listed yet for this area.</p>';
    } else {
      matching.forEach((item) => businessesPanel.appendChild(renderBusiness(item)));
    }
  } catch (err) {
    businessesPanel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }

  try {
    const contacts = await fetchListings("emergency-services/contacts");
    const matching = contacts
      .filter(
        (item) =>
          Array.isArray(item.areas) &&
          item.areas.some((a) => a.toLowerCase() === area.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));

    emergencyPanel.innerHTML = "";
    if (!matching.length) {
      emergencyPanel.innerHTML = '<p class="list-status">No emergency contacts listed yet for this area.</p>';
    } else {
      matching.forEach((item) => emergencyPanel.appendChild(renderEmergencyContact(item)));
    }
  } catch (err) {
    emergencyPanel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadArea();
