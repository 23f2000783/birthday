/* ============================================================
   EDIT ME FIRST — everything below is made to be customized.
   No coding experience needed, just change the text between quotes.
   ============================================================ */

const FRIEND_NAME = "Friend";          // your friend's name
const YOUR_NAME   = "Your Name";       // your name
const MEET_DATE   = "2022-08-02";      // YYYY-MM-DD, the day you met (or any day you want to count from)

// 6 memory cards. "front" is what shows before flipping (kept short),
// "back" is the actual memory. Change all six to real ones!
const MEMORIES = [
  { emoji: "🎬", front: "The one with the terrible movie", back: "Replace this with the time we watched that awful movie and couldn't stop laughing about it for a week." },
  { emoji: "🌧️", front: "That rainy day", back: "Replace this with the story about getting caught in the rain and turning it into an adventure anyway." },
  { emoji: "🎂", front: "The birthday surprise", back: "Replace this with the birthday plan that almost fell apart but somehow worked out perfectly." },
  { emoji: "🚗", front: "The road trip playlist", back: "Replace this with the road trip where the same 5 songs played on loop and nobody minded." },
  { emoji: "📚", front: "The exam-week rescue", back: "Replace this with the time you saved me during exam week / a deadline / a crisis." },
  { emoji: "🌙", front: "The 2am phone call", back: "Replace this with the late-night conversation that somehow fixed everything." },
];

// Quiz questions — "answers" array, "correct" is the index (0-based) of the right one.
const QUIZ = [
  {
    q: "Where did we first meet?",
    answers: ["School", "Work", "Through mutual friends", "The internet"],
    correct: 0,
  },
  {
    q: "What's my go-to order when we get food together?",
    answers: ["Something spicy", "The same thing every time", "Whatever you're having", "I always change my mind"],
    correct: 1,
  },
  {
    q: "What's the one show/movie we quote constantly?",
    answers: ["Option A", "Option B", "Option C", "Option D"],
    correct: 2,
  },
  {
    q: "What time do I usually text back?",
    answers: ["Immediately", "A day later, unbothered", "Only after 3 reminders", "At 2am for no reason"],
    correct: 3,
  },
  {
    q: "What's our unofficial friendship motto?",
    answers: ["Fill this in", "Fill this in", "Fill this in", "Fill this in"],
    correct: 0,
  },
];

// Cycled by the "Give me a reason" button. Add as many as you want.
const APPRECIATIONS = [
  "You remember the tiny details I forget I even said.",
  "You've never once made me feel silly for caring too much about something.",
  "You show up. Every single time, no drama, you just show up.",
  "You laugh at my worst jokes like they're my best ones.",
  "You've seen me at my most annoying and stuck around anyway.",
  "You make ordinary days feel like they matter.",
  "You tell me the truth even when it's easier not to.",
  "You're the group chat's chaos and its glue, somehow at once.",
];

// The real letter. Replace the placeholder text with something true.
const LETTER_TEXT = `I made you a whole website instead of just sending a text, because honestly,
you deserve more than a text. Thank you for being exactly the kind of friend who's
worth building silly little internet things for. Happy Friendship Day.`;

/* ============================================================
   Everything past this line runs the page — no need to edit,
   but feel free to poke around.
   ============================================================ */

document.getElementById("friendNameHero").textContent = FRIEND_NAME;
document.getElementById("friendNameFooter").textContent = FRIEND_NAME;
document.getElementById("yourNameSign").textContent = YOUR_NAME;
document.getElementById("letterBody").textContent = LETTER_TEXT;

// --- day counter ---
function daysSince(dateStr){
  const start = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - start) / (1000*60*60*24));
  return diff > 0 ? diff : 0;
}
const days = daysSince(MEET_DATE);
document.getElementById("dayCount").textContent = days;
animateNumber(document.getElementById("statDays"), days);

function animateNumber(el, target){
  let cur = 0;
  const step = Math.max(1, Math.round(target/60));
  const t = setInterval(() => {
    cur += step;
    if(cur >= target){ cur = target; clearInterval(t); }
    el.textContent = cur;
  }, 20);
}

// --- scroll progress + mascot reactions ---
const pawFill = document.getElementById("pawTrailFill");
const speech = document.getElementById("mascotSpeech");
const ziggy = document.getElementById("ziggy");

const speechLines = [
  "Hi! I'm Ziggy 🦊 Scroll with me!",
  "Ooh, the numbers section!",
  "These memories are my favorite part.",
  "Quiz time, no pressure 👀",
  "You're doing great, by the way.",
  "Almost at the good part...",
];

let lastLine = -1;
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  pawFill.style.width = pct + "%";

  const lineIndex = Math.min(speechLines.length - 1, Math.floor(pct / (100/speechLines.length)));
  if(lineIndex !== lastLine){
    lastLine = lineIndex;
    speech.textContent = speechLines[lineIndex];
    speech.classList.add("show");
    clearTimeout(window._speechTimer);
    window._speechTimer = setTimeout(() => speech.classList.remove("show"), 2600);
  }
}, { passive:true });

ziggy.addEventListener("click", () => {
  speech.textContent = ["You found the secret pat spot 🥹","Okay okay, I'll stop bragging about you.","🦊💛"][Math.floor(Math.random()*3)];
  speech.classList.add("show");
  ziggy.style.transform = "scale(1.15) rotate(8deg)";
  setTimeout(() => ziggy.style.transform = "", 250);
  clearTimeout(window._speechTimer);
  window._speechTimer = setTimeout(() => speech.classList.remove("show"), 2200);
});

document.getElementById("scrollBtn").addEventListener("click", () => {
  document.getElementById("counter").scrollIntoView({ behavior:"smooth" });
});

// --- memory cards ---
const memoryGrid = document.getElementById("memoryGrid");
MEMORIES.forEach((m, i) => {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = `
    <div class="memory-card-inner">
      <div class="memory-face memory-front">
        <span class="memory-num">${String(i+1).padStart(2,"0")}</span>
        <span class="memory-emoji">${m.emoji}</span>
      </div>
      <div class="memory-face memory-back">${m.back}</div>
    </div>`;
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  memoryGrid.appendChild(card);
});

// --- quiz ---
let qIndex = 0;
let score = 0;
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizProgressLabel = document.getElementById("quizProgressLabel");
const quizProgressFill = document.getElementById("quizProgressFill");
const quizCard = document.getElementById("quizCard");
const quizResult = document.getElementById("quizResult");

function renderQuestion(){
  const item = QUIZ[qIndex];
  quizQuestion.textContent = item.q;
  quizFeedback.textContent = "";
  quizOptions.innerHTML = "";
  quizProgressLabel.textContent = `Question ${qIndex+1} of ${QUIZ.length}`;
  quizProgressFill.style.width = `${(qIndex/QUIZ.length)*100}%`;

  item.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = ans;
    btn.addEventListener("click", () => selectAnswer(i, btn));
    quizOptions.appendChild(btn);
  });
}

function selectAnswer(i, btn){
  const item = QUIZ[qIndex];
  const allBtns = quizOptions.querySelectorAll(".quiz-option");
  allBtns.forEach(b => b.disabled = true);

  if(i === item.correct){
    btn.classList.add("correct");
    quizFeedback.textContent = "Correct! You actually pay attention. 🎉";
    score++;
  } else {
    btn.classList.add("wrong");
    allBtns[item.correct].classList.add("correct");
    quizFeedback.textContent = "Nope! But A for effort. 😅";
  }

  setTimeout(() => {
    qIndex++;
    if(qIndex < QUIZ.length){
      renderQuestion();
    } else {
      showResult();
    }
  }, 1100);
}

function showResult(){
  quizCard.hidden = true;
  quizResult.hidden = false;
  quizProgressFill.style.width = "100%";
  const pct = score / QUIZ.length;
  const resultEmoji = document.getElementById("resultEmoji");
  const resultText = document.getElementById("resultText");
  if(pct === 1){
    resultEmoji.textContent = "🏆";
    resultText.textContent = `${score}/${QUIZ.length} — perfect score. You clearly belong in my group chat.`;
    burstConfetti();
  } else if(pct >= 0.5){
    resultEmoji.textContent = "🥳";
    resultText.textContent = `${score}/${QUIZ.length} — solid! We should hang out more so you can catch up.`;
  } else {
    resultEmoji.textContent = "😂";
    resultText.textContent = `${score}/${QUIZ.length} — okay wow. This just means we need more memories to work with.`;
  }
}

document.getElementById("retryQuiz").addEventListener("click", () => {
  qIndex = 0; score = 0;
  quizResult.hidden = true;
  quizCard.hidden = false;
  renderQuestion();
});

renderQuestion();

// --- appreciation generator ---
const appreciationText = document.getElementById("appreciationText");
let lastAppreciation = -1;
document.getElementById("appreciateBtn").addEventListener("click", () => {
  let idx;
  do { idx = Math.floor(Math.random() * APPRECIATIONS.length); } while(idx === lastAppreciation && APPRECIATIONS.length > 1);
  lastAppreciation = idx;
  appreciationText.style.opacity = 0;
  setTimeout(() => {
    appreciationText.textContent = APPRECIATIONS[idx];
    appreciationText.style.opacity = 1;
  }, 150);
});
appreciationText.style.transition = "opacity .15s ease";

// --- confetti ---
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const colors = ["#FF6B9D","#FFD23F","#5FD4D0","#4CD787","#FF9F5B"];
let particles = [];

function burstConfetti(){
  particles = particles.concat(Array.from({length:120}, () => ({
    x: canvas.width/2 + (Math.random()-0.5)*200,
    y: canvas.height*0.3,
    vx: (Math.random()-0.5)*10,
    vy: Math.random()*-10 - 4,
    size: Math.random()*8+4,
    color: colors[Math.floor(Math.random()*colors.length)],
    rot: Math.random()*360,
    vr: (Math.random()-0.5)*10,
    life: 0,
  })));
  requestAnimationFrame(tick);
}

function tick(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => {
    p.vy += 0.35;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI/180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
    ctx.restore();
  });
  particles = particles.filter(p => p.y < canvas.height + 40 && p.life < 260);
  if(particles.length > 0){
    requestAnimationFrame(tick);
  } else {
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}

document.getElementById("confettiBtn").addEventListener("click", burstConfetti);
