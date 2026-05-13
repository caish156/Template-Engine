const React = require("react");

const uxp = window.require("uxp");

const fs = uxp.storage.localFileSystem;

const { store } = require("../store/store");

const { setClipartPath, setTemplatePath } = require("../utils/setting");

function SettingsView() {
  async function selectTemplateFolder() {
    const folder = await fs.getFolder();

    if (!folder) return;

    await setTemplatePath(folder);
  }

  async function selectClipartFolder() {
    const folder = await fs.getFolder();

    if (!folder) return;

    await setClipartPath(folder);
  }

  function closeDialog() {
    const dialog = document.getElementById("imageOverlay");

    if (dialog) {
      dialog.close();
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "7px",
      }}
    >
      {/* TEMPLATE */}

      <div>
        <div
          style={{
            marginBottom: "5px",
            fontSize: "12px",
            padding: "5px",
          }}
        >
          Templates Folder
        </div>

        <button
          onClick={selectTemplateFolder}
          style={{
            margin: "0px",
            width: "100%",
            height: "34px",
            background: "#3a3a3a",
            color: "#d4d4d4",
            border: "none",
            borderRadius: "4px",
            padding: "0 10px",
            textAlign: "left",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {store.templateFolder?.nativePath || "Browse"}
        </button>
      </div>

      {/* CLIPART */}

      <div>
        <div
          style={{
            marginBottom: "5px",
            fontSize: "12px",
            padding: "5px",
          }}
        >
          Clipart Folder
        </div>

        <button
          onClick={selectClipartFolder}
          style={{
            width: "100%",
            margin: "0px",
            height: "34px",
            background: "#3a3a3a",
            color: "#d4d4d4",
            border: "none",
            borderRadius: "4px",
            padding: "0 10px",
            textAlign: "left",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {store.clipartFolder?.nativePath || "Browse"}
        </button>
      </div>

      {/* CLOSE */}

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
