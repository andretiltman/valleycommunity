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

function renderServiceCategory(category, count) {
  const el = document.createElement("a");
  el.className = "card";
  el.href = `services.html?category=${encodeURIComponent(category)}`;

  const icon = SERVICE_CATEGORY_ICONS[category] || DEFAULT_SERVICE_CATEGORY_ICON;

  el.innerHTML = `
    <span class="card-icon">${icon}</span>
    <span class="card-body">
      <strong>${escapeHtml(category)}</strong>
      <span>${count} service${count === 1 ? "" : "s"}</span>
    </span>
    <span class="card-arrow">›</span>
  `;
  return el;
}

async function loadServiceCategories() {
  const panel = document.getElementById("service-categories-panel");
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

    const counts = new Map();
    items.forEach((item) => {
      if (!item.category) return;
      counts.set(item.category, (counts.get(item.category) || 0) + 1);
    });

    const categories = [...counts.keys()].sort((a, b) => a.localeCompare(b));

    if (!categories.length) {
      panel.innerHTML = '<p class="list-status">No categories listed yet.</p>';
    } else {
      categories.forEach((category) => panel.appendChild(renderServiceCategory(category, counts.get(category))));
    }
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadServiceCategories();
