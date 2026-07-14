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

function renderArea(area, businessCount, emergencyCount) {
  const el = document.createElement("a");
  el.className = "card";
  el.href = `area.html?name=${encodeURIComponent(area)}`;

  const parts = [];
  parts.push(`${businessCount} business${businessCount === 1 ? "" : "es"}`);
  if (emergencyCount) {
    parts.push(`${emergencyCount} emergency contact${emergencyCount === 1 ? "" : "s"}`);
  }

  el.innerHTML = `
    <span class="card-icon">📍</span>
    <span class="card-body">
      <strong>${escapeHtml(area)}</strong>
      <span>${escapeHtml(parts.join(" · "))}</span>
    </span>
    <span class="card-arrow">›</span>
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

async function loadAreas() {
  const panel = document.getElementById("areas-panel");
  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const [businesses, contacts] = await Promise.all([
      fetchListings("businesses/listings"),
      fetchListings("emergency-services/contacts"),
    ]);

    panel.innerHTML = "";

    const businessCounts = new Map();
    businesses.forEach((item) => {
      if (!item.area) return;
      businessCounts.set(item.area, (businessCounts.get(item.area) || 0) + 1);
    });

    const emergencyCounts = new Map();
    contacts.forEach((item) => {
      if (!Array.isArray(item.areas)) return;
      item.areas.forEach((area) => {
        emergencyCounts.set(area, (emergencyCounts.get(area) || 0) + 1);
      });
    });

    const areas = [...new Set([...businessCounts.keys(), ...emergencyCounts.keys()])].sort((a, b) =>
      a.localeCompare(b)
    );

    if (!areas.length) {
      panel.innerHTML = '<p class="list-status">No areas listed yet.</p>';
    } else {
      areas.forEach((area) =>
        panel.appendChild(renderArea(area, businessCounts.get(area) || 0, emergencyCounts.get(area) || 0))
      );
    }
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadAreas();
