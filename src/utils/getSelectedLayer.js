const photoshop = require("photoshop");

async function getSelectedLayer(doc) {
  const layer = doc.activeLayers[0];

  if (!layer) {
    throw new Error("Select frame layer");
  }

  // HIDE OVERLAYS / EFFECTS

  // await photoshop.action.batchPlay(
  //   [
  //     {
  //       _obj: "disableLayerFX",
  //       _target: [
  //         {
  //           _ref: "layer",
  //           _id: layer.id,
  //         },
  //       ],
  //     },
  //   ],
  //   {},
  // );

  return layer;
}

module.exports = {
  getSelectedLayer,
};
