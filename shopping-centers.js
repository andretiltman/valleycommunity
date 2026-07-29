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

function renderShoppingCenter(shoppingCenter, count) {
  const el = document.createElement("a");
  el.className = "card";
  el.href = `businesses.html?shoppingCenter=${encodeURIComponent(shoppingCenter)}`;

  el.innerHTML = `
    <span class="card-icon">🏬</span>
    <span class="card-body">
      <strong>${escapeHtml(shoppingCenter)}</strong>
      <span>${count} business${count === 1 ? "" : "es"}</span>
    </span>
    <span class="card-arrow">›</span>
  `;
  return el;
}

async function loadShoppingCenters() {
  const panel = document.getElementById("shopping-centers-panel");
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
      if (!item.shoppingCenter) return;
      counts.set(item.shoppingCenter, (counts.get(item.shoppingCenter) || 0) + 1);
    });

    const shoppingCenters = [...counts.keys()].sort((a, b) => a.localeCompare(b));

    if (!shoppingCenters.length) {
      panel.innerHTML = '<p class="list-status">No shopping centers listed yet.</p>';
    } else {
      shoppingCenters.forEach((shoppingCenter) =>
        panel.appendChild(renderShoppingCenter(shoppingCenter, counts.get(shoppingCenter)))
      );
    }
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadShoppingCenters();
