if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

const banner = document.getElementById("install-banner");
const installText = document.getElementById("install-text");
const installButton = document.getElementById("install-button");

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  if (!isStandalone) {
    banner.style.display = "block";
  }
});

installButton.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  banner.style.display = "none";
});

if (isIos && !isStandalone) {
  installText.textContent =
    'Install this app: tap the Share icon, then "Add to Home Screen".';
  installButton.style.display = "none";
  banner.style.display = "block";
}

async function loadHomeEvents() {
  const section = document.getElementById("events-section");
  const panel = document.getElementById("events-panel");
  if (!section || !panel) return;

  try {
    const events = (await fetchEvents()).filter(isEventActive);
    if (!events.length) return;

    const withNames = await Promise.all(
      events.map(async (event) => {
        try {
          const response = await fetch(`businesses/listings/${event.businessId}.json`);
          const business = response.ok ? await response.json() : null;
          return { ...event, businessName: business?.name || event.businessId };
        } catch {
          return { ...event, businessName: event.businessId };
        }
      })
    );

    panel.innerHTML = "";
    withNames.forEach((event) => {
      panel.appendChild(
        renderEventImage(event, `business.html?id=${encodeURIComponent(event.businessId)}`, event.businessName)
      );
    });
    section.hidden = false;
  } catch (err) {
    // No events manifest, or it failed to load — just leave the section hidden.
  }
}

loadHomeEvents();

