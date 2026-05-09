// const { getActivePSD } = require("../utils/getActivePSD");
// const { getSelectedLayer } = require("../utils/getSelectedLayer");
// const { getFrameInfo } = require("../utils/getFrameInfo");
// const { filterThumbnailView } = require("../utils/filterThumbnailView");
// const store = require("../store");

// async function fillFrame() {
//   console.log("fillFrame");

//   try {
//     // ACTIVE PSD
//     const doc = getActivePSD();

//     // SELECTED FRAME
//     const layer = getSelectedLayer(doc);
//     console.log("getSelectedLayer", layer, doc);
//     store.currentPSD = doc;
//     store.currentPSDId = doc.id;
//     store.currentFrame = layer;

//     const frameInfo = getFrameInfo(layer);

//     filterThumbnailView(frameInfo);
//   } catch (err) {
//     console.log("fillFrame error", err);
//   }
// }

// module.exports = {
//   fillFrame,
// };
