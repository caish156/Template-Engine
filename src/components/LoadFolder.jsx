const React = require("react");

const uxp = window.require("uxp");
const { store } = require("../store/store");
const fs = uxp.storage.localFileSystem;

const { loadFolderImages } = require("../utils/loadFolderImages");

function FolderLoader() {
  async function openFolder() {
    try {
      const folder = await fs.getFolder();

      if (!folder) return;

      console.log("selected folder", folder.nativePath);

      store.imageFolder = folder;

      await loadFolderImages(folder, "image");

      console.log("folder loaded");
    } catch (err) {
      console.log("folder load error", err);
    }
  }

  return (
    <button className="loadButton" onClick={openFolder}>
      Load Folder
    </button>
  );
}

module.exports = FolderLoader;
