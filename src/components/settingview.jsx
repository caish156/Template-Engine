const React = require("react");

const uxp = window.require("uxp");

const fs = uxp.storage.localFileSystem;

const { store } = require("../store/store");
const { loadFolderImages } = require("../utils/loadFolderImages");
const { setClipartPath, setTemplatePath, setAssetPath } = require("../utils/setting");

function SettingsView() {
  async function selectAssetFolder() {
    const folder = await fs.getFolder();

    if (!folder) return;

    await setAssetPath(folder);

    closeDialog();
  }

  function closeDialog() {
    const dialog = document.getElementById("imageOverlay");

    if (dialog) {
      dialog.close();
    }
  }
  function clearDir() {
    store.assetFolder = null;
    store.settings.assetFolder = null;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "10px",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          fontWeight: "600",
        }}
      >
        Asset Root Folder
      </div>

      <button
        onClick={selectAssetFolder}
        className={`${store.assetFolder?.nativePath ? "active" : ""}`}
        style={{
          width: "100%",
          height: "36px",
          background: "#3a3a3a",
          color: "#d4d4d4",
          borderRadius: "4px",
          padding: "0 10px",
          textAlign: "left",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {store.assetFolder?.nativePath || "Select Asset Folder"}
      </button>

      <div
        style={{
          fontSize: "11px",
          opacity: 0.7,
          lineHeight: "16px",
        }}
      >
        Required folders:
        <br />
        Template, Floral, Leafs, Clipart, Text, Bg, Mask, Overlay
      </div>
      <button
        onClick={clearDir}
        style={{
          marginTop: "10px",
          height: "36px",
          background: "#444",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Clear
      </button>
      <button
        onClick={closeDialog}
        style={{
          marginTop: "10px",
          height: "36px",
          background: "#444",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Close
      </button>
    </div>
  );
}

module.exports = SettingsView;
