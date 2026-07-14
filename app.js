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
