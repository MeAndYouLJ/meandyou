$(document).ready(function() {

    closeModalMusic();
    openModalMusic();

    const images = document.querySelectorAll('.carousel-images img');
    const dots = document.querySelectorAll('.dot');
    const imageCount = images.length;
    
    let currentIndex = 0;
    
    // // Atualizar o carrossel para mostrar a imagem correspondente
    // function updateCarousel() {
    //   // Mover o carrossel para a imagem atual
    //   const offset = -currentIndex * 800; // 800px é a largura de cada imagem
    //   document.querySelector('.carousel-images').style.transform = `translateX(${offset}px)`;
    
    //   // Atualizar os dots
    //   dots.forEach((dot, index) => {
    //     dot.classList.toggle('active', index === currentIndex);
    //   });
    // }

    function updateCarousel() {
      // Obter a largura da imagem dinamicamente
      const imageWidth = document.querySelector('.carousel-images img').clientWidth;
    
      // Mover o carrossel para a imagem atual
      const offset = -currentIndex * imageWidth;
      document.querySelector('.carousel-images').style.transform = `translateX(${offset}px)`;
    
      // Atualizar os dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    // Adicionar um event listener para atualizar o carrossel quando a janela for redimensionada
    window.addEventListener('resize', updateCarousel);
    
    
    // Avançar para a próxima imagem
    function nextImage() {
      currentIndex = (currentIndex + 1) % imageCount; // Rolagem infinita
      updateCarousel();
    }
    
    // Configurar a rolagem automática
    let interval = setInterval(nextImage, 5000); // Avança a cada 3 segundos
    // Adicionar evento de clique nos dots
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        clearInterval(interval); // Parar a rolagem automática ao clicar
        currentIndex = parseInt(dot.dataset.index);
        updateCarousel();
        interval = setInterval(nextImage, 5000); // Reiniciar a rolagem automática
      });
    });
    
    // Inicializar o carrossel
    updateCarousel();

    // Data fixa
    const fixedDate = new Date("2022-09-11T00:00:00");

    // Função para atualizar o cronômetro
    function updateTimer() {
      const now = new Date(); // Data atual
      const diff = now - fixedDate; // Diferença em milissegundos

      // Converter a diferença em unidades de tempo
      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44)) % 12;
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

      // Atualizar o texto no HTML
      const timerElement = document.getElementById("idtimer");
      timerElement.innerHTML = `
        <i class="bi bi-heart-fill"></i> 
        ${years} ano${years !== 1 ? "s" : ""} 
        ${months} mês${months !== 1 ? "es" : ""} 
        ${days} dia${days !== 1 ? "s" : ""} 
        ${hours} hora${hours !== 1 ? "s" : ""} 
        ${minutes} minuto${minutes !== 1 ? "s" : ""} 
        ${seconds} segundo${seconds !== 1 ? "s" : ""} 
        <i class="bi bi-activity"></i>
      `;
    }

    // Atualizar o cronômetro a cada segundo
    setInterval(updateTimer, 1000);

    // Inicializar o cronômetro na primeira vez
    updateTimer();
    

    
// --------------------------- Music ------------------------------- //

// Lista de reprodução (substitua pelos nomes reais dos arquivos)
const playlist = [
  './music/im_real_music.mpeg',
  './music/jorge_matheus_music.mpeg',
  './music/im_real_music.mpeg',
  './music/jorge_matheus_music.mpeg'
];

// Inicializa variáveis
let currentIndexMusic = 0; // Índice da música atual
const musicPlayer = document.getElementById('musicPlayer');
musicPlayer.volume = 0.05;
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const currentSongDisplay = document.getElementById('currentSong');

// Função para atualizar a música atual
function loadSong(index) {
  musicPlayer.src = playlist[index];
  currentSongDisplay.textContent = `Música atual: ${playlist[index].split('/').pop()}`;
}

// Função para tocar a música atual
function playMusic() {
  musicPlayer.play();
  playMusicClose();
}

// Função para pausar a música
function pauseMusic() {
  musicPlayer.pause();
}

// Evento: Trocar para a próxima música automaticamente
musicPlayer.addEventListener('ended', () => {
  currentIndexMusic = (currentIndexMusic + 1) % playlist.length; // Passa para a próxima música, reinicia no fim
  loadSong(currentIndexMusic);
  playMusic(); // Toca a próxima música
  
});

// Evento: Botão de tocar
playButton.addEventListener('click', () => {
  if (musicPlayer.paused && !musicPlayer.src) {
      loadSong(currentIndexMusic); // Carrega a primeira música
      playMusic();
  }
  playMusic();
});


// --------------------------- Music ------------------------------- //

});

function closeModalMusic(){
    $('.ct-modal-play-music').hide();
}

function openModalMusic(){
    $('.ct-modal-play-music').fadeIn('slow');
}

function playMusicClose(){
    $('.ct-modal-play-music').fadeOut('slow');
}



function updateScreenSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  document.getElementById('size').textContent = `${width} x ${height}px`;
}

window.addEventListener('resize', updateScreenSize);
updateScreenSize(); // Chama a função ao carregar a página