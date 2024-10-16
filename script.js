// Read the questions from the questions.json file
fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    const questions = data;

    // Question order is randomized
    questions.sort(() => Math.random() - 0.5);

    // Initialize variables
    let currentQuestionIndex = 0;
    const totalQuestions = questions.length; // Update this to the actual total number of questions
    const questionElement = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const showAnswerButton = document.getElementById("show-answer");
    const answerElement = document.getElementById("answer");

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
        optionElement.textContent = `${String.fromCharCode(
          65 + index
        )}. ${text}`;
        optionElement.dataset.id = id;
        optionsContainer.appendChild(optionElement);

        // Add click event listener to each option
        optionElement.addEventListener("click", () => {
          // Remove tick and background color from previously selected option
          const previouslySelected =
            optionsContainer.querySelector(".selected");
          if (previouslySelected) {
            previouslySelected.classList.remove("selected");
            previouslySelected.textContent =
              previouslySelected.textContent.slice(0, -1); // Remove tick
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
      }/${totalQuestions}`;
    }

    // Display the first question
    displayQuestion();
  })
  .catch((error) => {
    console.error("Error:", error);
  });
