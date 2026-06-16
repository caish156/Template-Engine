const { store } = require("../store/store");
const uxp = window.require("uxp");
const { generateThumbnail } = require("./generateThumbnail");

async function loadFolderImages(rootFolder, view = "image") {
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

    await scanFolderRecursive(rootFolder, view);

    console.log("ALL IMAGES READY");

    console.log(store.images);
  } catch (err) {
    console.log("loadFolderImages error", err);
  }
}

// =========================================
// RECURSIVE SCAN
// =========================================

async function scanFolderRecursive(folder, view) {
  try {
    const entries = await folder.getEntries();

    // =====================
    // VALID FILES
    // =====================

    const validFiles = entries.filter((entry) => {
      if (!entry.isFile) return false;

      const lower = entry.name.toLowerCase();

      return (
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".webp") ||
        lower.endsWith(".psd") ||
        lower.endsWith(".psb")
      );
    });

    // =====================
    // FIND CACHE
    // =====================

    let thumbCacheFolder = entries.find(
      (entry) => entry.isFolder && entry.name === ".thumb_cache",
    );

    // =====================
    // CREATE CACHE ONLY
    // IF FILES EXIST
    // =====================

    if (validFiles.length > 0 && !thumbCacheFolder) {
      thumbCacheFolder = await folder.createFolder(".thumb_cache");

      console.log("created .thumb_cache", folder.nativePath);
    }

    // =====================
    // LOOP ENTRIES
    // =====================

    for (const entry of entries) {
      // =====================
      // SKIP CACHE
      // =====================

      if (entry.isFolder && entry.name === ".thumb_cache") {
        continue;
      }

      // =====================
      // RECURSIVE
      // =====================

      if (entry.isFolder) {
        await scanFolderRecursive(entry, view);

        continue;
      }

      // =====================
      // FILE TYPE
      // =====================

      const lower = entry.name.toLowerCase();

      const isImage =
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".webp");

      const isPSD = lower.endsWith(".psd") || lower.endsWith(".psb");

      if (!isImage && !isPSD) {
        continue;
      }

      if (view === "image" && !isImage) {
        continue;
      }
      const searchKey = (store.searchKey || "").trim().toLowerCase();

      if (searchKey && !entry.name.toLowerCase().includes(searchKey)) {
        continue;
      }
      // =====================
      // NO CACHE
      // =====================

      if (!thumbCacheFolder) {
        continue;
      }

      // =====================
      // THUMB NAME
      // =====================

      const baseName = entry.name.replace(/\.[^/.]+$/, "");

      const thumbName = `${baseName}_thumb.jpg`;

      // =====================
      // FIND THUMB
      // =====================

      let thumbFile = null;

      try {
        thumbFile = await thumbCacheFolder.getEntry(thumbName);

        console.log("thumb exists", thumbName);
      } catch {
        console.log("thumb missing", thumbName);
      }

      // =====================
      // GENERATE
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
          original: entry.nativePath,
          thumb: thumbFile.nativePath,
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
