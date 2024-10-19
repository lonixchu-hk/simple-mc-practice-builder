const sidePanel = document.getElementById("json-side-panel");
const openButton = document.getElementById("open-side-panel");
const closeButton = document.querySelector(".close-btn");
const backdrop = document.getElementById("backdrop");
const questionSet = document.querySelector("ul");

const sampleJsonBtn = document.getElementById("show-json-structure");
const JsonSamplePopup = document.getElementById("json-structure-popup");
const closeJsonSamplePopup = document.getElementById(
  "json-structure-popup-close-btn"
);

openButton.addEventListener("click", () => {
  showPanel();
});

closeButton.addEventListener("click", () => {
  closePanel();
});

// Close the side panel if the user clicks on the backdrop
backdrop.addEventListener("click", () => {
  closePanel();
});

questionSet.addEventListener("click", (event) => {
  console.log(event);
  if (event.target.tagName === "LI" || event.target.tagName === "SPAN") {
    closePanel();
  }
});

closeJsonSamplePopup.addEventListener("click", () => {
  JsonSamplePopup.style.display = "none";
});

sampleJsonBtn.addEventListener("click", () => {
  JsonSamplePopup.style.display = "block";
});

const closePanel = () => {
  sidePanel.style.left = "-400px";
  backdrop.style.display = "none"; // Hide the backdrop when the panel is closed
  openButton.style.display = "block"; // Show the button when the panel is closed
  JsonSamplePopup.style.display = "none";
};

const showPanel = () => {
  sidePanel.style.left = "0";
  backdrop.style.display = "block"; // Show the backdrop when the panel is open
  openButton.style.display = "none"; // Hide the button when the panel is open
};
