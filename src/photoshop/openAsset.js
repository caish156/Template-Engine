const photoshop = window.require("photoshop");

const app = photoshop.app;
const core = photoshop.core;
const action = photoshop.action;

const fs = window.require("uxp").storage.localFileSystem;

const { store } = require("../store/store");

async function openAsset(file) {
  try {
    // =====================
    // TEMPLATE
    // =====================

    if (store.searchType === "template") {
      await core.executeAsModal(
        async () => {
          await app.open(file);
        },
        {
          commandName: "Open Template",
        },
      );

      return;
    }

    // =====================
    // ALL OTHER ASSETS
    // =====================

    await core.executeAsModal(
      async () => {
        const token = fs.createSessionToken(file);

        await action.batchPlay(
          [
            {
              _obj: "placeEvent",

              null: {
                _path: token,

                _kind: "local",
              },
            },
          ],
          {},
        );
      },
      {
        commandName: "Place Asset",
      },
    );
  } catch (err) {
    console.log("openAsset error", err);
  }
}

module.exports = {
  openAsset,
};
