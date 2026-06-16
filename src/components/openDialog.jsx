const React = require("react");

const ReactDOM = require("react-dom/client");

const { store } = require("../store/store");

// =====================
// COMPONENTS
// =====================

const ImageResultsView = require("../components/ImageResultsView");

const TemplateResultsView = require("../components/TemplateResultsView");
const SettingsView = require("../components/settingview");

// =====================
// ROOTS
// =====================

let dialog = null;

let root = null;

let rootNode = null;

// =====================
// OVERLAY ROOT
// =====================

function OverlayRoot() {
  // HIDE
  console.log("OverlayRoot", store.overlayVisible, store.overlayView);
  if (!store.overlayVisible) {
    return null;
  }

  // =====================
  // VIEW SWITCH
  // =====================

  if (store.overlayView === "images") {
    return React.createElement(ImageResultsView);
  }
  if (store.overlayView === "assets") {
    return React.createElement(ImageResultsView);
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
  console.log("renderOverlay");
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

  // =====================
  // DIALOG
  // =====================

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

  // =====================
  // ROOT
  // =====================

  root = ReactDOM.createRoot(rootNode);

  // =====================
  // CLOSE EVENT
  // =====================

  dialog.addEventListener("close", () => {
    store.overlayVisible = false;
    
  });
}

// =====================
// OPEN
// =====================

function openDialog({ view, size }) {
  initOverlay();

  // =====================
  // UPDATE SIZE EVERY TIME
  // =====================

  dialog.style.height = `${size[0]}px`;
  dialog.style.width = `${size[1]}px`;

  console.log("openDialog", view, size);

  // =====================
  // STORE
  // =====================

  store.overlayView = view;
  store.overlayVisible = true;

  // =====================
  // RENDER
  // =====================

  renderOverlay();
}

module.exports = {
  openDialog,
};

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
