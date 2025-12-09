const questions = [
  "In a code language: TREE → VTGG \nWhat will be the code for ROPE?",
  "If YESTERDAY was Friday, then what day is TOMORROW?",
  "Which food brand said: “Taste mein best, mummy aur rest”?",
  "What is the capital of Canada?",
  "Which two leaders met in early December 2025 marking the 23rd annual summit between their countries?",
  "What has a neck but no head?",
  "I have no life but i can die what am i?",
  "What has cities, but no houses?",
  "What is always in front of you but can't be seen?",
  "What goes up but never comes down?",
  "What can you catch but not throw?",
  "What has one eye but cannot see?",
  "What gets bigger the more you take away?",
  "What goes around the world but stays in a corner?",
  "What kind of band never plays music?"
];

const answers = [
  "TQRG",
  "Sunday",
  "Maggi",
  "Ottawa",
  "modi and putin",
  "Battery",
  "egg",
  "map",
  "future",
  "age",
  "cold",
  "needle",
  "hole",
  "stamp",
  "rubber band"
];

const riddles = [
  ["\"Far from where lessons glow bright,\nYou stand where silence takes its height.\nMove to the end of this very wall,\nThe corner sitting at the far right call.\""],
  ["\"This corner watches everything below,\nBut truth appears where teachers show.\nGo straight ahead without turning wide,\nStand beneath where ideas are applied.\""],
  ["\"Here markers glide and knowledge speaks,\nBut where people enter is what you seek.\nMove right along this teaching plane,\nStop where entry breaks the chain.\""],
  ["\"Where journeys start and choices are made,\nBehind you rests the quieter shade.\nTurn around and walk the same line straight,\nHalfway up the distant wall is your next gate.\""]
  ["\"Don’t stay here where the room feels still,\nWhat you seek lies across this hill.\nLook straight ahead—no corner, no fall,\nYour next clue waits on the opposite wall.\""]

  ["\"Behind you, middle of that wall.\""],
  ["What kind of band never plays music?"],
  ["What belongs to you, but other people use it more than you do?"],
  ["What has a thumb and four fingers but is not alive?", "What has a heart that doesn't beat?"],
  ["What has many teeth, but can't bite?", "What has a bed but never sleeps?"],
  ["What comes down but never goes up?", "What can fill a room but takes up no space?"],
  ["What has a head, a tail, is brown, and has no legs?", "What has many keys but can't open a single lock?"],
  ["What has a ring but no finger?", "What gets bigger the more you take away?"],
  ["What gets bigger the more you take away?", "What goes up but never comes down?"],
  ["What goes up but never comes down?", "What can travel around the world while staying in a corner?"],
  ["What can travel around the world while staying in a corner?", "What has hands but cannot clap?"],
  ["What has hands but cannot clap?", "What runs but never walks?"]
];

function getQuestionIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = parseInt(params.get("q"), 10);
  if (!isNaN(q) && q >= 1 && q <= questions.length) {
    return q - 1;
  }
  return 0;
}

let currentQuestion = getQuestionIndexFromURL();

const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const messageDiv = document.getElementById("message");
const riddlesContainer = document.getElementById("riddles-container");
const progressSpan = document.getElementById("progress");

// Backend URL configuration
const BACKEND_URL = "https://tech-escape-room-backend.onrender.com/";



function loadQuestion() {
  currentQuestion = getQuestionIndexFromURL();

  if (currentQuestion >= questions.length) {
    questionText.textContent = "Quiz complete!";
    progressSpan.textContent = "All 15 questions done";
    answerInput.style.display = "none";
    submitBtn.style.display = "none";
    riddlesContainer.innerHTML = "";
    messageDiv.textContent = "";
    return;
  }

  questionText.textContent = questions[currentQuestion];
  progressSpan.textContent = `Question ${currentQuestion + 1} of 15`;

  answerInput.value = "";
  messageDiv.textContent = "";
  riddlesContainer.innerHTML = "";
  answerInput.disabled = false;
  submitBtn.disabled = false;
  answerInput.focus();
}

async function checkAnswer() {
  const userAnswer = answerInput.value.trim();
  const correctAnswer = answers[currentQuestion];
  const questionNumber = currentQuestion + 1;

  messageDiv.textContent = "Checking answer...";
  messageDiv.className = "text-gray-500 font-semibold";
  answerInput.disabled = true;
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${BACKEND_URL}/check_answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        correctAnswer, 
        userAnswer,
        questionNumber
      })
    });

    const result = await response.json();
    const isCorrect = result.correct;

    messageDiv.classList.remove("text-gray-500");
    messageDiv.classList.remove("text-red-600");
    messageDiv.classList.remove("text-green-600");

    if (isCorrect) {
      messageDiv.textContent = "Correct!";
      messageDiv.className = "text-green-600 font-semibold";

      let riddleSet =
        currentQuestion < 6
          ? riddles[currentQuestion].slice(0, 1)
          : riddles[currentQuestion].slice(0, 2);

      riddlesContainer.innerHTML = "";

      riddleSet.forEach((r) => {
        const rDiv = document.createElement("div");
        rDiv.className = "bg-yellow-100 rounded p-2 text-gray-800";
        rDiv.textContent = r;
        riddlesContainer.appendChild(rDiv);
      });

    } else {
      messageDiv.textContent = "Try next question";
      messageDiv.className = "text-red-600 font-semibold";
    }

  } catch (err) {
    messageDiv.textContent = "Error connecting to server.";
    messageDiv.className = "text-red-600 font-semibold";
  }

  answerInput.disabled = false;
  submitBtn.disabled = false;
}

submitBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkAnswer();
});

window.addEventListener("popstate", loadQuestion);

loadQuestion();