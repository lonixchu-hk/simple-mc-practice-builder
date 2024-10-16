document.addEventListener("DOMContentLoaded", () => {
  let questions = [];

  // Initialize variables
  let currentQuestionIndex = 0;
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const showAnswerButton = document.getElementById("show-answer");
  const answerElement = document.getElementById("answer");
  const jsonInsertButton = document.getElementById("json-insert");
  const jsonModal = document.getElementById("json-modal");
  const closeModal = document.querySelector(".close");
  const jsonFileInput = document.getElementById("json-file-input");
  const jsonTextarea = document.getElementById("json-textarea");
  const loadJsonButton = document.getElementById("load-json");
  const jsonProfilesList = document.getElementById("json-profiles");
  const profileNameElement = document.getElementById("profile-name"); // Added element for profile name

  // Function to display the current question
  function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    // Randomize the order of options
    const options = Object.entries(currentQuestion.options);
    options.sort(() => Math.random() - 0.5);

    // Store randomized options
    currentQuestion.randomizedOptions = options;

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Clear answer
    answerElement.textContent = "";

    // Create option elements.
    options.forEach(([id, text], index) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.textContent = `${String.fromCharCode(65 + index)}. ${text}`;
      optionElement.dataset.id = id;
      optionsContainer.appendChild(optionElement);

      // Add click event listener to each option
      optionElement.addEventListener("click", () => {
        // Remove tick and background color from previously selected option
        const previouslySelected = optionsContainer.querySelector(".selected");
        if (previouslySelected) {
          previouslySelected.classList.remove("selected");
          previouslySelected.textContent = previouslySelected.textContent.slice(
            0,
            -1
          ); // Remove tick
        }

        // Add tick and background color to the clicked option
        optionElement.classList.add("selected");
        optionElement.textContent += " ✔"; // Add tick
      });
    });

    updateQuestionInfo();
  }

  // Function to show the answer
  function showAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const answerId = currentQuestion.answer;
    const answerText = currentQuestion.options[answerId];
    const answerIndex = currentQuestion.randomizedOptions.findIndex(
      ([id]) => id === answerId
    );
    const answerCode = String.fromCharCode(65 + answerIndex);
    answerElement.textContent = `${answerCode}. ${answerText}`;
  }

  // Event listener for previous button
  prevButton.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      displayQuestion();
    }
  });

  // Event listener for next button
  nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion();
    }
  });

  // Event listener for show answer button
  showAnswerButton.addEventListener("click", () => {
    showAnswer();
  });

  function updateQuestionInfo() {
    document.getElementById("question-info").textContent = `${
      currentQuestionIndex + 1
    }/${questions.length}`;
  }

  // Save JSON profile to localStorage
  function saveJsonProfile(name, json) {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    const timestamp = new Date().toISOString();
    profiles.push({ name, json, timestamp });
    localStorage.setItem("jsonProfiles", JSON.stringify(profiles));
    loadJsonProfiles();
  }

  // Load JSON profiles from localStorage
  function loadJsonProfiles() {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    jsonProfilesList.innerHTML = "";
    profiles.forEach((profile, index) => {
      const li = document.createElement("li");
      li.textContent = profile.name;

      // Add delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteProfile(index);
      });

      li.appendChild(deleteButton);

      li.addEventListener("click", () => {
        questions = JSON.parse(profile.json);
        questions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        displayQuestion();
        jsonModal.style.display = "none";
        updateProfileTimestamp(index);
        profileNameElement.textContent = profile.name; // Set profile name
      });
      jsonProfilesList.appendChild(li);
    });
  }

  // Update the timestamp of a profile
  function updateProfileTimestamp(index) {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    profiles[index].timestamp = new Date().toISOString();
    localStorage.setItem("jsonProfiles", JSON.stringify(profiles));
  }

  // Delete a profile
  function deleteProfile(index) {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    profiles.splice(index, 1);
    localStorage.setItem("jsonProfiles", JSON.stringify(profiles));
    loadJsonProfiles();
  }

  // Load the latest used JSON profile
  function loadLatestProfile() {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    if (profiles.length > 0) {
      profiles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const latestProfile = profiles[0];
      questions = JSON.parse(latestProfile.json);
      questions.sort(() => Math.random() - 0.5);
      currentQuestionIndex = 0;
      displayQuestion();
      profileNameElement.textContent = latestProfile.name; // Set profile name
    }
  }

  // Event listener for JSON insert button
  jsonInsertButton.addEventListener("click", () => {
    jsonModal.style.display = "block";
    // clear the textarea and file input
    jsonTextarea.value = "";
    jsonFileInput.value = "";
    loadJsonProfiles();
  });

  // Event listener for closing the modal
  closeModal.addEventListener("click", () => {
    jsonModal.style.display = "none";
  });

  // Event listener for JSON file input
  jsonFileInput.addEventListener("change", () => {
    const file = jsonFileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target.result;
        questions = JSON.parse(json);
        questions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        displayQuestion();
        jsonModal.style.display = "none";
        const profileName = prompt("Enter a name for this JSON profile:");
        if (profileName) {
          saveJsonProfile(profileName, json);
          profileNameElement.textContent = profileName; // Set profile name
        }
      };
      reader.readAsText(file);
    }
  });

  // Event listener for loading JSON from textarea
  loadJsonButton.addEventListener("click", () => {
    const jsonText = jsonTextarea.value;
    if (jsonText) {
      questions = JSON.parse(jsonText);
      questions.sort(() => Math.random() - 0.5);
      currentQuestionIndex = 0;
      displayQuestion();
      jsonModal.style.display = "none";
      const profileName = prompt("Enter a name for this JSON profile:");
      if (profileName) {
        saveJsonProfile(profileName, jsonText);
        profileNameElement.textContent = profileName; // Set profile name
      }
    }
  });

  // Close the modal if the user clicks outside of it
  window.addEventListener("click", (event) => {
    if (event.target == jsonModal) {
      jsonModal.style.display = "none";
    }
  });

  // Display the JSON modal on page load and load profiles
  loadJsonProfiles();
  loadLatestProfile();

  if (!questions.length) {
    jsonModal.style.display = "block";
  }
});
