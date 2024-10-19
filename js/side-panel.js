const sidePanel = document.getElementById("json-side-panel");
const openButton = document.getElementById("open-side-panel");
const closeButton = document.querySelector(".close-btn");
const backdrop = document.getElementById("backdrop");
const questionSet = document.querySelector("ul");

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

const closePanel = () => {
  sidePanel.style.left = "-400px";
  backdrop.style.display = "none"; // Hide the backdrop when the panel is closed
  openButton.style.display = "block"; // Show the button when the panel is closed
};

const showPanel = () => {
  sidePanel.style.left = "0";
  backdrop.style.display = "block"; // Show the backdrop when the panel is open
  openButton.style.display = "none"; // Hide the button when the panel is open
};
