// components/openDialog.jsx

const React = require("react");

const ReactDOM = require("react-dom/client");

function openDialog({ type, width, height, component }) {
  let dialog = document.getElementById("imageOverlay");

  // CREATE ONCE

  if (!dialog) {
    dialog = document.createElement("dialog");

    dialog.id = "imageOverlay";
    dialog.style.padding = "20px";
    dialog.style.border = "1px solid #444";
    dialog.style.background = "#252525";
    dialog.style.color = "white";
    dialog.style.overflow = "auto";
    document.body.appendChild(dialog);
  }

  // SIZE

  dialog.style.width = width || "900px";

  dialog.style.height = height || "700px";

  // CLEAR

  dialog.innerHTML = "";

  // ROOT

  const rootElement = document.createElement("div");
  rootElement.style.width = "100%";
  rootElement.style.height = "100%";
  dialog.appendChild(rootElement);

  // REACT RENDER

  const root = ReactDOM.createRoot(rootElement);

  root.render(component);

  // OPEN

  if (!dialog.open) {
    dialog.showModal();
  }

  return dialog;
}

module.exports = {
  openDialog,
};
