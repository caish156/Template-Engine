// components/TemplateResultsView.jsx

const React = require("react");

const photoshop = window.require("photoshop");
const uxp = window.require("uxp");
const { app } = photoshop;

const { store } = require("../store/store");

function TemplateResultsView({ searchKey }) {
  const [templates, setTemplates] = React.useState([]);

  React.useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      await loadTemplates();
    } catch (error) {
      console.log("INIT ERROR:", error);
    }
  }

  async function loadTemplates() {
    try {
      console.log("SEARCH KEY:", searchKey);

      // RUNTIME FOLDER OBJECT

      const folder = store.templateFolder;
      console.log(folder);
      if (!folder) {
        console.log("NO TEMPLATE FOLDER");

        return;
      }

      console.log("FOLDER:", folder.nativePath);

      const entries = await folder.getEntries();

      console.log("TOTAL ENTRIES:", entries.length);

      // FILTER JPG

      const jpgFiles = entries.filter((file) => {
        const name = file.name.toLowerCase();

        return name.endsWith(".jpg") && name.includes(searchKey.toLowerCase());
      });

      console.log("MATCHED FILES:", jpgFiles);

      // RESULT

      const results = [];

      for (const file of jpgFiles) {
        try {
          const data = await file.read({
            format: uxp.storage.formats.binary,
          });

          const blob = new Blob([data], {
            type: "image/jpeg",
          });

          const url = URL.createObjectURL(blob);

          results.push({
            file,

            name: file.name,

            url,
          });
        } catch (error) {
          console.log("PREVIEW ERROR:", file.name);
        }
      }
      setTemplates(results);
    } catch (error) {
      console.log("LOAD TEMPLATE ERROR:", error);
    }
  }

  async function openTemplate(item) {
    try {
      // RUNTIME FOLDER OBJECT

      const folder = store.templateFolder;

      if (!folder) {
        console.log("NO TEMPLATE FOLDER");

        return;
      }

      const entries = await folder.getEntries();

      const psdName = item.name.replace(/\.jpg$/i, ".psd");

      console.log("SEARCH PSD:", psdName);

      const psdFile = entries.find(
        (file) => file.name.toLowerCase() === psdName.toLowerCase(),
      );

      if (!psdFile) {
        console.log("PSD NOT FOUND");

        return;
      }

      // CLOSE OVERLAY

      const dialog = document.getElementById("imageOverlay");

      if (dialog) {
        dialog.close();
      }

      // OPEN PSD

      await app.open(psdFile);

      console.log("PSD OPENED");
    } catch (error) {
      console.log("OPEN TEMPLATE ERROR:", error);
    }
  }

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
              width: "31%",

              height: "110px",
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
              src={item.url}
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
