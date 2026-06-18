const React = require("react");
const ReactDOM = require("react-dom/client");
const { store } = require("../store/store");
const ImageResultsView = require("../components/ImageResultsView");
const AssetResultsView = require("../components/AssetResultsView");
const TemplateResultsView = require("../components/TemplateResultsView");
const SettingsView = require("../components/settingview");

let dialog = null;
let root = null;
let rootNode = null;

function OverlayRoot() {
  if (!store.overlayVisible) {
    return null;
  }

  if (store.overlayView === "images") {
    return React.createElement(ImageResultsView);
  }

  if (store.overlayView === "assets") {
    if (store.searchType === "template") {
      return React.createElement(TemplateResultsView);
    }

    return React.createElement(AssetResultsView);
  }

  if (store.overlayView === "settings") {
    return React.createElement(SettingsView);
  }

  return null;
}

// =====================
// RENDER
// =====================

function renderOverlay() {
  if (!root) {
    return;
  }
 
  root.render(React.createElement(OverlayRoot));

  // OPEN

  if (store.overlayVisible && !dialog.open) {
    dialog.showModal();
  }

  // CLOSE

  if (!store.overlayVisible && dialog.open) {
    dialog.close();
  }
}

// =====================
// INIT
// =====================

function initOverlay() {
  if (dialog) {
    return;
  }

  dialog = document.createElement("dialog");
  dialog.id = "imageOverlay";
  dialog.style.padding = "20px";
  dialog.style.border = "1px solid #444";
  dialog.style.background = "#252525";
  dialog.style.color = "white";
  dialog.style.overflow = "auto";

  document.body.appendChild(dialog);

  // =====================
  // ROOT NODE
  // =====================

  rootNode = document.createElement("div");
  dialog.appendChild(rootNode);

  root = ReactDOM.createRoot(rootNode);

  dialog.addEventListener("close", () => {
    store.overlayVisible = false;
  });
}

function openDialog({ view, size }) {
  initOverlay();

  // =====================
  // UPDATE SIZE EVERY TIME
  // =====================

  dialog.style.height = `${size[0]}px`;
  dialog.style.width = `${size[1]}px`;



  // =====================
  // STORE
  // =====================

  store.overlayView = view;
  store.overlayVisible = true;

  renderOverlay();
}

// =====================
// CLOSE
// =====================

function closeDialog() {
  store.overlayVisible = false;
  store.overlayView = null;

  renderOverlay();
}

module.exports = {
  openDialog,
  closeDialog,
  renderOverlay,
};
