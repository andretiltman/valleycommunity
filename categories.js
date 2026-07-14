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

function renderCategory(category, count) {
  const el = document.createElement("a");
  el.className = "card";
  el.href = `businesses.html?category=${encodeURIComponent(category)}`;

  el.innerHTML = `
    <span class="card-icon">🏷️</span>
    <span class="card-body">
      <strong>${escapeHtml(category)}</strong>
      <span>${count} business${count === 1 ? "" : "es"}</span>
    </span>
    <span class="card-arrow">›</span>
  `;
  return el;
}

async function loadCategories() {
  const panel = document.getElementById("categories-panel");
  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const manifestResponse = await fetch("businesses/listings/index.json");
    if (!manifestResponse.ok) throw new Error("manifest fetch failed");
    const files = await manifestResponse.json();

    const items = await Promise.all(
      files.map(async (file) => {
        const response = await fetch(`businesses/listings/${file}.json`);
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
      categories.forEach((category) => panel.appendChild(renderCategory(category, counts.get(category))));
    }
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadCategories();
