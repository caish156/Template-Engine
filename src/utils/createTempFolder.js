const uxp = window.require("uxp");

const fs = uxp.storage.localFileSystem;

const { store } = require("../store/store");

async function createTempFolder() {
  try {
    const temp = await fs.getTemporaryFolder();

    let thumbFolder;

    try {
      thumbFolder = await temp.getEntry("thumb_cache");
    } catch (e) {
      thumbFolder = await temp.createFolder("thumb_cache");
    }

    store.thumbCachePath = thumbFolder.nativePath;

    console.log("TEMP CACHE READY");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createTempFolder,
};
