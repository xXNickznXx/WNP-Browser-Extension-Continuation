// Adds support for Pocket Casts

function setup() {
  musicInfo = {
    player: () => {
      return 'Pocket Casts';
    },

    readyCheck: () => {
      return (
        document.getElementsByTagName('audio').length > 0 &&
        document.getElementsByTagName('audio')[0].duration > 0 &&
        document.getElementsByClassName('player_episode').length > 0
      );
    },

    state: () => {
      return document.getElementsByTagName('audio')[0].paused ? 2 : 1;
    },

    title: () => {
      return document.getElementsByClassName('player_episode')[0].textContent;
    },

    artist: () => {
      return document.getElementsByClassName('player_podcast_title')[0].textContent;
    },

    album: () => {
      return 'Podcast';
    },

    cover: () => {
      let cover = document.getElementsByClassName('player_artwork')[0].children[0].getAttribute('data-fallback-src');

      if (cover === null || cover.length === 0) {
        cover = document.getElementsByClassName('player_artwork')[0].children[0].src;
      }

      return cover;
    },

    duration: () => {
      return document.getElementsByTagName('audio')[0].duration;
    },

    position: () => {
      return document.getElementsByTagName('audio')[0].currentTime;
    },

    volume: () => {
      return document.getElementsByTagName('audio')[0].volume;
    },

    rating: null,

    repeat: null,

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementsByClassName('play_pause_button')[0].click();
    },

    next: () => {
      document.getElementsByClassName('skip_forward_button')[0].click();
    },

    previous: () => {
      document.getElementsByClassName('skip_back_button')[0].click();
    },

    progressSeconds: (position) => {
      document.getElementsByTagName('audio')[0].currentTime = position;
    },

    volume: (volume) => {
      if (document.getElementsByTagName('audio')[0].muted && volume > 0) {
        document.getElementsByTagName('audio')[0].muted = false;
      } else if (volume === 0) {
        document.getElementsByTagName('audio')[0].muted = true;
      }
      document.getElementsByTagName('audio')[0].volume = volume;
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
