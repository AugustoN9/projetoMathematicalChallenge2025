const questions = [
  {
    question: "Quanto é 7 × 8?",
    image: "https://cdn-icons-png.flaticon.com/512/3582/3582033.png",
    options: ["54", "56", "64"],
    answer: 1
  },
  {
    question: "Qual é a raiz quadrada de 81?",
    image: "https://cdn-icons-png.flaticon.com/512/2251/2251129.png",
    options: ["8", "9", "10"],
    answer: 1
  },
  {
    question: "Resolva: 12 ÷ 3 + 4 = ?",
    image: "",
    options: ["8", "6", "12"],
    answer: 0
  },
  {
    question: "Quanto é (5² + 3²)?",
    image: "https://cdn-icons-png.flaticon.com/512/564/564429.png",
    options: ["25", "34", "50"],
    answer: 1
  },
  {
    question: "Quanto é 10% de 250?",
    image: "",
    options: ["20", "25", "30"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;

const quizContainer = document.getElementById("quiz-container");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress-bar");
const resultDiv = document.getElementById("result");
const starsDiv = document.getElementById("stars");

// Recuperar pontuação anterior
const savedScore = localStorage.getItem("quizScore");
if (savedScore) {
  resultDiv.innerHTML = `🔁 Último resultado salvo: <b>${savedScore}</b> acertos.`;
}

function loadQuestion() {
  const q = questions[currentQuestion];
  updateProgress();

  let html = `
    <h4 class="mb-3">${q.question}</h4>
    ${q.image ? `<img src="${q.image}" class="img-fluid my-3" style="max-width: 180px;">` : ""}
    <form id="quiz-form">
  `;

  q.options.forEach((option, index) => {
    html += `
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="answer" value="${index}" id="opt${index}">
        <label class="form-check-label" for="opt${index}">${option}</label>
      </div>
    `;
  });

  html += `</form>`;
  quizContainer.innerHTML = html;

  nextBtn.disabled = true;
  nextBtn.textContent = "Responder";
  const inputs = document.querySelectorAll('input[name="answer"]');
  inputs.forEach(input => input.addEventListener("change", () => (nextBtn.disabled = false)));

  nextBtn.removeEventListener("click", nextQuestion);
  nextBtn.addEventListener("click", checkAnswer);
}

function checkAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked');
  if (!selected) return;

  const answer = parseInt(selected.value);
  const correct = questions[currentQuestion].answer;
  const options = document.querySelectorAll(".form-check-input");

  options.forEach((opt, i) => {
    const label = opt.nextElementSibling;
    opt.disabled = true;
    if (i === correct) label.classList.add("text-success", "fw-bold");
    else if (i === answer) label.classList.add("text-danger");
  });

  if (answer === correct) {
    score++;
    quizContainer.insertAdjacentHTML("beforeend", `<div class="alert alert-success mt-3">✅ Correto!</div>`);
  } else {
    quizContainer.insertAdjacentHTML("beforeend", `<div class="alert alert-danger mt-3">❌ Errado! Resposta certa: <b>${questions[currentQuestion].options[correct]}</b></div>`);
  }

  nextBtn.textContent = currentQuestion === questions.length - 1 ? "Finalizar" : "Próxima";
  nextBtn.removeEventListener("click", checkAnswer);
  nextBtn.addEventListener("click", nextQuestion);
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const percent = (score / questions.length) * 100;
  const stars = getStars(percent);

  quizContainer.innerHTML = `
    <h3 class="mb-4">🎯 Resultado Final</h3>
    <p class="fs-5 mb-3">Você acertou <b>${score}</b> de <b>${questions.length}</b> perguntas.</p>
    <div class="fs-2 text-warning mb-3">${stars}</div>
    <p class="text-muted">Aproveite e tente novamente para melhorar sua pontuação!</p>
  `;

  nextBtn.classList.add("d-none");
  restartBtn.classList.remove("d-none");
  resultDiv.innerHTML = "";

  // Salvar pontuação
  localStorage.setItem("quizScore", score);
  updateStars(percent);
}

function updateProgress() {
  const percent = Math.round(((currentQuestion) / questions.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressBar.textContent = `${percent}%`;
}

// Função de cálculo das estrelas
function getStars(percent) {
  let starsCount = 0;
  if (percent >= 100) starsCount = 5;
  else if (percent >= 90) starsCount = 4;
  else if (percent >= 80) starsCount = 3;
  else if (percent >= 70) starsCount = 2;
  else if (percent >= 50) starsCount = 1;

  let stars = "★".repeat(starsCount) + "☆".repeat(5 - starsCount);
  return stars;
}

// Atualiza as estrelas no topo
function updateStars(percent = 0) {
  starsDiv.innerHTML = getStars(percent);
}

// Reiniciar quiz
restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  restartBtn.classList.add("d-none");
  nextBtn.classList.remove("d-none");
  loadQuestion();
  updateStars(0);
  progressBar.style.width = "0%";
  progressBar.textContent = "0%";
});

// Inicialização
loadQuestion();
updateStars(0);
