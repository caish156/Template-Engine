const uxp =
  window.require("uxp");

async function showImages(
  images
) {
  const imageData = [];

  for (const file of images) {
    try {
      // RAW READ

      const data =
        await file.read({
          format:
            uxp.storage
              .formats.binary,
        });

      // BLOB

      const blob =
        new Blob([data], {
          type:
            "image/jpeg",
        });

      // URL

      const url =
        URL.createObjectURL(
          blob
        );

      imageData.push({
        file,

        blob,

        url,

        path:
          file.nativePath,

        used: false,
      });
    } catch (error) {
      console.log(
        "IMAGE LOAD ERROR:",
        file.name
      );
    }
  }

  return imageData;
}

module.exports = {
  showImages,
};