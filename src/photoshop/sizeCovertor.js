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

  console.log("CURRENT :", current);
  console.log("TARGET  :", target);

  if (!target) {
    console.log("NO TARGET");
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
    console.log("INVALID TARGET");
    return;
  }

  if (currentWidth === targetWidth && currentHeight === targetHeight) {
    console.log("ALREADY SAME SIZE IN PX");
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

  console.log("WIDTH SCALE:", widthScale);
  console.log("HEIGHT SCALE:", heightScale);
  console.log("FINAL SCALE X:", scaleX);
  console.log("FINAL SCALE Y:", scaleY);

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

      console.log("DOCUMENT RESIZED");

      // ===========================
      // FIND TEC__ LAYERS
      // ===========================

      const allLayers = await getAllLayers(app.activeDocument.layers);

      const tscLayers = allLayers.filter(
        (layer) => layer.name && layer.name.startsWith("TEC__")
      );

      console.log("TEC__ LAYERS FOUND:", tscLayers.length);

     // ===========================
      // FIX DISTORTION (ROCK SOLID BATCHPLAY)
      // ===========================

      console.log("STARTING TRANSFORM LOOP");
      const start = Date.now();

      for (const layer of tscLayers) {
        console.log("FIXING:", layer.name, "ID:", layer.id);

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

      console.log("TRANSFORM LOOP DONE");
      console.log("TIME(ms):", Date.now() - start);
      console.log("CONVERSION COMPLETE");
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