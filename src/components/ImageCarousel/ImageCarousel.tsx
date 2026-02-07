import React from "react";
import "./ImageCarousel.css";

// Sample images
const IMAGES = [
  "https://picsum.photos/id/1015/300/200",
  "https://picsum.photos/id/1016/300/200",
  "https://picsum.photos/id/1018/300/200",
  "https://picsum.photos/id/1020/300/200",
  "https://picsum.photos/id/1024/300/200",
  "https://picsum.photos/id/1027/300/200",
  "https://picsum.photos/id/1035/300/200",
  "https://picsum.photos/id/1039/300/200",
  "https://picsum.photos/id/1041/300/200",
];

const ImageCarousel: React.FC = () => {
  return (
    <div className="gallery-page">
      <h2>Horizontal Auto-Scrolling Gallery</h2>
      <div className="gallery-container horizontal">
        <div className="gallery-track horizontal-track">
          {IMAGES.concat(IMAGES).map((src, index) => (
            <div key={index} className="gallery-item horizontal-item">
              <img src={src} alt={`Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <h2>Vertical Auto-Scrolling Gallery</h2>
      <div className="gallery-container vertical">
        <div className="gallery-track vertical-track">
          {IMAGES.concat(IMAGES).map((src, index) => (
            <div key={index} className="gallery-item vertical-item">
              <img src={src} alt={`Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
