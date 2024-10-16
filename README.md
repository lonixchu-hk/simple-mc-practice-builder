# Multiple Choice Practice Application

This is a simple web application for practicing multiple-choice questions. It allows users to navigate through questions, view options, and reveal the correct answer.

## Features

- Display multiple-choice questions
- Randomize the order of options
- Navigate between questions using "Previous" and "Next" buttons
- Show the correct answer for each question
- Display the current question number over the total count of questions

## Getting Started

### Prerequisites

To run this application, you need a web browser that supports JavaScript.

### Installation

1. Clone the repository or download the source code.
2. Open the `index.html` file in your web browser.

### JSON Format

The questions are stored in a `questions.json` file. Below is an example of the JSON format required:

```json
[
  {
    "question": "What is the capital of France?",
    "options": {
      "a": "Paris",
      "b": "London",
      "c": "Berlin",
      "d": "Madrid"
    },
    "answer": "a"
  },
  {
    "question": "Which planet is known as the Red Planet?",
    "options": {
      "a": "Earth",
      "b": "Mars",
      "c": "Jupiter",
      "d": "Saturn"
    },
    "answer": "b"
  }
]
```
