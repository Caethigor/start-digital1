/* =========================================================
   Start Digital — interações da landing page
   ========================================================= */

/* ---------- Configuração do WhatsApp ----------
   Sem mensagem pré-preenchida por enquanto.
   Para adicionar uma mensagem no futuro, inclua "?text=" + encodeURIComponent(texto) ao final da URL. */
const WHATSAPP_NUMBER = '5531971371061';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/* ---------- Preferências do visitante ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

/* ---------- Estrelas de fundo ---------- */
(function createStars() {
  const container = document.querySelector('.stars');
  if (!container) return;
  const total = 80;
  for (let i = 0; i < total; i++) {
    const star = document.createElement('span');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    const size = Math.random() < 0.2 ? 3 : 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    container.appendChild(star);
  }
})();

/* ---------- Foguete ---------- */
const rocket = document.getElementById('rocket');
let rocketY = Math.round(window.innerHeight * 0.75);

/* Posição horizontal fixa, à direita da tela */
function rocketX() {
  return window.innerWidth - 90;
}

/* Transformação base do foguete em uma posição */
function rocketTransform(y, rotate = 0, scale = 1) {
  return `translate(${rocketX()}px, ${y}px) rotate(${rotate}deg) scale(${scale})`;
}

function placeRocket(y, rotate = 0, scale = 1) {
  rocket.style.transform = rocketTransform(y, rotate, scale);
}

placeRocket(rocketY);

window.addEventListener('resize', () => {
  placeRocket(rocketY);
});

/* Voa do ponto atual até a posição-alvo (y), dentro da viewport */
function flyRocketTo(targetY, goingDown) {
  const fromY = rocketY;
  const rotate = goingDown ? 180 : 0; // nariz aponta para a direção do voo
  const duration = reduceMotion ? 1600 : 900;
  const easing = reduceMotion
    ? 'ease-in-out'
    : 'cubic-bezier(0.2, 0.8, 0.2, 1)';

  rocket.classList.add('flying');
  const anim = rocket.animate(
    [
      { transform: rocketTransform(fromY, rotate) },
      { transform: rocketTransform(targetY, rotate) },
    ],
    { duration, easing }
  );

  anim.onfinish = () => {
    placeRocket(targetY, rotate);
    rocket.classList.remove('flying');
  };

  rocketY = targetY;
}

/* ---------- Troca de seção (desktop) ----------
   Quando o visitante passa para outra seção, o foguete voa até ela. */
if (!isTouchDevice) {
  const sections = Array.from(document.querySelectorAll('[data-section]'));
  let currentIndex = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const index = sections.indexOf(entry.target);
        if (index === -1 || index === currentIndex) return;

        const goingDown = index > currentIndex;
        currentIndex = index;

        const rect = entry.target.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const targetY = Math.min(
          Math.max(center, 80),
          window.innerHeight - 120
        );

        flyRocketTo(Math.round(targetY), goingDown);
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Toque na tela (celular) ----------
   O foguete reage ao toque com um balanço. */
if (isTouchDevice) {
  document.addEventListener(
    'touchstart',
    () => {
      const duration = reduceMotion ? 1000 : 500;
      const amplitude = reduceMotion ? [0, -5, 5, -2, 0] : [0, -14, 14, -7, 0];
      rocket.animate(
        amplitude.map((deg) => ({
          transform: rocketTransform(rocketY, deg),
        })),
        { duration, easing: 'ease-in-out' }
      );
    },
    { passive: true }
  );
}

/* ---------- Botão do WhatsApp: decolagem antes do redirecionamento ---------- */
let launching = false;

function launchAndGo(event) {
  event.preventDefault();
  if (launching) return;
  launching = true;

  const duration = reduceMotion ? 1400 : 700;
  const finalY = -180;

  rocket.classList.add('flying');
  const anim = rocket.animate(
    [
      { transform: rocketTransform(rocketY, 0, 1) },
      { transform: rocketTransform(finalY, 0, 1.2) },
    ],
    {
      duration,
      easing: 'cubic-bezier(0.5, 0, 0.8, 0.4)',
      fill: 'forwards',
    }
  );

  let redirected = false;
  const go = () => {
    if (redirected) return;
    redirected = true;
    window.location.href = WHATSAPP_URL;
  };

  anim.onfinish = go;
  // Segurança: redireciona mesmo se a animação não terminar
  setTimeout(go, duration + 400);
}

document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  link.setAttribute('href', WHATSAPP_URL);
  link.setAttribute('target', '_self');
  link.setAttribute('rel', 'noopener');
  link.addEventListener('click', launchAndGo);
});
