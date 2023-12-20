import { updateButtonsPosition } from "../../utils/update-buttons-position";

const buttonContainer = document.createElement("div");
const saveButton = document.createElement("button");
const actionButton = document.createElement("button");
buttonContainer.appendChild(saveButton);
buttonContainer.appendChild(actionButton);

buttonContainer.style.position = "absolute";
buttonContainer.style.zIndex = "9999";
buttonContainer.style.backgroundColor = "white";
buttonContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
buttonContainer.style.borderRadius = "5px";
buttonContainer.style.padding = "10px";
buttonContainer.style.display = "flex";
buttonContainer.style.alignItems = "center";
buttonContainer.style.justifyContent = "center";
buttonContainer.style.flexDirection = "row";

const buttonStyle = {
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  margin: "5px",
  fontSize: "16px",
  fontWeight: "bold",
  hover: {
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  },
};

saveButton.textContent = "Save 🧠";
actionButton.textContent = "Do ⚡️";

Object.assign(saveButton.style, buttonStyle);
Object.assign(actionButton.style, buttonStyle);

let savedSelections: string[] = [];

saveButton.addEventListener("click", function () {
  let contentToSave = "";
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    // Save selected text or HTML
    const range = selection.getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());
    contentToSave = container.innerHTML;
  } else if (lastClickedElement) {
    // Save the HTML of the last clicked element if no selection is made
    contentToSave = lastClickedElement.innerHTML;
  }

  if (contentToSave) {
    savedSelections.push(contentToSave);
    console.log({ savedSelections });
    console.log("weee trying to save chrome storage from content script");
    chrome.storage.local.set({ savedSelections: savedSelections });
  }

  console.log("Save clicked!");
});

actionButton.addEventListener("click", function () {
  console.log("Action clicked!");
});

const pageHTML = document.documentElement.innerHTML;
chrome.runtime.sendMessage({
  code: "page_load_html",
  html: pageHTML,
});

let lastClickedElement: HTMLElement | null = null;

document.addEventListener("click", function (event) {
  if (
    event.target === saveButton ||
    event.target === actionButton ||
    event.target === buttonContainer
  ) {
    return;
  }
  // Remove outline and button from the last clicked element
  if (lastClickedElement && lastClickedElement !== event.target) {
    lastClickedElement.style.outline = "";
    lastClickedElement.style.outlineOffset = "";
  }

  const clickedElement = event.target as HTMLElement;
  const clickedElementHTML = clickedElement.innerHTML;

  clickedElement.setAttribute("data-ai-selected", Date.now().toString());
  clickedElement.style.outline = "2px solid orange";
  clickedElement.style.outlineOffset = "2px";
  clickedElement.style.position = "relative";

  updateButtonsPosition(event.target, buttonContainer);
  lastClickedElement = clickedElement;
  // Send this HTML back to your background script if needed
  chrome.runtime.sendMessage({
    code: "click",
    html: clickedElementHTML,
  });
});

function onScrollOrResize() {
  console.log("Scroll or resize now!");
  if (lastClickedElement) {
    updateButtonsPosition(lastClickedElement, buttonContainer);
  }
}
window.addEventListener("scroll", onScrollOrResize);
window.addEventListener("resize", onScrollOrResize);

document.addEventListener("mouseup", function () {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());
    const selectedHTML = container.innerHTML;

    // update buttons position
    updateButtonsPosition(range.startContainer.parentElement, buttonContainer);

    // Send this HTML back to your background script if needed
    chrome.runtime.sendMessage({
      code: "select",
      html: selectedHTML,
    });
  }
});

document.querySelectorAll("input, textarea").forEach((input) => {
  input.addEventListener("focus", function () {
    const focusedElementHTML = this.innerHTML;
    // Send this HTML back to your background script if needed
    chrome.runtime.sendMessage({
      code: "focus",
      html: focusedElementHTML,
    });

    this.addEventListener("blur", function () {
      const blurredElementHTML = this.innerHTML;
      // Send this HTML back to your background script if needed

      chrome.runtime.sendMessage({
        code: "blur",
        html: blurredElementHTML,
        value: this.value,
      });
    });

    this.addEventListener("input", function () {
      const inputElementHTML = this.innerHTML;
      // Send this HTML back to your background script if needed
      chrome.runtime.sendMessage({
        code: "input",
        html: inputElementHTML,
        value: this.value,
      });
    });
  });
});
