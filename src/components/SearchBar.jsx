const React = require("react");

const { openDialog } = require("./openDialog");

const TemplateResultsView = require("./TemplateResultsView");

const { store } = require("../store/store");

function SearchBar() {
  const [search, setSearch] = React.useState("");

  async function handleSearch() {
    if (!search.trim()) return;

    // DROPDOWN VALUE FROM STORE

    const type = store.searchType;

    // =====================
    // TEMPLATE SEARCH
    // =====================

    if (type === "template") {
      const parts = search.trim().split(" ");

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
      console.log("clipart search");
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="searchBox">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />

      <button className="searchBtn" onClick={handleSearch}></button>
    </div>
  );
}

module.exports = SearchBar;
