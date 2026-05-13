const photoshop =
  window.require(
    "photoshop"
  );

const app =
  photoshop.app;

const action =
  photoshop.action;

const core =
  photoshop.core;

const fs =
  window.require(
    "uxp"
  ).storage
    .localFileSystem;

const {
  getActivePSD,
} = require(
  "../utils/getActivePSD"
);

const {
  getSelectedLayer,
} = require(
  "../utils/getSelectedLayer"
);

async function placeImage(
  file
) {
  console.log(
    "placeImage start",
    file
  );

  try {
    await core.executeAsModal(
      async () => {
        // =====================
        // PSD
        // =====================

        const psdDoc =
          getActivePSD();

        app.activeDocument =
          psdDoc;

        // =====================
        // FRAME
        // =====================

        const frameLayer =
          await getSelectedLayer(
            psdDoc
          );

        if (!frameLayer) {
          return;
        }

        // =====================
        // FRAME BOUNDS
        // =====================

        const frame =
          {
            left: Number(
              frameLayer
                .bounds.left
            ),

            top: Number(
              frameLayer
                .bounds.top
            ),

            right: Number(
              frameLayer
                .bounds.right
            ),

            bottom: Number(
              frameLayer
                .bounds.bottom
            ),
          };

        // =====================
        // TOKEN
        // =====================

   const token =
  fs.createSessionToken(
    file
  );

        // =====================
        // PLACE EVENT
        // =====================

        await action.batchPlay(
          [
            {
              _obj:
                "placeEvent",

              null: {
                _path:
                  token,

                _kind:
                  "local",
              },
            },
          ],
          {}
        );

        console.log(
          "image placed"
        );



        const placedLayer =
          app
            .activeDocument
            .activeLayers[0];

        // =====================
        // IMAGE BOUNDS
        // =====================

        const bounds =
          placedLayer.bounds;

        const left =
          Number(
            bounds.left
          );

        const top =
          Number(
            bounds.top
          );

        const right =
          Number(
            bounds.right
          );

        const bottom =
          Number(
            bounds.bottom
          );

        // =====================
        // FRAME SIZE
        // =====================

        const frameWidth =
          frame.right -
          frame.left;

        const frameHeight =
          frame.bottom -
          frame.top;

        // =====================
        // IMAGE SIZE
        // =====================

        const imageWidth =
          right - left;

        const imageHeight =
          bottom - top;

        // =====================
        // SCALE
        // =====================

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
          ) * 100;

        // =====================
        // TRANSFORM
        // =====================

        await action.batchPlay(
          [
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
                  scale,
              },

              height: {
                _unit:
                  "percentUnit",

                _value:
                  scale,
              },

              linked: true,
            },
          ],
          {}
        );

        // =====================
        // NEW BOUNDS
        // =====================

        const newBounds =
          placedLayer.bounds;

        const newLeft =
          Number(
            newBounds.left
          );

        const newTop =
          Number(
            newBounds.top
          );

        const newRight =
          Number(
            newBounds.right
          );

        const newBottom =
          Number(
            newBounds.bottom
          );

        // =====================
        // CENTER
        // =====================

        const imageCenterX =
          (newLeft +
            newRight) /
          2;

        const imageCenterY =
          (newTop +
            newBottom) /
          2;

        const frameCenterX =
          (frame.left +
            frame.right) /
          2;

        const frameCenterY =
          (frame.top +
            frame.bottom) /
          2;

        // =====================
        // MOVE
        // =====================

        const moveX =
          frameCenterX -
          imageCenterX;

        const moveY =
          frameCenterY -
          imageCenterY;

        // =====================
        // MOVE
        // =====================

        await action.batchPlay(
          [
            {
              _obj:
                "move",

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
          ],
          {}
        );

        // =====================
        // RASTERIZE
        // =====================

        await action.batchPlay(
          [
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
          ],
          {}
        );

        // =====================
        // CLIP
        // =====================

        await action.batchPlay(
          [
            {
              _obj:
                "groupEvent",
            },
          ],
          {}
        );

        // =====================
        // RENAME
        // =====================

        placedLayer.name =
          `TEC__${file.name}`;
            await action.batchPlay(
          [
            {
              _obj:
                "purge",

              target: {
                _enum:
                  "purgeTarget",

                _value:
                  "allCaches",
              },
            },
          ],
          {
            synchronousExecution:
              true,
          }
        );

        console.log(
          "clipping done"
        );
      },
      {
        commandName:
          "Place Image",
      }
    );
  } catch (err) {
    console.log(
      "placeImage error",
      err
    );
  }
}

module.exports = {
  placeImage,
};