function filterThumbnailView(frameInfo) {
  const cards = document.querySelectorAll("#imageList div");

  cards.forEach((card) => {
    const orientation = card.dataset.orientation;

    // SHOW ALL
    // FOR CIRCLE

    if (frameInfo.isCircle) {
      card.style.display = "inline-block";

      return;
    }

    // LANDSCAPE

    if (frameInfo.isLandscape && orientation === "landscape") {
      card.style.display = "inline-block";

      return;
    }

    // PORTRAIT

    if (frameInfo.isPortrait && orientation === "portrait") {
      card.style.display = "inline-block";

      return;
    }

    // HIDE

    card.style.display = "none";
  });
}

module.exports = {
  filterThumbnailView,
};
