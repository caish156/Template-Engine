const uxp = window.require("uxp");
const photoshop = window.require("photoshop");

const { app } = photoshop;
const { core } = photoshop;
const { constants } = photoshop;

const action = photoshop.action;
const fs = uxp.storage.localFileSystem;

// =========================================
// MAIN
// =========================================

async function generateThumbnail({ imageFile, thumbFolder, thumbName }) {
  let doc = null;

  try {

    const isPSD =
      imageFile.name.toLowerCase().endsWith(".psd") ||
      imageFile.name.toLowerCase().endsWith(".psb");

    const MAX_SIZE = isPSD ? 1200 : 150;
    const JPEG_QUALITY = isPSD ? 90 : 40;

    // =====================
    // CREATE FILE
    // =====================

    const thumbFile = await thumbFolder.createFile(thumbName, {
      overwrite: true,
    });

    // =====================
    // SINGLE MODAL
    // =====================

    await core.executeAsModal(
      async () => {
        try {
          // =====================
          // OPEN
          // =====================

          doc = await app.open(imageFile);


          // =====================
          // SIZE
          // =====================

          let width = doc.width;
          let height = doc.height;

          const scale = MAX_SIZE / Math.max(width, height);

          width = Math.round(width * scale);
          height = Math.round(height * scale);

          // =====================
          // RESIZE
          // =====================

          await action.batchPlay(
            [
              {
                _obj: "imageSize",

                width: {
                  _unit: "pixelsUnit",
                  _value: width,
                },

                height: {
                  _unit: "pixelsUnit",
                  _value: height,
                },

                constrainProportions: true,

                interfaceIconFrameDimmed: {
                  _enum: "interpolationType",
                  _value: "automaticInterpolation",
                },
              },
            ],
            {
              synchronousExecution: true,
            },
          );

          // =====================
          // EXPORT
          // =====================

          await exportJPEG({
            file: thumbFile,
            quality: JPEG_QUALITY,
          });

        } finally {
          // =====================
          // CLOSE
          // =====================

          if (doc) {
            await doc.close(constants.SaveOptions.DONOTSAVECHANGES);
            doc = null;
          }
        }
      },
      {
        commandName: "Generate Thumbnail",
      },
    );


    return thumbFile;
  } catch (err) {
    console.log("generateThumbnail error", imageFile.name, err);

    doc = null;

    return null;
  }
}

// =========================================
// EXPORT JPEG
// =========================================

async function exportJPEG({ file, quality }) {
  const token = fs.createSessionToken(file);

  await action.batchPlay(
    [
      {
        _obj: "save",

        as: {
          _obj: "JPEG",

          extendedQuality: quality,

          matteColor: {
            _enum: "matteColor",
            _value: "none",
          },
        },

        in: {
          _path: token,
          _kind: "local",
        },

        lowerCase: true,

        saveStage: {
          _enum: "saveStageType",
          _value: "saveBegin",
        },
      },
    ],
    {
      synchronousExecution: true,
    },
  );
}

module.exports = {
  generateThumbnail,
};
