// utils/openSettingsDialog.js

const React = require("react");
const uxp = window.require("uxp");
const fs = uxp.storage.localFileSystem;
const { store } = require("../store/store");
const SettingsView = require("../components/settingview.jsx");
const { openDialog } = require("../components/openDialog");

async function openSettingsDialog() {
  openDialog({
    view: "settings",
    size: [300, 400],
  });
}

module.exports = {
  openSettingsDialog,
};
