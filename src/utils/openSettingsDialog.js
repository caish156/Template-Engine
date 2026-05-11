// utils/openSettingsDialog.js

const React = require("react");
const uxp = window.require("uxp");
const fs = uxp.storage.localFileSystem;
const { store } = require("../store/store");
const SettingsView = require("../components/settingview.jsx");
const { openDialog } = require("../components/openDialog");

async function openSettingsDialog() {
  console.log("openSettingsDialog");
  openDialog({
    type: "settings",
    width: "340px",
    height: "260px",
    data: [{}],
    component: React.createElement(SettingsView),
  });
}

module.exports = {
  openSettingsDialog,
};
