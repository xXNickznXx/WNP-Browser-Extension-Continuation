// Adds support for netflix

let cachedTitle = '';
let cachedAlbum = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Netflix';
    },

    readyCheck: () => {
      return document.querySelector('.watch-video video');
    },

    state: () => {
      return document.querySelector('.watch-video video').paused ? 2 : 1;
    },

    title: () => {
      // Needs to be cached because title gets hidden
      if (document.querySelector('div[data-uia="video-title"] h4')) {
        cachedTitle = document.querySelector('div[data-uia="video-title"] h4').textContent;
      }
      return cachedTitle;
    },

    artist: null,

    album: () => {
      // Needs to be cached because episode gets hidden
      if (document.querySelector('div[data-uia="video-title"]') && document.querySelector('div[data-uia="video-title"]').lastElementChild) {
        cachedAlbum = document.querySelector('div[data-uia="video-title"]').lastElementChild.textContent;
      }
      return cachedAlbum;
    },

    cover: null,

    duration: () => {
      return document.querySelector('.watch-video video').duration;
    },

    position: () => {
      return document.querySelector('.watch-video video').currentTime;
    },

    volume: () => {
      return document.querySelector('.watch-video video').volume;
    },

    rating: null,

    repeat: null,

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    // No way to play/pause because button gets hidden
    playpause: null,

    next: null,

    previous: null,

    // No way to change progress because changing currentTime on video corrupts player
    progress: null,

    volume: (volume) => {
      document.querySelector('.watch-video video').volume = volume;
    },

    repeat: null,

    shuffle: null,

    toggleThumbsUp: null,

    toggleThumbsDown: null,

    rating: null
  };
}

setup();
init();
