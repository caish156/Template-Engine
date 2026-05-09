const { app } = require("photoshop");

function getActivePSD() {
  const doc = app.activeDocument;

  if (!doc) {
    throw new Error("No document open");
  }

  const isPSD = doc.title.toLowerCase().endsWith(".psd");

  if (!isPSD) {
    throw new Error("Open PSD template");
  }

  return doc;
}

module.exports = {
  getActivePSD,
};
