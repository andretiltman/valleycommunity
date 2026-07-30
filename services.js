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

async function fetchServices() {
  const manifestResponse = await fetch("services/listings/index.json");
  if (!manifestResponse.ok) throw new Error("manifest fetch failed");
  const files = await manifestResponse.json();

  return Promise.all(
    files.map(async (file) => {
      const response = await fetch(`services/listings/${file}.json`);
      if (!response.ok) throw new Error(`${file} fetch failed`);
      const data = await response.json();
      return { ...data, _id: file };
    })
  );
}

const SERVICE_LOGO_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function findServiceLogo(id) {
  return new Promise((resolve) => {
    let i = 0;
    function tryNext() {
      if (i >= SERVICE_LOGO_EXTENSIONS.length) return resolve(null);
      const url = `services/logos/${id}.${SERVICE_LOGO_EXTENSIONS[i]}`;
      i++;
      const probe = new Image();
      probe.onload = () => resolve(url);
      probe.onerror = tryNext;
      probe.src = url;
    }
    tryNext();
  });
}

function renderServiceSummary(item) {
  const el = document.createElement("a");
  el.className = item.featured ? "list-item list-item-icon featured" : "list-item list-item-icon";
  el.href = `service.html?id=${encodeURIComponent(item._id)}`;

  const icon = SERVICE_CATEGORY_ICONS[item.category] || DEFAULT_SERVICE_CATEGORY_ICON;

  el.innerHTML = `
    <span class="list-icon">${icon}</span>
    <span class="list-body">
      <strong>${escapeHtml(item.name)}</strong>
      <span class="category">${escapeHtml(item.category || "")}</span>
      ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    </span>
  `;

  findServiceLogo(item._id).then((url) => {
    if (!url) return;
    const iconEl = el.querySelector(".list-icon");
    if (iconEl) iconEl.innerHTML = `<img src="${escapeHtml(url)}" alt="" />`;
  });

  return el;
}

function matchesSearch(item, query) {
  if (!query) return true;
  const haystack = [item.name, item.category, item.description, ...(item.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

async function loadServices() {
  const panel = document.getElementById("services-panel");
  const heading = document.getElementById("services-heading");
  const searchInput = document.getElementById("services-search");
  const categoryFilter = new URLSearchParams(window.location.search).get("category");

  if (heading && categoryFilter) {
    heading.textContent = categoryFilter;
  }

  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const items = await fetchServices();

    let filtered = items;
    if (categoryFilter) {
      filtered = filtered.filter(
        (item) => item.category && item.category.toLowerCase() === categoryFilter.toLowerCase()
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
        if (query) {
          panel.innerHTML = `<p class="list-status">No services match “${escapeHtml(
            searchInput.value.trim()
          )}”.</p>`;
        } else if (categoryFilter) {
          panel.innerHTML = `<p class="list-status">No services listed yet for ${escapeHtml(
            categoryFilter
          )}.</p>`;
        } else {
          panel.innerHTML = '<p class="list-status">No services listed yet.</p>';
        }
      } else {
        sorted.forEach((item) => panel.appendChild(renderServiceSummary(item)));
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

loadServices();
