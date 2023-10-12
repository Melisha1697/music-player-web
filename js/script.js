// Get references to various HTML elements
const container = document.querySelector(".container"),
  musicImg = container.querySelector(".img-area img"),
  musicName = container.querySelector(".song-details .name"),
  musicArtist = container.querySelector(".song-details .artist"),
  mainAudio = container.querySelector("#main-audio"),
  playpauseBtn = container.querySelector(".play-pause"),
  nextBtn = container.querySelector("#next"),
  prevBtn = container.querySelector("#prev"),
  progressArea = container.querySelector(".progress-area"),
  progressBar = container.querySelector(".progress-bar"),
  musicList = container.querySelector(".music-list"),
  moreMusicBtn = container.querySelector("#more-music"),
  closemoreMusic = container.querySelector("#close");

// Initialize the current music index
let musicIndex = Math.floor(Math.random() * musics.length + 1);

// Event listener to load music and start playing on page load
window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

// Function to load music details
function loadMusic(indexNumb) {
  musicName.innerText = musics[indexNumb - 1].name;
  musicArtist.innerText = musics[indexNumb - 1].artist;
  musicImg.src = `images/${musics[indexNumb - 1].img}.jpg`;
  mainAudio.src = `audio/${musics[indexNumb - 1].src}.mp3`;
}

// Function to play music
function playMusic() {
  container.classList.add("paused");
  playpauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// Function to pause music
function pauseMusic() {
  container.classList.remove("paused");
  playpauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// Function to play the next music
function nextMusic() {
  musicIndex++;
  if (musicIndex > musics.length) {
    musicIndex = 1;
  }
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// Function to play the previous music
function prevMusic() {
  musicIndex--;
  if (musicIndex < 1) {
    musicIndex = musics.length;
  }
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

// Event listener for play/pause button
playpauseBtn.addEventListener("click", () => {
  const isMusicPaused = container.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

// Event listener for next music button
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// Event listener for previous music button
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// Update progress bar width based on current time of the song
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = container.querySelector(".current-time");
  let musicDuration = container.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Event listener to change loop, shuffle, repeat icon
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "playlist looped");
      break;
  }
});

// Actions to be taken after a song ends
mainAudio.addEventListener("ended", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      let randIndex = Math.floor(Math.random() * musics.length + 1);
      do {
        randIndex = Math.floor(Math.random() * musics.length + 1);
      } while (musicIndex == randIndex);
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});

// Show or hide the music list
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = container.querySelector("ul");

// Create list items for music playlist
for (let i = 0; i < musics.length; i++) {
  let liTag = `<li li-index="${i + 1}">
    <div class="row">
      <span>${musics[i].name}</span>
      <p>${musics[i].artist}</p>
    </div>
    <audio class="${musics[i].src} " src="audio/${musics[i].src}.mp3"></audio>
    <span id="${musics[i].src}" class="audio-duration">1:45</span>
  </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDurationTag = ulTag.querySelector(`#${musics[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${musics[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }

    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

// Play a song from the list when a list item is clicked
const allLiTags = ulTag.querySelectorAll("li");
function playingSong() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

// Play a specific song from the list when a list item is clicked
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

