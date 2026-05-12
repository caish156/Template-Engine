const React = require("react");

// ======================
// STATIC STYLES
// ======================

const containerStyle = {
  display: "flex",

  flexWrap: "wrap",

  gap: "8px",

  padding: "10px",
};

const cardStyle = {
  // width: "78px",
  // height: "78px",
};

const buttonStyle = {
  padding: 0,

  border: "none",

  // width: "70px",

  // height: "70px",

  background: "transparent",

  cursor: "pointer",
};

const imageStyle = {
  // width: "70px",
  // height: "70px",
  // objectFit: "cover",
};

function ImageResultsView({ images, onImageClick }) {
  return (
    <div style={containerStyle}>
      {images.map((item, index) => {
        return (
          <div key={index} style={cardStyle}>
            <button onClick={() => onImageClick(item)} style={buttonStyle}>
              <img
                src={`file://${image.path}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", object_fit: "cover" }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

module.exports = ImageResultsView;
