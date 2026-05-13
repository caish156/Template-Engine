const { store } = require("../store/store");
const uxp = window.require("uxp");
const { generateThumbnail } = require("./generateThumbnail");

async function loadFolderImages(rootFolder) {
  try {
    console.log("LOAD FOLDER START");

    // =====================
    // RESET
    // =====================

    store.images = [];

    store.currentFolder = rootFolder.nativePath;

    // =====================
    // START RECURSIVE SCAN
    // =====================

    await scanFolderRecursive(rootFolder);

    console.log("ALL IMAGES READY");

    console.log(store.images);
  } catch (err) {
    console.log("loadFolderImages error", err);
  }
}

// =========================================
// RECURSIVE SCAN
// =========================================

async function scanFolderRecursive(folder) {
  try {
    const entries = await folder.getEntries();

    // =====================
    // FIND / CREATE CACHE
    // =====================

    let thumbCacheFolder = entries.find(
      (entry) => entry.isFolder && entry.name === ".thumb_cache",
    );

    if (!thumbCacheFolder) {
      thumbCacheFolder = await folder.createFolder(".thumb_cache");

      console.log("created .thumb_cache", folder.nativePath);
    }

    // =====================
    // LOOP ENTRIES
    // =====================

    for (const entry of entries) {
      // =====================
      // SKIP CACHE FOLDER
      // =====================

      if (entry.isFolder && entry.name === ".thumb_cache") {
        continue;
      }

      // =====================
      // RECURSIVE FOLDER
      // =====================

      if (entry.isFolder) {
        await scanFolderRecursive(entry);

        continue;
      }

      // =====================
      // IMAGE CHECK
      // =====================

      const lower = entry.name.toLowerCase();

      const isImage =
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png");

      if (!isImage) {
        continue;
      }

      // =====================
      // THUMB NAME
      // =====================

      const baseName = entry.name.replace(/\.[^/.]+$/, "");

      const thumbName = `${baseName}_thumb.jpg`;

      // =====================
      // CHECK THUMB EXISTS
      // =====================

      let thumbFile = null;

      try {
        thumbFile = await thumbCacheFolder.getEntry(thumbName);

        console.log("thumb exists", thumbName);
      } catch (err) {
        console.log("thumb missing", thumbName);
      }

      // =====================
      // GENERATE IF MISSING
      // =====================

      if (!thumbFile) {
        thumbFile = await generateThumbnail({
          imageFile: entry,

          thumbFolder: thumbCacheFolder,

          thumbName,
        });
      }

      // =====================
      // STORE
      // =====================

      if (thumbFile) {
        const data = await thumbFile.read({
          format: uxp.storage.formats.binary,
        });

        const blob = new Blob([data], {
          type: "image/jpeg",
        });

        const previewURL = URL.createObjectURL(blob);

        store.images.push({
  file: entry,

  name: entry.name,

  original:
    entry.nativePath,

  thumb:
    thumbFile.nativePath,

  previewURL,
});
      }
    }
  } catch (err) {
    console.log("scanFolderRecursive error", folder.nativePath, err);
  }
}

module.exports = {
  loadFolderImages,
};
