// utils/settings.js

const uxp = window.require("uxp");
const fs = uxp.storage.localFileSystem;
const { formats } = uxp.storage;
const { store } = require("../store/store");

// ======================
// DEFAULT SETTINGS
// ======================

const defaultSettings = {
  templatePath: "",
  clipartPath: "",
};

// ======================
// GET DATA FOLDER FILE
// ======================

async function getSettingsFile() {
  const dataFolder = await fs.getDataFolder();

  try {
    return await dataFolder.getEntry("path.json");
  } catch (error) {
    return await dataFolder.createFile("path.json", {
      overwrite: true,
    });
  }
}

// ======================
// SAVE SETTINGS
// ======================

async function saveSettings() {
  const file = await getSettingsFile();

  const settingsData = {
    templatePath: store.settings.templatePath,
    clipartPath: store.settings.clipartPath,
  };

  await file.write(JSON.stringify(settingsData, null, 2), {
    format: formats.utf8,
  });

  console.log("Settings Saved");
}

// ======================
// LOAD SETTINGS
// ======================

async function loadSettings() {
  try {
    const file = await getSettingsFile();

    const content = await file.read({
      format: formats.utf8,
    });

    if (!content) {
      store.settings = {
        ...defaultSettings,
      };

      return;
    }

    const settings = JSON.parse(content);

    store.settings = {
      ...defaultSettings,
      ...settings,
    };

    console.log("Settings Loaded:", store.settings);
  } catch (error) {
    console.log("Settings Load Error", error);

    store.settings = {
      ...defaultSettings,
    };
  }
}

// ======================
// TEMPLATE PATH
// ======================

async function setTemplatePath(path) {
  store.settings.templatePath = path;

  await saveSettings();
}

// ======================
// CLIPART PATH
// ======================

async function setClipartPath(path) {
  store.settings.clipartPath = path;

  await saveSettings();
}

module.exports = {
  loadSettings,

  saveSettings,

  setTemplatePath,

  setClipartPath,
};
