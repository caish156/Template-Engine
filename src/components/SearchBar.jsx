const React = require("react");

const { openDialog } = require("./openDialog");

const ImageResultsView = require("./ImageResultsView.jsx");
const { loadFolderImages } = require("../utils/loadFolderImages");
const { store } = require("../store/store");

function SearchBar() {
  const [search, setSearch] = React.useState("");

  async function handleSearch() {
    try {
      const type = store.searchType;

      if (!search.trim()) return;

      store.searchKey = search.trim().toLowerCase();

      const assetRoot = store.settings.assetFolder;

      if (!assetRoot) {
        console.log("No Asset Folder");
        return;
      }

      const entries = await assetRoot.getEntries();

      const targetFolder = entries.find(
        (entry) =>
          entry.isFolder && entry.name.toLowerCase() === type.toLowerCase(),
      );

      if (!targetFolder) {
        console.log("Folder not found:", type);
        return;
      }

      store.pickerMode = "asset";

      console.log("SEARCH START");
      const mode = type === "template" ? "template" : "asset";

      await loadFolderImages(targetFolder, mode);
      const dialogSize = mode === "template" ? [900, 1200] : [700, 900];

      openDialog({
        view: "assets",
        size: dialogSize,
      });

      console.log("DIALOG OPEN");
      setSearch("");
      if (mode === "template") {
        console.log("RESULTS:", store.templateResults.length);
      } else {
        console.log("RESULTS:", store.assetResults.length);
      }
    } catch (err) {
      console.log("SEARCH ERROR:", err);
    }
  }

  function handleKeyDown(event) {
    console.log(event.key);
    if (event.key == "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="allRow">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />

      <button className="searchBtn" onClick={handleSearch}>
        S
      </button>
    </div>
  );
}

module.exports = SearchBar;
