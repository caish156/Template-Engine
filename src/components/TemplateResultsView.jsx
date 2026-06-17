const React = require("react");

const photoshop = window.require("photoshop");
const { app } = photoshop;
const { core } = photoshop;
const { store } = require("../store/store");

function TemplateResultsView() {
  async function openTemplate(item) {
    try {
      const dialog = document.getElementById("imageOverlay");

      if (dialog) {
        dialog.close();
      }

      await new Promise((r) => setTimeout(r, 50));

      await core.executeAsModal(
        async () => {
          await app.open(item.file);
        },
        {
          commandName: "Open Template",
        },
      );
    } catch (error) {
      console.log("OPEN TEMPLATE ERROR:", error);
    }
  }

  const templates = store.templateResults || [];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        padding: "12px",
      }}
    >
      {templates.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => openTemplate(item)}
            style={{
              width: "360px",
              height: "120px",
              margin: "5px",
              background: "#303030",
              cursor: "pointer",
              border: "1px solid #444",
              overflow: "hidden",
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

            <div
              style={{
                position: "absolute",
                left: "0",
                right: "0",
                bottom: "0",
                padding: "4px 6px",
                background: "rgba(0,0,0,0.65)",
                fontSize: "10px",
                color: "#d4d4d4",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

module.exports = TemplateResultsView;
