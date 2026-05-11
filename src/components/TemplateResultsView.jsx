// components/TemplateResultsView.jsx

const React = require("react");

const uxp = window.require("uxp");

const photoshop = window.require("photoshop");

const { app } = photoshop;

const { store } = require("../store/store");

function TemplateResultsView({ searchKey }) {
  const [templates, setTemplates] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        await loadTemplates();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function loadTemplates() {
    try {
      console.log("SEARCH KEY:", searchKey);

      console.log("TEMPLATE FOLDER:", store.templateFolder);

      const folder = store.templateFolder;

      if (!folder) {
        console.log("No Template Folder");

        return;
      }

      const entries = await folder.getEntries();

      // ONLY JPG

      const jpgFiles = entries.filter((file) => {
        const name = file.name.toLowerCase();

        return name.endsWith(".jpg") && name.includes(searchKey);
      });

      console.log(jpgFiles);

      const results = [];

      for (const file of jpgFiles) {
        const binary = await file.read({
          format: uxp.storage.formats.binary,
        });

        const blob = new Blob([binary], {
          type: "image/jpeg",
        });

        const url = URL.createObjectURL(blob);

        results.push({
          file,
          url,
          name: file.name,
        });
      }

      setTemplates(results);
    } catch (error) {
      console.log("LOAD TEMPLATE ERROR:", error);
    }
  }

  async function openTemplate(item) {
    try {
      const folder = store.templateFolder;

      if (!folder) return;

      const entries = await folder.getEntries();

      const psdName = item.name.replace(/\.jpg$/i, ".psd");

      const psdFile = entries.find((file) => file.name === psdName);

      if (!psdFile) {
        console.log("PSD NOT FOUND");

        return;
      }

      const dialog = document.getElementById("imageOverlay");

      if (dialog) {
        dialog.close();
      }

      await app.open(psdFile);
    } catch (error) {
      console.log("OPEN TEMPLATE ERROR:", error);
    }
  }

  return (
    <div
      style={{
        display: "flex",

        flexWrap: "wrap",

        gap: "16px",
      }}
    >
      {templates.map((item, index) => {
        const isWide = item.name.includes("14x40");

        return (
          <div
            key={index}
            onClick={() => openTemplate(item)}
            style={{
              width: isWide ? "220px" : "140px",

              paddingTop: isWide ? "12px" : "0px",

              paddingBottom: isWide ? "12px" : "0px",

              background: "#303030",

              borderRadius: "10px",

              overflow: "hidden",

              cursor: "pointer",

              border: "1px solid #444",
            }}
          >
            <img
              src={item.url}
              style={{
                width: "100%",

                aspectRatio: "1 / 3",

                objectFit: "cover",

                display: "block",
              }}
            />

            <div
              style={{
                padding: "8px",

                fontSize: "11px",

                color: "#d4d4d4",

                textAlign: "center",
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
