const photoshop = require("photoshop");

const app = photoshop.app;
const action = photoshop.action;

const store = require("../store/store");

const fs = require("uxp").storage.localFileSystem;

const { getActivePSD } = require("../utils/getActivePSD");

const { getSelectedLayer } = require("../utils/getSelectedLayer");

async function placeImage(file) {
  console.log("placeImage start", file);

  try {
    const psdDoc = getActivePSD();

    app.activeDocument = psdDoc;

    const layer = await getSelectedLayer(psdDoc);
    console.log(layer);
    store.currentFrameBounds = {
      left: Number(layer.bounds.left),
      top: Number(layer.bounds.top),
      right: Number(layer.bounds.right),
      bottom: Number(layer.bounds.bottom),
    };

    console.log("psd activated", store.currentFrameBounds);

    const token = await fs.createSessionToken(file);

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
    console.log("image placed");

    const placedLayer = app.activeDocument.activeLayers[0];

    const frame = store.currentFrameBounds;

    // CURRENT IMAGE BOUNDS

    const bounds = placedLayer.bounds;

    const left = Number(bounds.left);

    const top = Number(bounds.top);

    const right = Number(bounds.right);

    const bottom = Number(bounds.bottom);

    // FRAME SIZE

    const frameWidth = frame.right - frame.left;

    const frameHeight = frame.bottom - frame.top;

    // IMAGE SIZE

    const imageWidth = right - left;

    const imageHeight = bottom - top;

    // SCALE

    const scaleX = frameWidth / imageWidth;

    const scaleY = frameHeight / imageHeight;

    const scale = Math.max(scaleX, scaleY) * 100;

    // TRANSFORM

    await action.batchPlay(
      [
        {
          _obj: "transform",

          _target: [
            {
              _ref: "layer",

              _enum: "ordinal",

              _value: "targetEnum",
            },
          ],

          freeTransformCenterState: {
            _enum: "quadCenterState",

            _value: "QCSAverage",
          },

          width: {
            _unit: "percentUnit",

            _value: scale,
          },

          height: {
            _unit: "percentUnit",

            _value: scale,
          },

          linked: true,
        },
      ],
      {},
    );

    // NEW BOUNDS AFTER SCALE

    const newBounds = placedLayer.bounds;

    const newLeft = Number(newBounds.left);

    const newTop = Number(newBounds.top);

    const newRight = Number(newBounds.right);

    const newBottom = Number(newBounds.bottom);

    // CENTER

    const imageCenterX = (newLeft + newRight) / 2;

    const imageCenterY = (newTop + newBottom) / 2;

    const frameCenterX = (frame.left + frame.right) / 2;

    const frameCenterY = (frame.top + frame.bottom) / 2;

    // MOVE

    const moveX = frameCenterX - imageCenterX;

    const moveY = frameCenterY - imageCenterY;

    // ALIGN

    await action.batchPlay(
      [
        {
          _obj: "move",

          _target: [
            {
              _ref: "layer",

              _enum: "ordinal",

              _value: "targetEnum",
            },
          ],

          to: {
            _obj: "offset",

            horizontal: {
              _unit: "pixelsUnit",

              _value: moveX,
            },

            vertical: {
              _unit: "pixelsUnit",

              _value: moveY,
            },
          },
        },
      ],
      {},
    );

    // CLIPPING

    await action.batchPlay(
      [
        {
          _obj: "groupEvent",
        },
      ],
      {},
    );

    console.log("clipping done");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  placeImage,
};
