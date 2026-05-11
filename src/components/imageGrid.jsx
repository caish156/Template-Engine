// components/ImageGrid.jsx

import React from "react";

export default function ImageGrid({ images, onImageClick }) {
  return (
    <div
      id="imageList"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        padding: "10px",
      }}
    >
      {images.map((item, index) => (
        <ImageCard key={index} item={item} onImageClick={onImageClick} />
      ))}
    </div>
  );
}

function ImageCard({ item, onImageClick }) {
  return (
    <div
      data-orientation="landscape"
      data-path={item.path}
      data-used={item.used ? "true" : "false"}
      style={{
        width: "78px",
        height: "78px",
        pointerEvents: "auto",
      }}
    >
      <button
        onClick={() => onImageClick(item)}
        style={{
          padding: 0,
          border: "none",
          width: "70px",
          height: "70px",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <img
          src={item.url}
          style={{
            width: "70px",
            height: "70px",
            objectFit: "cover",
            opacity: item.used ? 0.3 : 1,
          }}
        />
      </button>
    </div>
  );
}
