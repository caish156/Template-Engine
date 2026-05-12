// photoshop/startLayerListener.js

const React = require("react");

const photoshop =
  window.require("photoshop");

const action =
  photoshop.action;

const app = photoshop.app;

const { store } = require(
  "../store/store"
);

const { openDialog } = require(
  "../components/openDialog"
);

const ImageResultsView = require(
  "../components/ImageResultsView.jsx"
);

const { placeImage } = require(
  "../photoshop/placeImage"
);

// ======================
// PROCESS LOCK
// ======================

let isProcessing = false;

// ======================
// IMAGE CLICK
// ======================

async function handleImageClick(
  item
) {
  try {
    const overlay =
      document.getElementById(
        "imageOverlay"
      );

    if (overlay) {
      overlay.close();
    }

    await placeImage(item.file);

    item.used = true;
  } catch (error) {
    console.log(
      "PLACE IMAGE ERROR:",
      error
    );
  }
}

// ======================
// LISTENER
// ======================

function startLayerListener() {
  // ALREADY STARTED

  if (store.listenerStarted) {
    return;
  }

  store.listenerStarted = true;

  // REAL LISTENER

  action.addNotificationListener(
    ["select"],

    async () => {
      // PREVENT EVENT SPAM

      if (isProcessing) {
        return;
      }

      isProcessing = true;

      try {
        // FILL MODE OFF

        if (!store.fillMode) {
          return;
        }

        // NO IMAGES

        if (!store.images.length) {
          return;
        }

        // OVERLAY

        const dialog =
          document.getElementById(
            "imageOverlay"
          );

        // ALREADY OPEN

        if (dialog?.open) {
          return;
        }

        // CURRENT LAYER

        const layer =
          app.activeDocument
            .activeLayers[0];

        if (!layer) {
          return;
        }

        // SAME LAYER

        if (
          layer.id ===
          store.lastLayerId
        ) {
          return;
        }

        store.lastLayerId =
          layer.id;

        // OPEN OVERLAY

        openDialog({
          width: "1000px",

          height: "700px",

          component:
            React.createElement(
              ImageResultsView,
              {
                images:
                  store.images,

                onImageClick:
                  handleImageClick,
              }
            ),
        });
      } catch (err) {
        console.log(
          "listener error",
          err
        );
      } finally {
        // RELEASE LOCK

        setTimeout(() => {
          isProcessing = false;
        }, 60);
      }
    }
  );
}

module.exports = {
  startLayerListener,
};