// utils/showImages.js

const { store } = require("../store/store");

const { placeImage } = require("../functions/placeImage");

const uxp = require("uxp");

async function showImages(images) {
  console.log("showImages");

  try {
    const container = document.getElementById("imageList");

    // IMPORTANT
    // ONLY FIRST TIME

    if (container.children.length > 0) {
      console.log("already rendered");

      return;
    }

    for (const file of images) {
      // READ FILE

      const data = await file.read({
        format: uxp.storage.formats.binary,
      });

      // BLOB

      const blob = new Blob([data], {
        type: "image/jpeg",
      });

      // URL

      const url = URL.createObjectURL(blob);

      // CARD
      const btn = document.createElement("button");

      btn.style.padding = "0";

      btn.style.border = "none";
      btn.style.width = "70px";

      btn.style.height = "70px";
      btn.style.background = "transparent";

      btn.style.cursor = "pointer";

      const img = document.createElement("img");

      img.src = url;

      img.style.width = "70px";

      img.style.height = "70px";

      img.style.objectFit = "cover";

      btn.appendChild(img);

      btn.onclick = async () => {
        await placeImage(file);
      };
      const card = document.createElement("div");

      card.style.display = "inline-block";

      card.style.width = "78px";

      card.style.height = "78px";
      card.style.pointerEvents = "auto";
      // IMAGE

      card.dataset.orientation = "all";

      card.dataset.path = file.nativePath;

      card.dataset.used = "false";

      card.dataset.orientation = "landscape";
      // ? "landscape"
      // : isPortrait
      //   ? "portrait"
      //   : "circle";

      // CLICK

      img.onclick = async () => {
        await placeImage(file, window.currentFrameLayer);

        // USED
        console.log("thumbnail clicked");
        card.dataset.used = "true";

        img.style.opacity = "0.3";
      };

      card.appendChild(btn);

      container.appendChild(card);
    }
  } catch (err) {
    console.log("showImages error", err);
  }
}

module.exports = {
  showImages,
};
