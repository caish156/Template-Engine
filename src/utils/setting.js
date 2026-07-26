// utils/settings.js

const uxp = window.require("uxp");

const fs = uxp.storage.localFileSystem;

const { formats } = uxp.storage;

const { store } = require("../store/store");

// ======================
// DEFAULT SETTINGS
// ======================

const defaultSettings = {
  templateFolder: "",

  clipartFolder: "",

  assetFolder: "",
};

// ======================
// GET SETTINGS FILE
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
    templateFolder: store.settings.templateFolder,

    clipartFolder: store.settings.clipartFolder,

    assetFolder: store.settings.assetFolder,
  };

  await file.write(JSON.stringify(settingsData, null, 2), {
    format: formats.utf8,
  });
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

    // ======================
    // RESTORE TEMPLATE
    // ======================

    if (store.settings.templateFolder) {
      try {
        const folder = await fs.getEntryForPersistentToken(
          store.settings.templateFolder,
        );

        store.templateFolder = folder;

        console.log("TEMPLATE RESTORED:", folder.nativePath);
      } catch (error) {
        console.log("TEMPLATE RESTORE FAILED");
      }
    }

    // ======================
    // RESTORE CLIPART
    // ======================

    if (store.settings.clipartFolder) {
      try {
        const folder = await fs.getEntryForPersistentToken(
          store.settings.clipartFolder,
        );

        store.clipartFolder = folder;

        console.log("CLIPART RESTORED:", folder.nativePath);
      } catch (error) {
        console.log("CLIPART RESTORE FAILED");
      }
    }

    // ======================
    // RESTORE ASSET
    // ======================

    if (store.settings.assetFolder) {
      try {
        const folder = await fs.getEntryForPersistentToken(
          store.settings.assetFolder,
        );

        store.assetFolder = folder;

        console.log("ASSET RESTORED:", folder.nativePath);
      } catch (error) {
        console.log("ASSET RESTORE FAILED");
      }
    }

    console.log("SETTINGS LOADED:", store.settings);
  } catch (error) {
    console.log("SETTINGS LOAD ERROR", error);

    store.settings = {
      ...defaultSettings,
    };
  }
}

// ======================
// TEMPLATE
// ======================

async function setTemplatePath(folder) {
  const token = await fs.createPersistentToken(folder);

  // RUNTIME OBJECT

  store.templateFolder = folder;

  // SAVE TOKEN

  store.settings.templateFolder = token;

  await saveSettings();
}

// ======================
// CLIPART
// ======================

async function setClipartPath(folder) {
  const token = await fs.createPersistentToken(folder);

  // RUNTIME OBJECT

  store.clipartFolder = folder;

  // SAVE TOKEN

  store.settings.clipartFolder = token;

  await saveSettings();
}

// ======================
// ASSET
// ======================

async function setAssetPath(folder) {
  const token = await fs.createPersistentToken(folder);

  // RUNTIME OBJECT

  store.assetFolder = folder;

  // SAVE TOKEN

  store.settings.assetFolder = token;

  await saveSettings();
}

module.exports = {
  loadSettings,

  saveSettings,

  setTemplatePath,

  setClipartPath,

  setAssetPath,
};
