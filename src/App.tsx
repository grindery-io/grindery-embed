import React, { useEffect, useState } from "react";
import "./App.css";
import useContentHeight from "./hooks/useContentHeight";
import { sendPostMessage } from "./utils/postMessages";
import useConfig from "./hooks/useConfig";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page from "./components/Page";

function App() {
  const { height } = useContentHeight();
  const config = useConfig();
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    sendPostMessage("gr_resize", {
      height: height,
    });
  }, [height]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompleted(true);
      sendPostMessage("gr_complete");
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (Object.keys(config).length > 0) {
      console.log("config", config);
    }
  }, [config]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:triggerConnectorKey/:actionConnectorKey"
          element={<Page />}
        />
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <h3>Grindery integration mockup</h3>
                <p>{completed ? "Completed" : "In progress..."}</p>
              </header>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
