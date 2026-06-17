const React = require("react");

const photoshop = window.require("photoshop");
const { app } = photoshop;

const { store } = require("../store/store");
const handleConvert =  require("../photoshop/sizeCovertor")
function AlbumSizeConverter() {
  const [currentSize, setCurrentSize] = React.useState("");

  const lastSizeRef = React.useRef("");

  React.useEffect(() => {
    detectAlbumSize();

    const timer = setInterval(() => {
      detectAlbumSize();
    }, 500);

    return () => clearInterval(timer);
  }, []);

  async function detectAlbumSize() {
    try {
      const doc = app.activeDocument;

      if (!doc) return;

      const width = Math.round(doc.width / 300);
      const height = Math.round(doc.height / 300);

      const size = `${height}x${width}`;

      if (lastSizeRef.current === size) {
        return;
      }

      lastSizeRef.current = size;

      setCurrentSize(size);

      store.currentAlbumSize = size;

      console.log("CURRENT SIZE:", size);
    } catch (err) {
      console.log(err);
    }
  }

 
  return (
    <>
      <div
        style={{
          minWidth: "40px",
          height: "40px",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          fontSize: "12px",
          color: "#d4d4d4",
          margin: "0px 0px 0px 10px",
          background: "#3a3a3a"
        }}
      >
        {currentSize || "--"}
      </div>

      <select
        className="dropdown2"
        defaultValue=""
        onChange={(e) => {
          store.albumSize = e.target.value;

          console.log(
            "TARGET CHANGED:",
            store.albumSize,
          );
        }}
      >
        <option value="">
          Select
        </option>

        <option value="12x36">
          12 x 36
        </option>

        <option value="14x40">
          14 x 40
        </option>
      </select>

      <button
        className="smallButton"
        onClick={handleConvert}
      >
        Convert
      </button>
    </>
  );
}

module.exports = AlbumSizeConverter;