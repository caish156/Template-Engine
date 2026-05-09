function getFrameInfo(layer) {
  const bounds = layer.bounds;

  const width = bounds.right - bounds.left;

  const height = bounds.bottom - bounds.top;

  const ratio = width / height;

  const isLandscape = ratio > 1.25;

  const isPortrait = ratio < 0.85;

  const isCircle = !isLandscape && !isPortrait;

  return {
    width,
    height,
    ratio,

    isLandscape,
    isPortrait,
    isCircle,
  };
}

module.exports = {
  getFrameInfo,
};
