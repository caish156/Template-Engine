const React = require("react");

const uxp = window.require("uxp");

const fs = uxp.storage.localFileSystem;

const { loadFolderImages } = require("../utils/loadFolderImages");

function FolderLoader() {
  async function openFolder() {
    try {
      // =====================
      // SELECT FOLDER
      // =====================

      const folder = await fs.getFolder();

      if (!folder) return;

      console.log("selected folder", folder.nativePath);

      // =====================
      // LOAD IMAGES
      // =====================

      await loadFolderImages(folder);

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
