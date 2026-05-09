const entrypoints = require("uxp").entrypoints;

entrypoints.setup({
  panels: {
    mainPanel: {
      show() {
        console.log("Plugin started");
      },
    },
  },
});