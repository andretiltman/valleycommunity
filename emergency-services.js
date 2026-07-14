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

const CATEGORY_GROUP_LABELS = {
  Police: "Police Stations",
  Fire: "Fire Stations",
  Ambulance: "Ambulance & Medical",
  Electricity: "Electricity",
};

const CATEGORY_ORDER = ["Police", "Fire", "Ambulance", "Electricity"];

async function loadEmergencyContacts() {
  const panel = document.getElementById("emergency-panel");
  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const manifestResponse = await fetch("emergency-services/contacts/index.json");
    if (!manifestResponse.ok) throw new Error("manifest fetch failed");
    const files = await manifestResponse.json();

    const items = await Promise.all(
      files.map(async (file) => {
        const response = await fetch(`emergency-services/contacts/${file}.json`);
        if (!response.ok) throw new Error(`${file} fetch failed`);
        return response.json();
      })
    );

    panel.innerHTML = "";

    const sorted = items.slice().sort((a, b) => a.name.localeCompare(b.name));

    if (!sorted.length) {
      panel.innerHTML = '<p class="list-status">No emergency contacts listed yet.</p>';
      return;
    }

    const groups = new Map();
    sorted.forEach((item) => {
      const key = item.category || "Other";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    });

    const keys = [...groups.keys()].sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    keys.forEach((key) => {
      const heading = document.createElement("h4");
      heading.className = "list-group-heading";
      heading.textContent = CATEGORY_GROUP_LABELS[key] || key;
      panel.appendChild(heading);
      groups.get(key).forEach((item) => panel.appendChild(renderEmergencyContact(item)));
    });
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadEmergencyContacts();
