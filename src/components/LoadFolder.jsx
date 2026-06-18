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

    

      store.imageFolder = folder;

      await loadFolderImages(folder, "image");


    } catch (err) {
   
    }
  }

  return (
    <button className="loadButton" onClick={openFolder}>
      Load Folder
    </button>
  );
}

module.exports = FolderLoader;
