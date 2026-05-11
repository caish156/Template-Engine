// src/store/store.js

const store = {
  images: [],

  currentFolder: null,

  currentFrameBounds: null,

  fillMode: false,

  overlayVisible: false,
  fillMode: false,
  listenerStarted: false,
  lastLayerId: null,
  settings: {
    templatePath: "",
    clipartPath: "",
    searchType: "template",
  },
};

module.exports = {
  store,
};
