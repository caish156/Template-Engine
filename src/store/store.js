// src/store/store.js

const store = {
  albumSize: "--x--",
  imageResults: [],
  assetResults: [],
  templateResults: [],
  currentFolder: null,
  currentFolderPath: null,
  imageFolder: null,
  assetFolderCurrent: null,
  fillMode: false,
  overlayVisible: false,
  overlayView: null,
  listenerStarted: false,
  lastLayerId: null,
  searchType: "template",
  searchKey: "",
  settings: {
    assetFolder: null,
  },
};

module.exports = {
  store,
};
