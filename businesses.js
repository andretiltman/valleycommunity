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

async function fetchBusinesses() {
  const manifestResponse = await fetch("businesses/listings/index.json");
  if (!manifestResponse.ok) throw new Error("manifest fetch failed");
  const files = await manifestResponse.json();

  return Promise.all(
    files.map(async (file) => {
      const response = await fetch(`businesses/listings/${file}.json`);
      if (!response.ok) throw new Error(`${file} fetch failed`);
      const data = await response.json();
      return { ...data, _id: file };
    })
  );
}

function renderBusinessSummary(item) {
  const el = document.createElement("a");
  el.className = "list-item";
  el.href = `business.html?id=${encodeURIComponent(item._id)}`;

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    <span class="category">${escapeHtml(item.category || "")}</span>
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    ${item.address ? `<p>${escapeHtml(item.address)}</p>` : ""}
  `;
  return el;
}

async function loadBusinesses() {
  const panel = document.getElementById("businesses-panel");
  const heading = document.getElementById("businesses-heading");
  const params = new URLSearchParams(window.location.search);
  const areaFilter = params.get("area");
  const categoryFilter = params.get("category");

  if (heading) {
    if (categoryFilter && areaFilter) {
      heading.textContent = `${categoryFilter} in ${areaFilter}`;
    } else if (categoryFilter) {
      heading.textContent = categoryFilter;
    } else if (areaFilter) {
      heading.textContent = `Businesses in ${areaFilter}`;
    }
  }

  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const items = await fetchBusinesses();

    panel.innerHTML = "";

    let filtered = items;
    if (areaFilter) {
      filtered = filtered.filter(
        (item) => item.area && item.area.toLowerCase() === areaFilter.toLowerCase()
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(
        (item) => item.category && item.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    const sorted = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));

    if (!sorted.length) {
      panel.innerHTML = areaFilter || categoryFilter
        ? `<p class="list-status">No businesses listed yet for ${escapeHtml(categoryFilter || areaFilter)}.</p>`
        : '<p class="list-status">No businesses listed yet.</p>';
    } else {
      sorted.forEach((item) => panel.appendChild(renderBusinessSummary(item)));
    }
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadBusinesses();
