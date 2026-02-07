import { useRef, useState } from "react";
import "./InfiniteScroll.css";

const InfiniteScroll: React.FC = () => {
  const [verticalItems, setVerticalItems] = useState<number[]>(
  Array.from({ length: 11 }, (_, i) => i + 1)
);

const [horizontalItems, setHorizontalItems] = useState<number[]>(
  Array.from({ length: 11 }, (_, i) => i + 1)
);


  const horiRef = useRef<HTMLDivElement | null>(null);
  const verRef = useRef<HTMLDivElement | null>(null);

  const verScroll = () => {
    const verEl = verRef.current;
    if (
      (verEl?.clientHeight || 0) + (verEl?.scrollTop || 0) >=
      (verEl?.scrollHeight || 0) - 12
    ) {
      setVerticalItems((pre: number[]) => [
        ...pre,
        ...Array.from({ length: 10 }, (_,i) => i+1 ),
      ]);
    }
  };
  const horiScroll = () => {
    const horiRefEl = horiRef.current;
    if (
      (horiRefEl?.clientWidth || 0) + (horiRefEl?.scrollLeft || 0) >=
      (horiRefEl?.scrollWidth || 0) - 12
    ) {
      setHorizontalItems((pre: number[]) => [
        ...pre,
        ...Array.from({ length: 10 }, (_,i) => i+1 ),
      ]);
    }
  };
  return (
    <div className="page">
      <h2>Vertical Infinite Scroll</h2>
      <div className="container vertical" ref={verRef} onScroll={verScroll}>
        {verticalItems.map((item, index) => (
          <div key={index} className="item">
            Vertical Item {index + 1}
          </div>
        ))}
      </div>

      <h2>Horizontal Infinite Scroll</h2>
      <div className="container horizontal" ref={horiRef} onScroll={horiScroll}>
        {horizontalItems.map((item,index) => (
          <div key={index} className="item horizontal-item">
            Horizontal {index+1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;
