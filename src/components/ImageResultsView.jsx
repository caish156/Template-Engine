const React = require("react");

const { store } = require(
  "../store/store"
);

const placeImage =
  require(
    "../photoshop/placeImage"
  ).placeImage;

// ======================
// STATIC STYLES
// ======================

const containerStyle = {
  display: "flex",

  flexWrap: "wrap",

  gap: "8px",

  padding: "10px",
};

function ImageResultsView() {

  console.log(placeImage);
  // ======================
  // LOAD IMAGES
  // ======================



  // ======================
  // PLACE IMAGE
  // ======================

async function handleImageClick(
  item
) {
  try {

    store.overlayVisible =
      false;

    const dialog =
      document.getElementById(
        "imageOverlay"
      );

    if (dialog) {
      dialog.close();
    }

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          50
        )
    );

    await placeImage(
      item.file
    );

  } catch (err) {
    console.log(err);
  }
}

  // ======================
  // UI
  // ======================

  return (
    <div style={containerStyle}>
      {store.images.map(
        (item, index) => {
          return (
            <div
              key={index}
              onClick={() =>
                handleImageClick(
                  item
                )
              }
              style={{
                width:
                  "120px",

                height:
                  "120px",

                background:
                  "#303030",

                cursor:
                  "pointer",

                border:
                  "1px solid #444",

                overflow:
                  "hidden",

                margin:
                  "5px",

                position:
                  "relative",

                flexShrink: 0,
              }}
            >
              <img
                src={
                  item.previewURL
                }
                loading="lazy"
                style={{
                  width:
                    "100%",

                  height:
                    "100%",

                  objectFit:
                    "contain",

                  background:
                    "#1f1f1f",

                  display:
                    "block",
                }}
              />
            </div>
          );
        }
      )}
    </div>
  );
}

module.exports =
  ImageResultsView;