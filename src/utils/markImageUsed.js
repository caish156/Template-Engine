const state = require("../state/state");

function markImageUsed(path) {
  if (!state.usedImages.includes(path)) {
    state.usedImages.push(path);
  }
}

module.exports = {
  markImageUsed,
};
