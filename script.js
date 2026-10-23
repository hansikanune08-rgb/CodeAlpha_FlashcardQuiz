
const defaultFlashcards = [
    {
        question: "What is HTML?",
        answer: "HTML stands for HyperText Markup Language. It structures web pages."
    },
    {
        question: "What is CSS?",
        answer: "CSS stands for Cascading Style Sheets. It styles web pages."
    },
    {
        question: "What is JavaScript?",
        answer: "JavaScript adds interactivity and functionality to web pages."
    },
    {
        question: "What does CPU stand for?",
        answer: "CPU stands for Central Processing Unit."
    },
    {
        question: "What is the capital of India?",
        answer: "New Delhi."
    }
];

// Load saved flashcards from Local Storage
let flashcards;

try {
    const savedCards = localStorage.getItem("flashcards");

    if (savedCards !== null) {
        const parsedCards = JSON.parse(savedCards);

        if (
            Array.isArray(parsedCards) &&
            parsedCards.every(card =>
                card &&
                typeof card.question === "string" &&
                typeof card.answer === "string"
            )
        ) {
            flashcards = parsedCards;
        } else {
            flashcards = [...defaultFlashcards];
        }
    } else {
        flashcards = [...defaultFlashcards];
    }
} catch (error) {
    flashcards = [...defaultFlashcards];
}

// Save flashcards to Local Storage
function saveFlashcards() {
    try {
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
    } catch (error) {
        alert("Unable to save flashcards in this browser.");
    }
}

let currentIndex = 0;
let showingAnswer = false;

// Get HTML elements
const cardTitle = document.getElementById("card-title");
const cardContent = document.getElementById("card-content");
const cardCount = document.getElementById("card-count");

const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");

const showAnswerButton = document.getElementById("show-answer");
const prevButton = document.getElementById("prev-card");
const nextButton = document.getElementById("next-card");

// Display the current flashcard
function displayCard() {
    if (flashcards.length === 0) {
        cardTitle.textContent = "No Flashcards";
        cardContent.textContent = "Add a new flashcard to start learning!";
        cardCount.textContent = "Card 0 of 0";

        showAnswerButton.disabled = true;
        prevButton.disabled = true;
        nextButton.disabled = true;

        return;
    }

    showAnswerButton.disabled = false;
    prevButton.disabled = false;
    nextButton.disabled = false;

    const card = flashcards[currentIndex];

    cardTitle.textContent = showingAnswer ? "Answer" : "Question";
    cardContent.textContent = showingAnswer
        ? card.answer
        : card.question;

    cardCount.textContent =
        `Card ${currentIndex + 1} of ${flashcards.length}`;

    showAnswerButton.textContent = showingAnswer
        ? "Show Question"
        : "Show Answer";
}

// Show or hide the answer
showAnswerButton.addEventListener("click", function () {
    if (flashcards.length === 0) return;

    showingAnswer = !showingAnswer;
    displayCard();
});

// Display the previous flashcard
prevButton.addEventListener("click", function () {
    if (flashcards.length === 0) return;

    currentIndex =
        (currentIndex - 1 + flashcards.length) % flashcards.length;

    showingAnswer = false;
    displayCard();
});

// Display the next flashcard
nextButton.addEventListener("click", function () {
    if (flashcards.length === 0) return;

    currentIndex = (currentIndex + 1) % flashcards.length;

    showingAnswer = false;
    displayCard();
});

// Add a new flashcard
document.getElementById("add-card").addEventListener("click", function () {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        alert("Please enter both a question and an answer.");
        return;
    }

    flashcards.push({ question, answer });
    saveFlashcards();

    currentIndex = flashcards.length - 1;
    showingAnswer = false;

    questionInput.value = "";
    answerInput.value = "";

    displayCard();
    alert("Flashcard added successfully!");
});

// Edit the current flashcard
document.getElementById("edit-card").addEventListener("click", function () {
    if (flashcards.length === 0) {
        alert("There is no flashcard to edit.");
        return;
    }

    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();

    if (!question || !answer) {
        alert("Enter the updated question and answer in both fields.");
        return;
    }

    flashcards[currentIndex] = { question, answer };
    saveFlashcards();

    showingAnswer = false;

    questionInput.value = "";
    answerInput.value = "";

    displayCard();
    alert("Flashcard updated successfully!");
});

// Delete the current flashcard
document.getElementById("delete-card").addEventListener("click", function () {
    if (flashcards.length === 0) {
        alert("There is no flashcard to delete.");
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this flashcard?"
    );

    if (!confirmed) return;

    flashcards.splice(currentIndex, 1);
    saveFlashcards();

    if (currentIndex >= flashcards.length) {
        currentIndex = Math.max(0, flashcards.length - 1);
    }

    showingAnswer = false;

    displayCard();
    alert("Flashcard deleted successfully!");
});

// Display the first flashcard when the app opens
displayCard();
