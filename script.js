document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ---------- nav toggle (mobile) ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

/* ---------- boot sequence ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const body = document.getElementById('terminalBody');
const input = document.getElementById('terminalInput');

const bootLines = [
  { text: 'booting ashton_os v3.0 ...', cls: 'muted' },
  { text: 'whoami', cls: 'p', prompt: true },
  { text: 'Ashton Manson — BSc Information Technology, North-West University', cls: '' },
  { text: 'status: 3rd year · open to internships & vacation work', cls: 'cyan' },
];

function makeLine(text, cls, prompt) {
  const p = document.createElement('p');
  p.className = 'term-line';
  if (prompt) {
    p.innerHTML = `<span class="p">$</span> <span class="${cls}">${text}</span>`;
  } else {
    p.innerHTML = `<span class="${cls}">${text}</span>`;
  }
  return p;
}

async function typeLine(lineObj) {
  const p = document.createElement('p');
  p.className = 'term-line';
  body.appendChild(p);
  const prefix = lineObj.prompt ? '<span class="p">$</span> ' : '';
  const span = document.createElement('span');
  span.className = lineObj.cls;
  p.innerHTML = prefix;
  p.appendChild(span);

  if (reduceMotion) {
    span.textContent = lineObj.text;
    return;
  }
  for (let i = 0; i < lineObj.text.length; i++) {
    span.textContent += lineObj.text[i];
    await new Promise(r => setTimeout(r, 12));
  }
}

async function runBoot() {
  for (const line of bootLines) {
    await typeLine(line);
    await new Promise(r => setTimeout(r, 120));
  }
  input.focus({ preventScroll: true });
}
runBoot();

/* ---------- interactive command handling ---------- */
const commands = {
  help: 'commands: about · resume · skills · projects · contact · whoami · sudo hire-me · clear',
  whoami: 'Ashton Manson — problem solver, quick learner, comfortable with hardware and code.',
  about: () => scrollToSection('about'),
  resume: () => scrollToSection('resume'),
  skills: () => scrollToSection('skills'),
  projects: () => scrollToSection('projects'),
  contact: () => scrollToSection('contact'),
  'sudo hire-me': '[sudo] permission granted: scroll to contact and send an email.',
  clear: () => { body.innerHTML = ''; return null; },
};

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  return `opening ${id}/ ...`;
}

function printResponse(text) {
  if (text === null || text === undefined) return;
  const p = makeLine(text, 'muted', false);
  body.appendChild(p);
  body.scrollTop = body.scrollHeight;
}

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = input.value.trim();
  if (!raw) return;
  const echo = makeLine(raw, '', true);
  body.appendChild(echo);

  const handler = commands[raw.toLowerCase()];
  if (typeof handler === 'function') {
    const result = handler();
    printResponse(result);
  } else if (typeof handler === 'string') {
    printResponse(handler);
  } else {
    printResponse(`command not found: ${raw} — try 'help'`);
  }
  input.value = '';
  body.scrollTop = body.scrollHeight;
});
