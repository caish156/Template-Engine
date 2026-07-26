const React = require("react");
const { openDialog } = require("./openDialog");
const { loadFolderImages } = require("../utils/loadFolderImages");
const { store } = require("../store/store");

function SearchBar() {
  const [search, setSearch] = React.useState("");

  async function handleSearch() {
    try {
      const type = store.searchType;

      if (!search.trim()) return;

      store.searchKey = search.trim().toLowerCase();

      const assetRoot = store.assetFolder;

      if (!assetRoot) {
    
        return;
      }

      const entries = await assetRoot.getEntries();

      const targetFolder = entries.find(
        (entry) =>
          entry.isFolder && entry.name.toLowerCase() === type.toLowerCase(),
      );

      if (!targetFolder) {
     
        return;
      }

      store.pickerMode = "asset";

     
      const mode = type === "template" ? "template" : "asset";

      await loadFolderImages(targetFolder, mode);
      const dialogSize = mode === "template" ? [900, 1200] : [700, 900];

      openDialog({
        view: "assets",
        size: dialogSize,
      });

   
      setSearch("");
      if (mode === "template") {
      } else {
      }
    } catch (err) {
      console.log("SEARCH ERROR:", err);
    }
  }

  function handleKeyDown(event) {
   
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
