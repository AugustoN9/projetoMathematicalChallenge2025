const quizData = [
  {
    question: "Quanto é 5 + 3?",
    img: "",
    options: ["6", "8", "9"],
    answer: "8"
  },
  {
    question: "Resolva: 9 × 7 = ?",
    img: "",
    options: ["56", "63", "72"],
    answer: "63"
  },
  {
    question: "Qual é a fração equivalente a 1/2?",
    img: "",
    options: ["2/4", "3/6", "4/10"],
    answer: "2/4"
  },
  {
    question: "Qual figura mostra um triângulo?",
    img: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Triangle_-_black_simple.svg",
    options: ["A", "B", "C"],
    answer: "A"
  },
  {
    question: "Quanto é 12 ÷ 4?",
    img: "",
    options: ["2", "3", "4"],
    answer: "3"
  }
];

let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const questionImg = document.getElementById("question-img");
const optionsContainer = document.getElementById("options");
const progressBar = document.getElementById("progress-bar");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");
const starsContainer = document.getElementById("stars");
const quizContent = document.getElementById("quiz-content");
const restartBtn = document.getElementById("restart-btn");

function loadQuestion() {
  const q = quizData[currentQuestion];
  questionText.textContent = q.question;

  if (q.img) {
    questionImg.src = q.img;
    questionImg.classList.remove("d-none");
  } else {
    questionImg.classList.add("d-none");
  }

  optionsContainer.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary m-2";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsContainer.appendChild(btn);
  });

  updateProgress();
}

function checkAnswer(selected) {
  if (selected === quizData[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function updateProgress() {
  const progress = ((currentQuestion) / quizData.length) * 100;
  progressBar.style.width = progress + "%";
}

function showResults() {
  quizContent.classList.add("d-none");
  resultContainer.classList.remove("d-none");

  const total = quizData.length;
  const percent = (score / total) * 100;
  resultText.textContent = `Você acertou ${score} de ${total} perguntas. (${percent.toFixed(0)}%)`;

  starsContainer.innerHTML = "";
  let stars = 0;
  if (percent >= 100) stars = 5;
  else if (percent >= 90) stars = 4;
  else if (percent >= 80) stars = 3;
  else if (percent >= 70) stars = 2;
  else if (percent >= 50) stars = 1;

  for (let i = 0; i < stars; i++) {
    starsContainer.innerHTML += "⭐";
  }
  for (let i = stars; i < 5; i++) {
    starsContainer.innerHTML += "<span class='star' style='color: lightgray;'>⭐</span>";
  }

  progressBar.style.width = "100%";
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  quizContent.classList.remove("d-none");
  resultContainer.classList.add("d-none");
  loadQuestion();
});

loadQuestion();
