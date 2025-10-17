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
  }
];

let currentQuestion = 0;
let score = 0;

const quizContainer = document.getElementById("quiz-container");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const resultDiv = document.getElementById("result");

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
  quizContainer.innerHTML = `
    <h3 class="mb-4">🎯 Resultado Final</h3>
    <p class="fs-5">Você acertou <b>${score}</b> de <b>${questions.length}</b> perguntas.</p>
  `;
  nextBtn.style.display = "none";
  resultDiv.innerHTML = "";

  // Salva no localStorage
  localStorage.setItem("quizScore", score);
}

function updateProgress() {
  const percent = Math.round(((currentQuestion) / questions.length) * 100);
  progressBar.style.width = `${percent}%`;
  progressBar.textContent = `${percent}%`;
}

// Inicialização
loadQuestion();
