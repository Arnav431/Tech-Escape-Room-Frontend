// script.js (updated riddle selection per user's sequence)

const questions = [
  "In a certain code language: PLAIN → ROFPY CHAIR → EJCLV Using the same logic, what is the code for BRAIN?",
  "Find the missing number: 4, 9, 19, 39, 79, __",
  "Find the missing number: 3, 8, 18, 35, 61, __",
  "In a code language: TREE → VTGG What will be the code for ROPE?",
  "If YESTERDAY was Friday, then what day is TOMORROW?",
  "Which food brand said: Taste mein best, mummy aur rest?",
  "What is the capital of Canada?",
  "Which two leaders met in early December 2025 marking the 23rd annual summit between their countries?",
  "I have no life but i can die what am i?",
  "Find the missing number: 2, 5, 13, 31, 69, __",
  "Fill in the blank: AC, DF, IK, PR, __ ",
  "They follow the relations: ◇ + □ = 26 | □ × ☆ = 42 | ◇ + ☆ = 20 | Using the above information, find the value of: ◇ + □ + ☆ ",
  "Find the next term in the series: 2A5, 4C9, 8G17, 16M33, __ ?",
  "What goes around the world but stays in a corner?",
  "What kind of band never plays music?"
];

const answers = [
  "DTCLV",
  "159",
  "98",
  "TQRG",
  "Sunday",
  "Maggi",
  "Ottawa",
  "Modi & Putin",
  "Battery",
  "147",
  "YA",
  "34",
  "32U65"
  // note: original file had fewer answers than questions; keep as-is unless you want to add more
];

// Riddles: flat array, riddle1 -> index 0, ... riddle16 -> index 15
const riddles = [
  "\"Safed deewar ke samne ek takht hamesha sajta, Wahi kursi aur mez pe aaj tumhaara agla raaz basta.\"",
  "\"Yeh sheher 25 gharon ka, paanch-paanch ki galiyāon mein basa, Seedhi nahi ulti ginti se teesri gali pakadna, Aur us gali mein left se doosra chhota makan, Us chhat ke neeche, tumhaara chhupa samaan.\"",
  "\"Jahan tum abhi baithe ho, wahan se baatein hawa mein udaana socho, Chalk se nahi, signal se poore room ko padhana socho. Ek chhota sa dabba, jisme taar kam, par jadoo zyada chalta, Chamkati si roshniyon se, poore lab ka saans sambhalta. Us kone mein dhoondo jahan se ‘No Network’ ka rona sabse kam sunai deta\"",
  "\"Jahan se nigaah sab par tikti, wahan se dekhna thoda aage, Jahan roshni be-aawaz kahaani likhe hawa ke saaye. Par jo saamne dikhta, wahi nahi sach maana jaata— Parde ke peeche hi aksar asli raaz paaya jaata.\"",
  "\"Jahan chhota box chamakta hai, jisse sabko network milta, Wahin se seedhe nazar uthao jahan projector upar hilta. Bilkul uske neeche dekho, jahan shadow sa tikta, Agle raaz ka kagaz wahi chup-chap sikhta\"",
  "\"Don’t stay here where the room feels still, What you seek lies across this hill. Look straight ahead—no corner, no fall, Your next clue waits on the opposite wall\"",
  "\"Behind you, middle of that wall.\"",
  "\"Here markers glide and knowledge speaks, But where people enter is what you seek. Move right along this teaching plane, Stop where entry breaks the chain\"",
  "\"Far from where lessons glow bright, You stand where silence takes its height. Move to the end of this very wall, The corner sitting at the far right call.\"",
  "\"Where journeys start and choices are made, Behind you rests the quieter shade. Turn around and walk the same line straight, Halfway up the distant wall is your next gate.\"",
  "\"This corner watches everything below, But truth appears where teachers show. Go straight ahead without turning wide, Stand beneath where ideas are applied.\"",
  "\"Jahan safed parda khamoshi mein kahaniyon ko chhipaati. Us poshak ke peeche hi chupchaap ek raaz basa, Wahi tumhara agla mod, jise dhoondhna ab tumhara kaam hua.\"",
  "\"jahan safed sa parda kahani dikhata hai. use mat pakadna aur bhi bahut hai okayyy!!\"",
  "\"Mere saamne khade ho jao toh main tumhe dikhata hoon, par kabhi tumhara chehra vaapas nahi dikhata. Main sheesha bhi hoon aur sheesha bilkul bhi nahi. Jis jagah par har waqt ungliyon ki tapping sunai deti hai, rakhe sheeshe ke pass mai tumhara intezaar kar raha hoon\"",
  "\"Congatulation!!! You Cracked it!! Escape Code IS \\\"Yeh Dil Mange More...\\\" \"",
  "\"Mere saamne khade ho jao toh main tumhe dikhata hoon, par kabhi tumhara chehra vaapas nahi dikhata. Main sheesha bhi hoon aur sheesha bilkul bhi nahi. Jis jagah par har waqt ungliyon ki tapping sunai deti hai, rakhe sheeshe ke pass mai tumhara intezaar kar raha hoon\""
];

// getQuestionIndexFromURL, DOM references and BACKEND_URL left unchanged
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

const BACKEND_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://tech-escape-room-backend.onrender.com";

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
  progressSpan.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

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

  console.log('🔍 Answer Checking Details:');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Current Question Index:', currentQuestion);
  console.log('Correct Answer:', correctAnswer);
  console.log('User Answer:', userAnswer);
  console.log('Question Number:', questionNumber);

  messageDiv.textContent = "🔎Checking your answer...";
  messageDiv.className = "text-gray-500 font-semibold";
  answerInput.disabled = true;
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${BACKEND_URL}/check_answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        correctAnswer,
        userAnswer,
        questionNumber
      })
    });

    console.log('Response Status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('Result:', result);

    const isCorrect = result.correct;

    messageDiv.classList.remove("text-gray-500");
    messageDiv.classList.remove("text-red-600");
    messageDiv.classList.remove("text-green-600");

    if (isCorrect) {
      messageDiv.textContent = "Correct!";
      messageDiv.className = "text-green-600 font-semibold";

      // riddleSet determined by exact sequence provided by the user
      let riddleSet = [];

      switch (currentQuestion) {
        case 0: // Q1 -> riddle 1 & 2
          riddleSet = [riddles[0], riddles[1]];
          break;
        case 1: // Q2 -> riddle 3 & 4
          riddleSet = [riddles[2], riddles[3]];
          break;
        case 2: // Q3 -> riddle 5
          riddleSet = [riddles[4]];
          break;
        case 3: // Q4 -> riddle 6
          riddleSet = [riddles[5]];
          break;
        case 4: // Q5 -> riddle 7
          riddleSet = [riddles[6]];
          break;
        case 5: // Q6 -> riddle 8
          riddleSet = [riddles[7]];
          break;
        case 6: // Q7 -> riddle 9
          riddleSet = [riddles[8]];
          break;
        case 7: // Q8 -> riddle 10
          riddleSet = [riddles[9]];
          break;
        case 8: // Q9 -> riddle 11
          riddleSet = [riddles[10]];
          break;
        case 9: // Q10 -> riddle 12 & 13
          riddleSet = [riddles[11], riddles[12]];
          break;
        case 10: // Q11 -> riddle 14
          riddleSet = [riddles[13]];
          break;
        case 11: // Q12 -> riddle 15
          riddleSet = [riddles[14]];
          break;
        case 12: // Q13 -> riddle 16
          riddleSet = [riddles[15]];
          break;
        default:
          // For Q14/Q15 or any other index not mapped, show a default single riddle or message
          riddleSet = ["\"No hidden riddle mapped for this question. Keep going!\""];
      }

      riddlesContainer.innerHTML = "";

      riddleSet.forEach((r, index) => {
        const rDiv = document.createElement("div");
        rDiv.className = "bg-yellow-100 rounded p-2 text-gray-800 mb-2";

        if (riddleSet.length > 1) {
          const headerSpan = document.createElement("span");
          headerSpan.className = "block text-sm font-bold mb-1 text-gray-600";
          headerSpan.textContent = `Riddle ${index + 1}`;
          rDiv.appendChild(headerSpan);
        }

        const textSpan = document.createElement("span");
        textSpan.textContent = r;
        rDiv.appendChild(textSpan);
        riddlesContainer.appendChild(rDiv);
      });

    } else {
      messageDiv.textContent = "Try next question!!";
      messageDiv.className = "text-red-600 font-semibold";
    }

  } catch (err) {
    console.error('❌ Error in checkAnswer:', err);
    messageDiv.textContent = `Error connecting to server: ${err.message}`;
    messageDiv.className = "text-red-600 font-semibold";
  }

  answerInput.disabled = false;
  submitBtn.disabled = false;
}

async function testServerConnection() {
  try {
    const response = await fetch(`${BACKEND_URL}/`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Server Connection Test:', data);
      return true;
    } else {
      console.error('Server connection test failed');
      return false;
    }
  } catch (err) {
    console.error('Error testing server connection:', err);
    return false;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  testServerConnection();
});

submitBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkAnswer();
});

window.addEventListener("popstate", loadQuestion);

loadQuestion();
