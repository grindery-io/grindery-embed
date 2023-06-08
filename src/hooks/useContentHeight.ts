import { useState, useEffect } from "react";

export default function useContentHeight() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      setHeight(entries[0].target.clientHeight);
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { height };
}
