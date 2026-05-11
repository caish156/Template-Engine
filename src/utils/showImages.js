// utils/showImages.js

const uxp = window.require("uxp");

async function showImages(images) {
  const imageData = [];

  for (const file of images) {
    const data = await file.read({
      format: uxp.storage.formats.binary,
    });

    const blob = new Blob([data], {
      type: "image/jpeg",
    });

    const url = URL.createObjectURL(blob);

    imageData.push({
      file,
      url,
      path: file.nativePath,
      used: false,
    });
  }

  return imageData;
}

module.exports = {
  showImages,
};
