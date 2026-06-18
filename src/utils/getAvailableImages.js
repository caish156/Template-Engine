const { app } = window.require("photoshop");

let usedImages = [];

// utils/getAvailableImages.js

function getAvailableImages(frameInfo) {

  try {
    const docs = app.documents;

    const result = [];

    for (const doc of docs) {
      const name = doc.title.toLowerCase();

      // SKIP PSD

      if (name.endsWith(".psd")) {
        continue;
      }

      // VALID IMAGE

      const validImage =
        name.endsWith(".jpg") ||
        name.endsWith(".jpeg") ||
        name.endsWith(".png");

      if (!validImage) {
        continue;
      }

      // IMAGE SIZE

      const width = Number(doc.width);

      const height = Number(doc.height);

      const ratio = width / height;

      const isLandscape = ratio > 1.25;

      const isPortrait = ratio < 0.85;

      const isCircle = !isLandscape && !isPortrait;

      // CIRCLE / SQUARE

      if (frameInfo.isCircle) {
        result.push(doc);
        continue;
      }

      // LANDSCAPE

      if (frameInfo.isLandscape && isLandscape) {
        result.push(doc);
        continue;
      }

      // PORTRAIT

      if (frameInfo.isPortrait && isPortrait) {
        result.push(doc);
      }
    }

      return result;
  } catch (err) {
    console.log("getAvailableImages error", err);

    throw err;
  }
}

function markImageUsed(imageName) {

  try {
    usedImages.push(imageName.toLowerCase());
  } catch (err) {
    console.log("markImageUsed error", err);
  }
}

function clearUsedImages() {

  try {
    usedImages = [];
  } catch (err) {
    console.log("clearUsedImages error", err);
  }
}

module.exports = {
  getAvailableImages,
  markImageUsed,
  clearUsedImages,
};
