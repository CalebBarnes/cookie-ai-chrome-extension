import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

// Define a basic React component
const App = () => {
  const [savedSelections, setSavedSelections] = useState([]);
  const loadSavedSelections = () => {
    chrome?.storage?.local?.get?.(["savedSelections"], function (result) {
      console.log("Value currently is " + result);
      if (result.savedSelections) {
        setSavedSelections(result.savedSelections);
      }
    });
  };
  useEffect(() => {
    // Function to load saved selections from Chrome storage
    const loadSavedSelections = () => {
      chrome?.storage?.local?.get?.(["savedSelections"], function (result) {
        console.log("Value currently is " + result);
        if (result.savedSelections) {
          setSavedSelections(result.savedSelections);
        }
      });
    };

    loadSavedSelections();
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const popout = urlParams.get("popout");

  return (
    <div>
      {!popout && (
        <button
          onClick={() => {
            chrome.windows.create({
              url: "src/pages/popup/index.html?popout=true",
              type: "popup",
              width: 500,
              height: 500,
              left: 100,
              top: 100,
            });
          }}
        >
          Pop out
        </button>
      )}
      <h1>Hello from Cookie AI</h1>
      <div>
        <h2>AI Saved Memory:</h2>{" "}
        <button
          onClick={() => {
            console.log("reloading");
            console.log(chrome.storage.local);
            loadSavedSelections();
          }}
        >
          reload
        </button>
        <ul>
          {savedSelections?.map?.((selection, index) => (
            <li key={index}>
              {selection}{" "}
              <button
                onClick={() => {
                  chrome?.storage?.local?.set?.({
                    savedSelections: savedSelections.filter(
                      (item) => item !== selection
                    ),
                  });
                  loadSavedSelections();
                }}
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Render the React component in the DOM
ReactDOM.render(<App />, document.getElementById("app"));
