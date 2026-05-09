const uxp = require("uxp");

const state = require("../store/store");

const { showImages } = require("../utils/showImages");

async function loadFolder() {
  console.log("loadFolder");

  try {
    const folder = await uxp.storage.localFileSystem.getFolder();

    if (!folder) {
      return;
    }
    // RESET USED
    // IF NEW FOLDER

    if (state.currentFolderPath !== folder.nativePath) {
      state.usedImages = [];
    }

    state.currentFolderPath = folder.nativePath;
    // READ FILES

    const entries = await folder.getEntries();

    // FILTER IMAGES

    const images = entries.filter((file) => {
      const name = file.name.toLowerCase();

      return (
        name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")
      );
    });

    console.log("images", images.length);

    // SAVE STATE

    state.allImages = images;

    // SHOW THUMBNAILS

    showImages(images);
  } catch (err) {
    console.log("loadFolder error", err);
  }
}

module.exports = {
  loadFolder,
};
