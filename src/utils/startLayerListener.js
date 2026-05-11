// photoshop/startLayerListener.js

const photoshop = window.require("photoshop");

const action = photoshop.action;

const app = photoshop.app;

const { store } = require("../store/store");

const { openDialog } = require("../components/openDialog");

const { placeImage } = require("../photoshop/placeImage");

function startLayerListener() {
  if (store.listenerStarted) {
    return;
  }

  store.listenerStarted = true;

  // REAL LISTENER

  action.addNotificationListener(
    ["select"],

    async () => {
      try {
        // FILL MODE OFF

        if (!store.fillMode) {
          return;
        }

        // NO IMAGES

        if (!store.images.length) {
          return;
        }

        const dialog = document.getElementById("imageOverlay");

        // ALREADY OPEN

        if (dialog?.open) {
          return;
        }

        const layer = app.activeDocument.activeLayers[0];

        if (!layer) {
          return;
        }

        // SAME LAYER

        if (layer.id === store.lastLayerId) {
          return;
        }

        store.lastLayerId = layer.id;

        // OPEN OVERLAY

        openDialog({
          type: "images",

          data: store.images,

          renderItem: ({ item, dialog }) => {
            const card = document.createElement("div");

            card.style.width = "70px";

            card.style.height = "70px";

            const img = document.createElement("img");

            img.src = item.url;

            img.style.width = "100%";

            img.style.height = "100%";

            img.style.objectFit = "cover";

            img.style.cursor = "pointer";

            img.style.opacity = item.used ? "0.3" : "1";

            img.onclick = async () => {
              dialog.close();

              await placeImage(item.file);

              item.used = true;

              img.style.opacity = "0.3";
            };

            card.appendChild(img);

            return card;
          },
        });
      } catch (err) {
        console.log("listener error", err);
      }
    },
  );
}

module.exports = {
  startLayerListener,
};
