// Adds support for Bandcamp

function setup() {
  musicInfo = {
    player: () => {
      return 'Bandcamp';
    },

    readyCheck: () => {
      return document.querySelector('.playbutton');
    },

    state: () => {
      return document.querySelector('.playbutton').classList.contains('playing') ? 2 : 1;
    },

    title: () => {
      return document.querySelector('.track_info .title').textContent;
    },

    artist: () => {
      return document.querySelector('#name-section h3 span a').textContent;
    },

    album: () => {
      return document.querySelector('#name-section h2').innerText;
    },

    cover: () => {
      return document.querySelector('#tralbumArt a img').src;
    },

    durationString: () => {
      return document.querySelector('.time_total').textContent;
    },

    positionString: () => {
      return document.querySelector('.time_elapsed').textContent;
    },

    volume: null,

    rating: null,

    repeat: null,

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: null,

    next: null,

    previous: null,

    progress: null,

    volume: null,

    repeat: null,

    shuffle: null,

    toggleThumbsUp: null,

    toggleThumbsDown: null,

    rating: null
  };
}

setup();
init();
