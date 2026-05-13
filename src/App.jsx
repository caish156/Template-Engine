const React = require("react");
const uxp = window.require("uxp");
require("./styles/app.css");
const { showImages } = require("./utils/showImages");
const { startLayerListener } = require("./utils/startLayerListener");
const { openSettingsDialog } = require("./utils/openSettingsDialog");
const { store } = require("./store/store");
const SearchBar = require("./components/SearchBar");
const FolderLoader = require("./components/LoadFolder");

function App() {
  React.useEffect(() => {
    startLayerListener();
  }, []);

  const [fillMode, setFillMode] = React.useState(false);
  window.store = store;

  return (
    <div className="panel">
      <div className="allRow">
        <select
          className="dropdown"
          onChange={(e) => {
            store.searchType = e.target.value;
          }}
        >
          <option value="template">Template</option>

          <option value="clipart">Clipart</option>
        </select>

        <button className="iconButton">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.8L5.5 21L7.5 13.5L2 9H9L12 2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>

        <button className="iconButton" onClick={openSettingsDialog}>
          S
        </button>
      </div>

      <SearchBar />

      <div className="allRow">
        <button
          className={`mainButton ${fillMode ? "active" : ""}`}
          onClick={() => {
            const value = !fillMode;

            setFillMode(value);

            store.fillMode = value;
          }}
        >
          Fill
        </button>

        <button className="mainButton">Swap</button>
      </div>

      <div className="allRow">
        <button className="smallButton"> Left</button>

        <button className="smallButton"> Right</button>

        <button className="smallButton">Export</button>
      </div>
      <div className="allRow">
        <FolderLoader />
      </div>
    </div>
  );
}

module.exports = App;
