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

function contactLinks(item) {
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
  return links;
}

function renderArtist(item) {
  const el = document.createElement("div");
  el.className = "list-item";

  const links = contactLinks(item);
  if (item.socials) {
    const labels = {
      instagram: "Instagram",
      facebook: "Facebook",
      youtube: "YouTube",
      spotify: "Spotify",
      soundcloud: "SoundCloud",
      bandcamp: "Bandcamp",
    };
    Object.keys(labels).forEach((key) => {
      if (item.socials[key]) {
        links.push(`<a href="${escapeHtml(item.socials[key])}" target="_blank" rel="noopener">${labels[key]}</a>`);
      }
    });
  }

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    ${item.genre ? `<span class="category">${escapeHtml(item.genre)}</span>` : ""}
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    ${item.area ? `<p>${escapeHtml(item.area)}</p>` : ""}
    ${links.length ? `<p>${links.join(" &middot; ")}</p>` : ""}
  `;
  return el;
}

function renderVenue(item) {
  const el = document.createElement("div");
  el.className = "list-item";

  const links = contactLinks(item);
  if (item.mapLink) {
    links.push(`<a href="${escapeHtml(item.mapLink)}" target="_blank" rel="noopener">View map</a>`);
  }

  el.innerHTML = `
    <strong>${escapeHtml(item.name)}</strong>
    ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
    ${item.address ? `<p>${escapeHtml(item.address)}</p>` : item.area ? `<p>${escapeHtml(item.area)}</p>` : ""}
    ${links.length ? `<p>${links.join(" &middot; ")}</p>` : ""}
  `;
  return el;
}

async function loadSection(panelId, baseDir, renderItem, emptyMessage) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  panel.innerHTML = '<p class="list-status">Loading&hellip;</p>';

  try {
    const items = await fetchListings(baseDir);
    const sorted = items.slice().sort((a, b) => a.name.localeCompare(b.name));

    panel.innerHTML = "";
    if (!sorted.length) {
      panel.innerHTML = `<p class="list-status">${emptyMessage}</p>`;
    } else {
      sorted.forEach((item) => panel.appendChild(renderItem(item)));
    }
  } catch (err) {
    panel.innerHTML = '<p class="list-status">Couldn’t load this list. Try again later.</p>';
  }
}

loadSection("artists-panel", "music/artists", renderArtist, "No artists listed yet.");
loadSection("venues-panel", "music/venues", renderVenue, "No venues listed yet.");
