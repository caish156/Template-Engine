const photoshop = window.require("photoshop");

const action = photoshop.action;

const app = photoshop.app;

const { store } = require("../store/store");

const { openDialog } = require("../components/openDialog");

// ======================
// PROCESS LOCK
// ======================

let isProcessing = false;

// ======================
// LISTENER
// ======================

function startLayerListener() {
  console.log("listener started");

  // ALREADY STARTED

  if (store.listenerStarted) {
    return;
  }

  store.listenerStarted = true;

  // ======================
  // REAL LISTENER
  // ======================

  action.addNotificationListener(
    ["select"],

    async () => {
      // ======================
      // LOCK
      // ======================

      if (isProcessing) {
        return;
      }

      isProcessing = true;

      try {
        // ======================
        // FILL MODE
        // ======================

        if (!store.fillMode) {
          return;
        }

        // ======================
        // NO IMAGES
        // ======================

        if (!store.images.length) {
          return;
        }

        // ======================
        // OVERLAY OPEN
        // ======================

        if (store.overlayVisible) {
          return;
        }

        // ======================
        // ACTIVE DOC
        // ======================

        if (!app.activeDocument) {
          return;
        }

        // ======================
        // CURRENT LAYER
        // ======================

        const layer = app.activeDocument.activeLayers[0];

        if (!layer) {
          return;
        }

        // ======================
        // SAME LAYER
        // ======================

        if (layer.id === store.lastLayerId) {
          return;
        }

        store.lastLayerId = layer.id;

        // ======================
        // OPEN OVERLAY
        // ======================

        openDialog({
          view: "images",
          size: [700, 900],
        });
      } catch (err) {
        console.log("listener error", err);
      } finally {
        // ======================
        // RELEASE LOCK
        // ======================

        setTimeout(() => {
          isProcessing = false;
        }, 60);
      }
    },
  );
}

module.exports = {
  startLayerListener,
};
