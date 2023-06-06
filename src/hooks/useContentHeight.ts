import { useState, useEffect } from "react";

function getContentheight() {
  const body = document.body;

  // const html = document.documentElement;
  /*console.log("body.scrollHeight", body.scrollHeight);
  console.log("body.offsetHeight", body.offsetHeight);
  console.log("html.clientHeight", html.clientHeight);
  console.log("html.scrollHeight", html.scrollHeight);
  console.log("html.offsetHeight", html.offsetHeight);*/

  const height = body.offsetHeight;
  return height;
}

export default function useContentHeight() {
  const [height, setHeight] = useState(getContentheight());

  useEffect(() => {
    function handleResize() {
      setHeight(getContentheight());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleResize() {
      setHeight(getContentheight());
    }

    document.addEventListener("readystatechange", handleResize);
    return () => document.removeEventListener("readystatechange", handleResize);
  }, []);

  return { height };
}
