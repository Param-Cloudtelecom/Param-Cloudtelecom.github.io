// --- Typing effect for the hero prompt ---
const promptEl = document.getElementById("typed-prompt");
const promptText = "$ whoami";
let i = 0;
function typeChar() {
  if (i <= promptText.length) {
    promptEl.textContent = promptText.slice(0, i);
    i++;
    setTimeout(typeChar, 70);
  }
}
typeChar();

// --- Scroll-reveal for sections ---
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el) => revealObserver.observe(el));

// --- Navbar background on scroll ---
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// --- Animated network background (packets traveling between nodes) ---
const canvas = document.getElementById("net-bg");
const ctx = canvas.getContext("2d");
let nodes = [];
const NODE_COUNT = 38;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = Math.max(document.querySelector(".hero").offsetHeight, window.innerHeight);
}
window.addEventListener("resize", resize);
resize();

function initNodes() {
  nodes = Array.from({ length: NODE_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * Math.min(canvas.height, 900),
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
  }));
}
initNodes();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  nodes.forEach((n) => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > 900) n.vy *= -1;
  });

  for (let a = 0; a < nodes.length; a++) {
    for (let b = a + 1; b < nodes.length; b++) {
      const dx = nodes[a].x - nodes[b].x;
      const dy = nodes[a].y - nodes[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        ctx.strokeStyle = `rgba(45, 212, 191, ${0.12 * (1 - dist / 160)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }
    }
  }

  nodes.forEach((n) => {
    ctx.fillStyle = "rgba(45, 212, 191, 0.55)";
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(draw);
}
draw();

// --- Cursor-following spotlight glow ---
const spotlight = document.getElementById("spotlight");
let spotlightVisible = false;
window.addEventListener("mousemove", (e) => {
  spotlight.style.left = e.clientX + "px";
  spotlight.style.top = e.clientY + "px";
  if (!spotlightVisible) {
    spotlight.style.opacity = "1";
    spotlightVisible = true;
  }
});
window.addEventListener("mouseleave", () => {
  spotlight.style.opacity = "0";
  spotlightVisible = false;
});

// --- 3D tilt effect on project/approach cards ---
document.querySelectorAll(".project-card, .approach-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// --- Smooth scroll for nav links ---
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
