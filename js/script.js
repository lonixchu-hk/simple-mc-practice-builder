document.addEventListener("DOMContentLoaded", () => {
  let questions = [];

  // Initialize variables
  let currentQuestionIndex = 0;
  let selectedQuestionSetIndex = null;
  const questionElement = document.getElementById("question");
  const optionsContainer = document.getElementById("options");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const showAnswerButton = document.getElementById("show-answer");
  const answerElement = document.getElementById("answer");
  const jsonFileInput = document.getElementById("json-file-input");
  const jsonTextarea = document.getElementById("json-textarea");
  const loadJsonButton = document.getElementById("load-json");
  const jsonProfilesList = document.getElementById("json-profiles");
  const profileNameElement = document.getElementById("profile-name"); // Added element for profile name

  // Function to display the current question
  function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = `${currentQuestionIndex + 1}. ${
      currentQuestion.question
    }`;

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Clear answer
    answerElement.textContent = "";

    // Create option elements.
    currentQuestion.randomizedOptions.forEach(([id, text], index) => {
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
    showAnswerButton.textContent = "Show Answer"; // Reset button text
    answerElement.style.display = "none"; // Hide answer
  }

  // Function to show or hide the answer
  function toggleAnswer() {
    if (answerElement.style.display === "none") {
      const currentQuestion = questions[currentQuestionIndex];
      const answerId = currentQuestion.answer;
      const answerText = currentQuestion.options[answerId];
      const answerIndex = currentQuestion.randomizedOptions.findIndex(
        ([id]) => id === answerId
      );
      const answerCode = String.fromCharCode(65 + answerIndex);
      answerElement.textContent = `${answerCode}. ${answerText}`;
      answerElement.style.display = "block";
      showAnswerButton.textContent = "Hide Answer";
    } else {
      answerElement.style.display = "none";
      showAnswerButton.textContent = "Show Answer";
    }
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
    toggleAnswer();
  });

  function updateQuestionInfo() {
    document.getElementById("question-info").textContent = `${
      currentQuestionIndex + 1
    } / ${questions.length}`;
  }

  // Save JSON profile to localStorage
  function saveJsonProfile(name, json) {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    const timestamp = new Date().toISOString();
    profiles.push({ name, json, timestamp });
    localStorage.setItem("jsonProfiles", JSON.stringify(profiles));
    loadJsonProfiles();
    jsonTextarea.value = ""; // Clear textarea
  }

  // Load JSON profiles from localStorage
  function loadJsonProfiles() {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    jsonProfilesList.innerHTML = "";
    profiles.forEach((profile, index) => {
      const li = document.createElement("li");

      const questionSetName = document.createElement("span");
      questionSetName.textContent = profile.name;
      questionSetName.classList.add("question-set-name");
      li.appendChild(questionSetName);

      // Add buttons
      const buttonContainer = document.createElement("span");
      buttonContainer.classList.add("question-set-button-container");

      const exportButton = document.createElement("button");
      exportButton.classList.add("question-set-export-btn");
      exportButton.textContent = "Export";
      exportButton.addEventListener("click", (e) => {
        e.stopPropagation();
        // Export a json file
        const blob = new Blob([profile.json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${profile.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
      buttonContainer.appendChild(exportButton);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("question-set-delete-btn");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const confirmDelete = confirm(
          "Are you sure you want to delete this Question Set?"
        );
        if (confirmDelete) deleteProfile(index);
      });
      buttonContainer.appendChild(deleteButton);

      li.appendChild(buttonContainer);

      if (index === selectedQuestionSetIndex) {
        const tickMark = document.createElement("span");
        tickMark.textContent = "✔";
        tickMark.classList.add("tick-mark");
        li.appendChild(tickMark);
      }

      li.addEventListener("click", () => {
        loadQuestionsFromJson(profile.json);
        currentQuestionIndex = 0;
        selectedQuestionSetIndex = index;
        displayQuestion();
        updateProfileTimestamp(index);
        profileNameElement.textContent = profile.name; // Set profile name
        loadJsonProfiles();
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
    loadLatestProfile();
    if (!questions.length) {
      showPanel();
    }
  }

  // Load the latest used JSON profile
  function loadLatestProfile() {
    const profiles = JSON.parse(localStorage.getItem("jsonProfiles")) || [];
    if (profiles.length > 0) {
      const sortedProfiles = [...profiles].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const latestProfile = sortedProfiles[0];
      loadQuestionsFromJson(latestProfile.json);
      currentQuestionIndex = 0;
      selectedQuestionSetIndex = profiles.indexOf(latestProfile);
      displayQuestion();
      profileNameElement.textContent = latestProfile.name; // Set profile name
      loadJsonProfiles();
    }
  }

  // Function to load questions from JSON and randomize them
  function loadQuestionsFromJson(json) {
    questions = JSON.parse(json);

    // check if questions is empty.
    if (questions.length === 0) {
      alert("No questions found in the JSON file.");
      return false;
    }

    // Randomize the order of questions
    questions.sort(() => Math.random() - 0.5);

    // Randomize the options within each question
    questions.forEach((question) => {
      const options = Object.entries(question.options);
      options.sort(() => Math.random() - 0.5);
      question.randomizedOptions = options;
    });
    return true;
  }

  function saveQuestionSet(jsonText) {
    if (loadQuestionsFromJson(jsonText)) {
      const profileName = prompt("Enter a name for this JSON profile:");
      if (profileName) {
        saveJsonProfile(profileName, jsonText);
        profileNameElement.textContent = profileName; // Set profile name
        currentQuestionIndex = 0;
        displayQuestion();
      } else if (profileName !== null) {
        alert("Cannot save profile without a name. Please try again.");
      }
    }
  }

  // Event listener for JSON file input
  jsonFileInput.addEventListener("change", () => {
    const file = jsonFileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target.result;
        saveQuestionSet(json);
      };
      reader.readAsText(file);
    }
  });

  // Event listener for loading JSON from textarea
  loadJsonButton.addEventListener("click", () => {
    const jsonText = jsonTextarea.value;
    if (jsonText) {
      saveQuestionSet(jsonText);
    }
  });

  // Display the JSON modal on page load and load profiles
  loadJsonProfiles();
  loadLatestProfile();

  if (!questions.length) {
    showPanel();
  }
});
