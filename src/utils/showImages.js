async function showImages(images) {
  const imageData = [];

  for (const file of images) {
    try {
      imageData.push({
        file,

        path: file.nativePath,

        used: false,
      });
    } catch (error) {
      console.log("IMAGE LOAD ERROR:", file.name);
    }
  }

  return imageData;
}

module.exports = {
  showImages,
};
