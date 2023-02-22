// Adds support for disney+

function setup() {
  musicInfo = {
    player: () => {
      return 'Disney+';
    },

    readyCheck: () => {
      return document.querySelector('.btm-media-client-element[src]');
    },

    state: () => {
      return document.querySelector('.btm-media-client-element').paused ? 2 : 1;
    },

    title: () => {
      return document.querySelector('.title-field').textContent;
    },

    artist: null,

    album: () => {
      return document.querySelector('.subtitle-field').textContent;
    },

    cover: null,

    duration: () => {
      return document.querySelector('.btm-media-client-element').duration;
    },

    position: () => {
      return document.querySelector('.btm-media-client-element').currentTime;
    },

    volume: () => {
      return document.querySelector('.btm-media-client-element').volume;
    },

    rating: null,

    repeat: null,

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.querySelector('.play-pause-icon').click();
    },

    next: null,

    previous: null,

    // No way to change progress because changing currentTime on video corrupts player
    progress: null,

    volume: (volume) => {
      document.querySelector('.btm-media-client-element').volume = volume;
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
