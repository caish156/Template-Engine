const { store } = require("../store/store");
const uxp = window.require("uxp");
const { generateThumbnail } = require("./generateThumbnail");

async function loadFolderImages(rootFolder, view) {
  if (view === "image") {
    store.imageFolder = rootFolder;
    store.imageResults = [];
  }

  if (view === "asset") {
    store.assetFolderCurrent = rootFolder;
    store.assetResults = [];
  }
  if (view === "template") {
    store.assetFolderCurrent = rootFolder;
    store.templateResults = [];
  }

  await scanFolderRecursive(rootFolder, view);
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


if (searchKey && !orderedMatch(entry.name, searchKey)) {
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

        const item = {
          file: entry,
          name: entry.name,
          original: entry.nativePath,
          thumb: thumbFile.nativePath,
          previewURL,
        };
        if (view === "image") {
          store.imageResults.push(item);
        }

        if (view === "asset") {
          store.assetResults.push(item);
        }

        if (view === "template") {
          if (!isPSD) {
            continue;
          }

          store.templateResults.push(item);
        }
      }
    }
  } catch (err) {
    console.log("scanFolderRecursive error", folder.nativePath, err);
  }
}
function orderedMatch(text, search) {
  text = text.toLowerCase();
  search = search.toLowerCase();

  let j = 0;

  for (let i = 0; i < text.length && j < search.length; i++) {
    if (text[i] === search[j]) {
      j++;
    }
  }

  return j === search.length;
}
module.exports = {
  loadFolderImages,
};
