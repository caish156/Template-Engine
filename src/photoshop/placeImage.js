const photoshop =
  window.require("photoshop");

const app = photoshop.app;

const action =
  photoshop.action;

const core =
  photoshop.core;

const fs =
  window.require("uxp")
    .storage.localFileSystem;

const {
  getActivePSD,
} = require(
  "../utils/getActivePSD"
);

async function placeImage(
  file
) {
  try {
    await core.executeAsModal(
      async () => {
        // PSD

        const psdDoc =
          getActivePSD();

        app.activeDocument =
          psdDoc;

        // FRAME

        const frameLayer =
          psdDoc.activeLayers[0];

        if (!frameLayer) {
          return;
        }

        // FRAME BOUNDS

        const frameLeft =
          Number(
            frameLayer.bounds.left
          );

        const frameTop =
          Number(
            frameLayer.bounds.top
          );

        const frameRight =
          Number(
            frameLayer.bounds.right
          );

        const frameBottom =
          Number(
            frameLayer.bounds.bottom
          );

        // FRAME SIZE

        const frameWidth =
          frameRight -
          frameLeft;

        const frameHeight =
          frameBottom -
          frameTop;

        // FRAME CENTER

        const frameCenterX =
          (frameLeft +
            frameRight) /
          2;

        const frameCenterY =
          (frameTop +
            frameBottom) /
          2;

        // TOKEN

        const token =
          await fs.createSessionToken(
            file
          );

        // PLACE

        await action.batchPlay(
          [
            {
              _obj:
                "placeEvent",

              null: {
                _path: token,

                _kind:
                  "local",
              },
            },
          ],
          {
            synchronousExecution: true,
          }
        );

        // PLACED LAYER

        const placedLayer =
          psdDoc.activeLayers[0];

        // IMAGE BOUNDS

        const bounds =
          placedLayer.bounds;

        const imageLeft =
          Number(bounds.left);

        const imageTop =
          Number(bounds.top);

        const imageRight =
          Number(bounds.right);

        const imageBottom =
          Number(
            bounds.bottom
          );

        // IMAGE SIZE

        const imageWidth =
          imageRight -
          imageLeft;

        const imageHeight =
          imageBottom -
          imageTop;

        // SCALE

        const scaleX =
          frameWidth /
          imageWidth;

        const scaleY =
          frameHeight /
          imageHeight;

        const scale =
          Math.max(
            scaleX,
            scaleY
          );

        // FINAL SIZE AFTER SCALE

        const finalWidth =
          imageWidth * scale;

        const finalHeight =
          imageHeight * scale;

        // CURRENT CENTER

        const currentCenterX =
          (imageLeft +
            imageRight) /
          2;

        const currentCenterY =
          (imageTop +
            imageBottom) /
          2;

        // FINAL POSITION

        const moveX =
          frameCenterX -
          currentCenterX;

        const moveY =
          frameCenterY -
          currentCenterY;

        // SINGLE FINAL BATCH

        await action.batchPlay(
          [
            // SCALE

            {
              _obj:
                "transform",

              _target: [
                {
                  _ref:
                    "layer",

                  _enum:
                    "ordinal",

                  _value:
                    "targetEnum",
                },
              ],

              freeTransformCenterState:
                {
                  _enum:
                    "quadCenterState",

                  _value:
                    "QCSAverage",
                },

              width: {
                _unit:
                  "percentUnit",

                _value:
                  scale * 100,
              },

              height: {
                _unit:
                  "percentUnit",

                _value:
                  scale * 100,
              },

              linked: true,
            },

            // MOVE

            {
              _obj: "move",

              _target: [
                {
                  _ref:
                    "layer",

                  _enum:
                    "ordinal",

                  _value:
                    "targetEnum",
                },
              ],

              to: {
                _obj:
                  "offset",

                horizontal:
                  {
                    _unit:
                      "pixelsUnit",

                    _value:
                      moveX,
                  },

                vertical:
                  {
                    _unit:
                      "pixelsUnit",

                    _value:
                      moveY,
                  },
              },
            },

            // RASTERIZE

            {
              _obj:
                "rasterizeLayer",

              _target: [
                {
                  _ref:
                    "layer",

                  _enum:
                    "ordinal",

                  _value:
                    "targetEnum",
                },
              ],
            },

            // CLIP

            {
              _obj:
                "groupEvent",
            },
          ],
          {
            synchronousExecution: true,
          }
        );
      },
      {
        commandName:
          "Place Image",
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  placeImage,
};