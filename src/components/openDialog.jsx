const React = require("react");

const ReactDOM = require(
  "react-dom/client"
);

let dialog = null;

let root = null;

let rootNode = null;

function openDialog({
  width,
  height,
  component,
}) {
  // CREATE ONCE

  if (!dialog) {
    dialog =
      document.createElement(
        "dialog"
      );

    dialog.id = "imageOverlay";

    dialog.style.padding =
      "20px";

    dialog.style.border =
      "1px solid #444";

    dialog.style.background =
      "#252525";

    dialog.style.color =
      "white";

    dialog.style.overflow =
      "auto";

    document.body.appendChild(
      dialog
    );

    // ROOT NODE

    rootNode =
      document.createElement(
        "div"
      );

    dialog.appendChild(
      rootNode
    );

    // ROOT

    root =
      ReactDOM.createRoot(
        rootNode
      );

    // CLEANUP ON CLOSE

    dialog.addEventListener(
  "close",
  () => {
    try {
      // CLEAR REACT

      root.render(null);

      // RELEASE IMAGE URLS

      if (
        window.store &&
        window.store.images
      ) {
        for (const item of window
          .store.images) {
          try {
            URL.revokeObjectURL(
              item.url
            );
          } catch (e) {}
        }
      }
    } catch (e) {}
  }
);
  }

  // SIZE

  dialog.style.width =
    width || "900px";

  dialog.style.height =
    height || "700px";

  // RENDER

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