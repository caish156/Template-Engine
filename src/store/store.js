// src/store/store.js

const store = {
  // =====================
  // IMAGES
  // =====================

  images: [],

  currentFolder: null,

  currentFrameBounds: null,

  // =====================
  // MODES
  // =====================

  fillMode: false,
  scanRequired: false,
  // =====================
  // OVERLAY
  // =====================

  overlayVisible: false,

  overlayView: null,

  // =====================
  // LISTENER
  // =====================

  listenerStarted: false,

  lastLayerId: null,

  // =====================
  // SEARCH
  // =====================

  searchType: "template",

  searchKey: "",

  // =====================
  // FOLDERS
  // =====================

  // =====================
  // SETTINGS
  // =====================

  settings: {
    assetFolder: null,
  },
};

module.exports = {
  store,
};
