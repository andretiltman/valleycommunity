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
  el.className = item.featured ? "list-item featured" : "list-item";
  el.href = `business.html?id=${encodeURIComponent(item._id)}`;

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    <span class="category">${escapeHtml(item.category || "")}</span>
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    ${item.address ? `<p>${escapeHtml(item.address)}</p>` : ""}
    ${item.shoppingCenter ? `<p>${escapeHtml(item.shoppingCenter)}</p>` : ""}
  `;
  return el;
}

function matchesSearch(item, query) {
  if (!query) return true;
  const haystack = [
    item.name,
    item.category,
    item.description,
    item.address,
    item.area,
    item.shoppingCenter,
    ...(item.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

async function loadBusinesses() {
  const panel = document.getElementById("businesses-panel");
  const heading = document.getElementById("businesses-heading");
  const searchInput = document.getElementById("businesses-search");
  const params = new URLSearchParams(window.location.search);
  const areaFilter = params.get("area");
  const categoryFilter = params.get("category");
  const shoppingCenterFilter = params.get("shoppingCenter");

  if (heading) {
    if (shoppingCenterFilter) {
      heading.textContent = shoppingCenterFilter;
    } else if (categoryFilter && areaFilter) {
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
    if (shoppingCenterFilter) {
      filtered = filtered.filter(
        (item) =>
          item.shoppingCenter && item.shoppingCenter.toLowerCase() === shoppingCenterFilter.toLowerCase()
      );
    }

    const baseline = filtered.slice().sort((a, b) => {
      if (categoryFilter) {
        const featuredDiff = (b.featured === true) - (a.featured === true);
        if (featuredDiff !== 0) return featuredDiff;
      }
      return a.name.localeCompare(b.name);
    });

    function render() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      const sorted = baseline.filter((item) => matchesSearch(item, query));

      panel.innerHTML = "";

      if (!sorted.length) {
        const scopeLabel = categoryFilter || shoppingCenterFilter || areaFilter;
        if (query) {
          panel.innerHTML = `<p class="list-status">No businesses match “${escapeHtml(
            searchInput.value.trim()
          )}”.</p>`;
        } else if (scopeLabel) {
          panel.innerHTML = `<p class="list-status">No businesses listed yet for ${escapeHtml(
            scopeLabel
          )}.</p>`;
        } else {
          panel.innerHTML = '<p class="list-status">No businesses listed yet.</p>';
        }
      } else {
        sorted.forEach((item) => panel.appendChild(renderBusinessSummary(item)));
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", render);
    }

    render();
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadBusinesses();
