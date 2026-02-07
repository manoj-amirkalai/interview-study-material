import React, { useEffect, useRef, useState } from "react";
import "./AutoScrollVerticalGalleryManual.css";

// 50 images
const IMAGES = Array.from({ length: 50 }, (_, i) => `https://picsum.photos/id/${1000 + i}/300/300`);

const AutoScrollVerticalGalleryManual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 0.5; // pixels per frame
    let animationFrameId: number;

    const autoScroll = () => {
      if (!isHovered) {
        container.scrollTop += scrollAmount;

        // If reached half of the scroll (duplicated images), reset to start
        if (container.scrollTop >= container.scrollHeight / 2) {
          container.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  // Duplicate images for seamless scroll
  const allImages = IMAGES.concat(IMAGES);

  return (
    <div
      className="manual-gallery-container"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {allImages.map((src, index) => (
        <div key={index} className="manual-gallery-item">
          <img src={src} alt={`Gallery ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default AutoScrollVerticalGalleryManual;
