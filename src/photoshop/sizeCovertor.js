const photoshop = window.require("photoshop");

const app = photoshop.app;
const action = photoshop.action;
const core = photoshop.core;

const { store } = require("../store/store");

// =====================================
// MAIN
// =====================================

async function handleConvert() {
  const current = store.currentAlbumSize;
  const target = store.albumSize;



  if (!target) {

    return;
  }

  const doc = app.activeDocument;

  const currentWidth = doc.width;
  const currentHeight = doc.height;

  let targetWidth = 0;
  let targetHeight = 0;

  if (target === "12x36") {
    targetWidth = 10800;
    targetHeight = 3600;
  }

  if (target === "14x40") {
    targetWidth = 12000;
    targetHeight = 4200;
  }

  if (!targetWidth || !targetHeight) {

    return;
  }

  if (currentWidth === targetWidth && currentHeight === targetHeight) {
    return;
  }

  // ===========================
  // DISTORTION CORRECTION MATH
  // ===========================

  const widthScale = targetWidth / currentWidth;
  const heightScale = targetHeight / currentHeight;

  // Single axis correction (X only) to regain original ratio
  const scaleX = (heightScale / widthScale) * 100;
  const scaleY = 100; 

  await core.executeAsModal(
    async () => {
      // ===========================
      // RESIZE DOCUMENT
      // ===========================

      await action.batchPlay(
        [
          {
            _obj: "imageSize",
            width: {
              _unit: "pixelsUnit",
              _value: targetWidth,
            },
            height: {
              _unit: "pixelsUnit",
              _value: targetHeight,
            },
            constrainProportions: false,
          },
        ],
        {
          synchronousExecution: true,
        }
      );

      // ===========================
      // FIND TEC__ LAYERS
      // ===========================

      const allLayers = await getAllLayers(app.activeDocument.layers);

      const tscLayers = allLayers.filter(
        (layer) => layer.name && layer.name.startsWith("TEC__")
      );

      

     // ===========================
      // FIX DISTORTION (ROCK SOLID BATCHPLAY)
      // ===========================

      const start = Date.now();

      for (const layer of tscLayers) {

        // 1. Force Select Layer via batchPlay (Bulletproof selection)
        await action.batchPlay(
          [
            {
              _obj: "select",
              _target: [
                {
                  _ref: "layer",
                  _id: layer.id,
                },
              ],
              makeVisible: false,
            },
          ],
          {
            synchronousExecution: true,
          }
        );

        // 2. Transform the active layer
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
                _value: scaleX,
              },
              height: {
                _unit: "percentUnit",
                _value: scaleY, // 100% (No change on Y)
              },
            },
          ],
          {
            synchronousExecution: true,
          }
        );
      }

    },
    {
      commandName: "Album Convert",
    }
  );
}

// =====================================
// RECURSIVE LAYER SCAN
// =====================================

async function getAllLayers(layers, result = []) {
  for (const layer of layers) {
    result.push(layer);

    if (layer.layers && layer.layers.length) {
      await getAllLayers(layer.layers, result);
    }
  }

  return result;
}

module.exports = handleConvert;