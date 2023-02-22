// Adds support for twitch

function setup() {
  musicInfo = {
    player: () => {
      return 'Twitch';
    },

    readyCheck: () => {
      return document.querySelector('.video-player video');
    },

    state: () => {
      return document.querySelector('.video-player video').paused ? 2 : 1;
    },

    title: () => {
      return document.querySelector('#live-channel-stream-information h1').textContent;
    },

    artist: () => {
      return document.querySelector('[data-a-target="stream-title"]').textContent;
    },

    album: () => {
      // If we are live
      if (document.querySelector('.video-player video').duration === 1073741824) {
        return document.querySelector('[data-a-target="stream-game-link"]').textContent;
      } else {
        return document.querySelector('[data-a-target="video-info-game-boxart-link"]').textContent;
      }
    },

    cover: () => {
      return document.querySelector('#live-channel-stream-information .tw-avatar img').src.replace('70x70', '600x600');
    },

    durationString: () => {
      // If we are live
      if (document.querySelector('.video-player video').duration === 1073741824) {
        return 'Live';
      } else {
        return document.querySelector('[data-a-target="player-seekbar-duration"]').textContent;
      }
    },

    positionString: () => {
      // If we are live
      if (document.querySelector('.video-player video').duration === 1073741824) {
        return document.querySelector('.live-time').textContent;
      } else {
        return convertNumberToTimeString(document.querySelector('.video-player video').currentTime);
      }
    },

    volume: () => {
      return document.querySelector('.video-player video').volume;
    },

    rating: null,

    repeat: null,

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      if (document.querySelector('.video-player video').paused) {
        document.querySelector('.video-player video').play();
      } else {
        document.querySelector('.video-player video').pause();
      }
    },

    next: () => {
      // If we are not live
      if (document.querySelector('.video-player video').duration !== 1073741824) {
        // -2 because otherwise the player wouldn't load properly
        document.querySelector('.video-player video').currentTime = document.querySelector('.video-player video').duration - 2;
      }
    },

    previous: () => {
      // If we are not live
      if (document.querySelector('.video-player video').duration !== 1073741824) {
        document.querySelector('.video-player video').currentTime = 0;
      }
    },

    progressSeconds: (position) => {
      // If we are not live
      if (document.querySelector('.video-player video').duration !== 1073741824) {
        document.querySelector('.video-player video').currentTime = position;
      }
    },

    volume: (volume) => {
      // Twitch bugs out when you mute it so we wont do that
      document.querySelector('.video-player video').volume = volume;
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
