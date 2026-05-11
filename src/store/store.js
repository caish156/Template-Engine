// src/store/store.js

const store = {
  images: [],

  currentFolder: null,

  currentFrameBounds: null,

  fillMode: false,

  overlayVisible: false,

  listenerStarted: false,

  lastLayerId: null,

  searchType: "template",

  // RUNTIME FOLDER OBJECTS

  templateFolder: null,

  clipartFolder: null,

  // PERSISTENT TOKENS

  settings: {
    templateFolder: "",

    clipartFolder: "",
  },
};

module.exports = {
  store,
};
