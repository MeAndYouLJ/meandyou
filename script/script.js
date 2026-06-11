// ─────────────────────────────────────────────────────────────────
//  Me & You — script principal
// ─────────────────────────────────────────────────────────────────

// ─── Listas de mídia ──────────────────────────────────────────────

// Imagens: 1–16 (.jpg) + 18–58 (.jpeg)  |  17.jpg é versão mobile, não entra no carrossel
// Vídeos : 1–9 (.mp4) exibidos sem som
function buildMediaList() {
  const items = [];

  for (let i = 1; i <= 16; i++) {
    items.push({ type: 'image', src: `./imgs/${i}.jpg` });
  }
  for (let i = 18; i <= 58; i++) {
    items.push({ type: 'image', src: `./imgs/${i}.jpeg` });
  }
  for (let i = 1; i <= 9; i++) {
    items.push({ type: 'video', src: `./imgs/${i}.mp4` });
  }

  return items; // 66 itens
}

// Músicas detectadas na pasta /music
const MUSIC_FILES = [
  './music/1.mpeg',
  './music/2.mpeg',
  './music/3.mp4'
];

// ─── Fisher-Yates Shuffle ──────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Garante que o primeiro item da nova lista não seja igual ao último da anterior
function reshuffleAvoiding(arr, lastSrc) {
  const shuffled = shuffle(arr);
  if (shuffled.length > 1 && shuffled[0].src === lastSrc) {
    const swapIdx = Math.floor(Math.random() * (shuffled.length - 1)) + 1;
    [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
  }
  return shuffled;
}

// ─── Carrossel ─────────────────────────────────────────────────────
const ALL_MEDIA    = buildMediaList();
const carouselEl   = document.getElementById('carousel');
const progressFill = document.getElementById('progressFill');
const slideCounter = document.getElementById('slideCounter');

let mediaPlaylist  = shuffle(ALL_MEDIA);
let currentSlide   = 0;
let carouselTimer  = null;
const SLIDE_DELAY  = 5000;

// Cria um elemento img ou video com a classe e atributos indicados
function makeMediaEl(type, src, className) {
  if (type === 'image') {
    const el = document.createElement('img');
    el.src     = src;
    el.alt     = '';
    el.loading = 'lazy';
    el.className = className;
    return el;
  }
  const el = document.createElement('video');
  el.src         = src;
  el.muted       = true;
  el.playsInline = true;
  el.preload     = 'none';
  el.className   = className;
  return el;
}

function buildSlides() {
  carouselEl.innerHTML = '';
  mediaPlaylist.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'slide';
    // slide-bg: cobre o container com blur (elimina barras pretas em fotos retrato)
    div.appendChild(makeMediaEl(item.type, item.src, 'slide-bg'));
    // slide-main: exibe o conteúdo completo sem corte (object-fit: contain)
    div.appendChild(makeMediaEl(item.type, item.src, 'slide-main'));
    carouselEl.appendChild(div);
  });
}

function getSlides() {
  return carouselEl.querySelectorAll('.slide');
}

function activateSlide(index) {
  const slides = getSlides();

  if (slides[currentSlide]) {
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].querySelectorAll('video').forEach(v => {
      v.pause();
      v.currentTime = 0;
    });
  }

  currentSlide = index;

  if (slides[currentSlide]) {
    slides[currentSlide].classList.add('active');
    slides[currentSlide].querySelectorAll('video').forEach(v => {
      v.play().catch(() => {});
    });
  }

  updateProgress();
}

function updateProgress() {
  const total = mediaPlaylist.length;
  progressFill.style.width = ((currentSlide + 1) / total * 100) + '%';
  slideCounter.textContent  = `${currentSlide + 1} / ${total}`;
}

function nextSlide() {
  let next = currentSlide + 1;

  if (next >= mediaPlaylist.length) {
    // Ciclo completo: embaralha novamente evitando repetição consecutiva
    const lastSrc  = mediaPlaylist[currentSlide].src;
    mediaPlaylist  = reshuffleAvoiding(ALL_MEDIA, lastSrc);
    buildSlides();
    next = 0;
  }

  activateSlide(next);
}

function prevSlide() {
  clearInterval(carouselTimer);
  activateSlide((currentSlide - 1 + mediaPlaylist.length) % mediaPlaylist.length);
  startCarouselTimer();
}

function startCarouselTimer() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(nextSlide, SLIDE_DELAY);
}

function initCarousel() {
  buildSlides();
  activateSlide(0);
  startCarouselTimer();
}

initCarousel();

document.getElementById('prevBtn').addEventListener('click', prevSlide);
document.getElementById('nextBtn').addEventListener('click', () => {
  clearInterval(carouselTimer);
  nextSlide();
  startCarouselTimer();
});

// ─── Cronômetro ────────────────────────────────────────────────────
const START_DATE = new Date('2022-09-11T00:00:00');
const timerEl    = document.getElementById('idtimer');

function updateTimer() {
  const diff    = Date.now() - START_DATE.getTime();
  const seconds = Math.floor(diff / 1000)           % 60;
  const minutes = Math.floor(diff / 60000)          % 60;
  const hours   = Math.floor(diff / 3600000)        % 24;
  const days    = Math.floor(diff / 86400000)       % 30;
  const months  = Math.floor(diff / (86400000 * 30.44)) % 12;
  const years   = Math.floor(diff / (86400000 * 365.25));

  const v = (n, s, p) =>
    `<span class="time-value">${n}</span>&nbsp;${n !== 1 ? p : s}`;

  timerEl.innerHTML =
    `<i class="bi bi-heart-fill heart-icon"></i> ` +
    `${v(years,   'ano',     'anos')} ` +
    `${v(months,  'mês',     'meses')} ` +
    `${v(days,    'dia',     'dias')} ` +
    `${v(hours,   'hora',    'horas')} ` +
    `${v(minutes, 'minuto',  'minutos')} ` +
    `${v(seconds, 'segundo', 'segundos')} ` +
    `<i class="bi bi-activity"></i>`;
}

setInterval(updateTimer, 1000);
updateTimer();

// ─── Música ────────────────────────────────────────────────────────
const musicPlayer = document.getElementById('musicPlayer');
musicPlayer.volume = 0.05;

let musicPlaylist = shuffle([...MUSIC_FILES]);
let musicIndex    = 0;

function playCurrentSong() {
  musicPlayer.src = musicPlaylist[musicIndex];
  musicPlayer.play().catch(() => {});
}

musicPlayer.addEventListener('ended', () => {
  musicIndex++;

  if (musicIndex >= musicPlaylist.length) {
    // Ciclo completo: re-embaralha evitando repetição consecutiva
    const lastSrc = musicPlaylist[musicPlaylist.length - 1];
    musicPlaylist = shuffle([...MUSIC_FILES]);
    if (musicPlaylist.length > 1 && musicPlaylist[0] === lastSrc) {
      const swap = Math.floor(Math.random() * (musicPlaylist.length - 1)) + 1;
      [musicPlaylist[0], musicPlaylist[swap]] = [musicPlaylist[swap], musicPlaylist[0]];
    }
    musicIndex = 0;
  }

  playCurrentSong();
});

document.getElementById('playButton').addEventListener('click', () => {
  playCurrentSong();
  closeModalMusic();
});

// ─── Modal de música ───────────────────────────────────────────────
function openModalMusic() {
  document.getElementById('musicModal').classList.add('visible');
}

function closeModalMusic() {
  document.getElementById('musicModal').classList.remove('visible');
}

// Exibe o modal ao carregar
openModalMusic();
