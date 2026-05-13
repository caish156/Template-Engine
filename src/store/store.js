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

  templateFolder: null,

  clipartFolder: null,

  // =====================
  // SETTINGS
  // =====================

  settings: {
    templateFolder: "",

    clipartFolder: "",
  },
};

module.exports = {
  store,
};