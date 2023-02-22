// Adds support for Google Play Music

let element;

function setup() {
  musicInfo = {
    player: () => {
      return 'Google Play Music';
    },

    readyCheck: () => {
      if (document.getElementsByTagName('audio').length > 0) {
        for (const el of document.getElementsByTagName('audio')) {
          if (el.duration > 0) {
            element = el;
            break;
          }
        }
      }

      return (
        document.getElementById('currently-playing-title') !== null &&
        document.getElementById('currently-playing-title').textContent.length > 0 &&
        document.getElementsByTagName('audio').length > 0 &&
        element !== undefined
      );
    },

    state: () => {
      return element.paused ? 2 : 1;
    },

    title: () => {
      return document.getElementById('currently-playing-title').textContent;
    },

    artist: () => {
      return document.getElementById('player-artist').textContent;
    },

    album: () => {
      if (document.getElementsByClassName('player-album').length > 0) {
        return document.getElementsByClassName('player-album')[0].textContent;
      }
      return 'Podcast';
    },

    cover: () => {
      const albumArtTemp = document.getElementById('playerBarArt').src;
      return albumArtTemp.substring(0, albumArtTemp.indexOf('=s90-c-e100'));
    },

    durationString: () => {
      return document.getElementById('time_container_duration').textContent;
    },

    positionString: () => {
      // GPM audio source seems to preload the next song, so only use current time from it if needed.
      if (!document.hidden) {
        return document.getElementById('time_container_current').textContent;
      }
      return convertNumberToTimeString(element.currentTime);
    },

    volume: () => {
      return element.volume;
    },

    rating: () => {
      // Check if thumbs has two paths, if it does not then it is active
      if (
        document.getElementsByClassName('rating-container materialThumbs')[0].children[0].children[0].children[0].children[0].children
          .length < 2
      ) {
        return 5;
      }
      if (
        document.getElementsByClassName('rating-container materialThumbs')[0].children[1].children[0].children[0].children[0].children
          .length < 2
      ) {
        return 1;
      }

      return 0;
    },

    repeat: () => {
      if (document.getElementsByClassName('material-player-middle')[0].children[1].className.includes('active')) {
        // Hacky way to check if repeat all
        if (
          document
            .getElementsByClassName('material-player-middle')[0]
            .children[1].children[0].children[0].children[0].children[0].getAttribute('d') ==
          'M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z'
        ) {
          return 2;
        }
        return 1;
      }
      return 0;
    },

    shuffle: () => {
      if (document.getElementsByClassName('material-player-middle')[0].children[5].className.includes('active')) {
        return 1;
      }
      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementById('player-bar-play-pause').click();
    },

    next: () => {
      document.getElementsByClassName('material-player-middle')[0].children[4].click();
    },

    previous: () => {
      document.getElementsByClassName('material-player-middle')[0].children[2].click();
    },

    progressSeconds: (position) => {
      element.currentTime = position;
    },

    volume: (volume) => {
      if (element.muted && volume > 0) {
        element.muted = false;
      } else if (volume === 0) {
        element.muted = true;
      }
      element.volume = volume;
    },

    repeat: () => {
      document.getElementsByClassName('material-player-middle')[0].children[1].click();
    },

    shuffle: () => {
      document.getElementsByClassName('material-player-middle')[0].children[5].click();
    },

    toggleThumbsUp: () => {
      document.getElementsByClassName('rating-container materialThumbs')[0].children[0].click();
    },

    toggleThumbsDown: () => {
      document.getElementsByClassName('rating-container materialThumbs')[0].children[1].click();
    },

    rating: (rating) => {
      // Check if thumbs has two paths, if it does not then it is active
      if (rating > 3) {
        // If thumbs up is not active
        if (
          document.getElementsByClassName('rating-container materialThumbs')[0].children[0].children[0].children[0].children[0].children
            .length === 2
        ) {
          document.getElementsByClassName('rating-container materialThumbs')[0].children[0].click();
        }
      } else if (rating < 3 && rating > 0) {
        // If thumbs down is not active active
        if (
          document.getElementsByClassName('rating-container materialThumbs')[0].children[1].children[0].children[0].children[0].children
            .length === 2
        ) {
          document.getElementsByClassName('rating-container materialThumbs')[0].children[1].click();
        }
      } else {
        if (
          document.getElementsByClassName('rating-container materialThumbs')[0].children[0].children[0].children[0].children[0].children
            .length < 2
        ) {
          document.getElementsByClassName('rating-container materialThumbs')[0].children[0].click();
        }
        if (
          document.getElementsByClassName('rating-container materialThumbs')[0].children[1].children[0].children[0].children[0].children
            .length < 2
        ) {
          document.getElementsByClassName('rating-container materialThumbs')[0].children[1].click();
        }
      }
    }
  };
}

setup();
init();
