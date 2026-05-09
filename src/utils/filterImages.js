function filterImages(images, frameInfo) {
  return images.filter((file) => {
    const name = file.name.toLowerCase();

    return true;
  });
}

module.exports = {
  filterImages,
};
