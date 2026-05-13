const React = require("react");

const { openDialog } = require("./openDialog");

const TemplateResultsView = require("./TemplateResultsView.jsx");

const { store } = require("../store/store");

function SearchBar() {
  const [search, setSearch] = React.useState("");

  async function handleSearch() {
    const type = store.searchType;
    if (!search.trim()) return;

    // =====================
    // TEMPLATE SEARCH
    // =====================

    if (type === "template") {
      const parts = search.trim().toLowerCase().split(/\s+/);

      const v = parts[0] || 0;

      const h = parts[1] || 0;

      const searchKey = `${v}v${h}h`;

      openDialog({
        type: "templates",

        width: "900px",

        height: "700px",

        component: React.createElement(TemplateResultsView, {
          searchKey,
        }),
      });
    }

    // =====================
    // CLIPART SEARCH
    // =====================

    if (type === "clipart") {
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
