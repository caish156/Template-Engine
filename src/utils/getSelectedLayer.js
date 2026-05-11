const photoshop = window.require("photoshop");

async function getSelectedLayer(doc) {
  const layer = doc.activeLayers[0];

  if (!layer) {
    throw new Error("Select frame layer");
  }

  return layer;
}

module.exports = {
  getSelectedLayer,
};
