const React = require("react");

const { store } = require("../store/store");
const { openAsset } = require("../photoshop/openAsset");

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  padding: "10px",
};

function AssetResultsView() {
  async function handleAssetClick(item) {
    try {
      const dialog = document.getElementById("imageOverlay");

      if (dialog) {
        dialog.close();
      }

      await new Promise((r) => setTimeout(r, 50));

      await openAsset(item.file);
    } catch (err) {
      console.log(err);
    }
  }

  const items = store.assetResults || [];

  return (
    <div style={containerStyle}>
      {items.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => handleAssetClick(item)}
            style={{
              width: "120px",
              height: "120px",
              background: "#303030",
              cursor: "pointer",
              border: "1px solid #444",
              overflow: "hidden",
              margin: "5px",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <img
              src={item.previewURL}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#1f1f1f",
                display: "block",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

module.exports = AssetResultsView;
