// Adds support for Qobuz

function setup() {
  musicInfo = {
    player: () => {
      return 'Qobuz';
    },

    readyCheck: () => {
      return (
        document.getElementsByClassName('player__track-overflow').length > 0 &&
        document.getElementsByClassName('player__track-overflow')[0].textContent.length > 0
      );
    },

    // Qobuz is pretty easy compared to most other services

    state: () => {
      return document.getElementsByClassName('player__action')[0].children[2].className.includes('pause') ? 1 : 2;
    },

    title: () => {
      return document.getElementsByClassName('player__track-overflow')[0].textContent;
    },

    artist: () => {
      return document.getElementsByClassName('player__track-album')[0].children[0].textContent;
    },

    album: () => {
      return document.getElementsByClassName('player__track-album')[0].children[0].textContent;
    },

    cover: () => {
      // Qobuz on menu bar album art is 230x230, the square resolution is denoted at the end so just replace that
      return document.getElementsByClassName('player__track-cover')[0].children[0].src.replace('230.jpg', '600.jpg');
    },

    durationString: () => {
      return document.getElementsByClassName('player__track-time-content')[0].children[2].textContent;
    },

    positionString: () => {
      return document.getElementsByClassName('player__track-time-content')[0].children[0].textContent;
    },

    volume: () => {
      // Qobuz does not show the volume amount on screen anywhere so the easiest way is to get the width of the fill bar for the slider which goes 0-95 pixels
      return (
        document
          .getElementsByClassName('player__settings-volume-slider')[0]
          .children[0].children[0].children[0].style.width.replace('px', '') / 95
      );
    },

    rating: () => {
      // This almost was originally way more complex than it needed
      // Qobuz does not show the favorite icon when your screen width is below a certain amount and with my dev tools setup I was well below that, originally wrote something to find the song in the queue
      // However it does display in the menu bar the favorite icon and even when not visible is does update
      if (document.getElementsByClassName('player__track-buttons-item')[1].className.includes('liked')) {
        return 5;
      }
      return 0;
    },

    repeat: () => {
      // If repeat on
      if (document.getElementsByClassName('player__action-repeat')[0].className.includes('active')) {
        // Check if also repeat once
        if (document.getElementsByClassName('player__action-repeat')[0].className.includes('once')) {
          return 2;
        }
        return 1;
      }
      return 0;
    },

    shuffle: () => {
      return document.getElementsByClassName('player__action-shuffle')[0].className.includes('active') ? 1 : 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementsByClassName('player__action')[0].children[2].click();
    },

    next: () => {
      document.getElementsByClassName('player__action')[0].children[3].click();
    },

    previous: () => {
      document.getElementsByClassName('player__action')[0].children[1].click();
    },
    // Qobuz uses input ranges for progress which I still have not figured out a way to manually fire an event on

    progress: null,

    volume: (volume) => {
      const loc = document.getElementsByClassName('player__settings-volume-slider')[0].children[0].getBoundingClientRect();
      volume *= loc.width;

      const a = document.getElementsByClassName('player__settings-volume-slider')[0].children[0];
      const e = document.createEvent('MouseEvents');
      e.initMouseEvent(
        'mousedown',
        true,
        true,
        window,
        1,
        screenX + loc.left + volume,
        screenY + loc.top + loc.height / 2,
        loc.left + volume,
        loc.top + loc.height / 2,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
      e.initMouseEvent(
        'mouseup',
        true,
        true,
        window,
        1,
        screenX + loc.left + volume,
        screenY + loc.top + loc.height / 2,
        loc.left + volume,
        loc.top + loc.height / 2,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    },

    repeat: () => {
      document.getElementsByClassName('player__action')[0].children[4].click();
    },

    shuffle: () => {
      document.getElementsByClassName('player__action')[0].children[0].click();
    },

    toggleThumbsUp: () => {
      document.getElementsByClassName('player__track-buttons-item')[1].click();
    },

    toggleThumbsDown: null,

    rating: (rating) => {
      // Check if user wants to rate well and if it is not already favorite it
      if (rating > 3 && !document.getElementsByClassName('player__track-buttons-item')[1].className.includes('liked')) {
        document.getElementsByClassName('player__track-buttons-item')[1].click();
      }
      // If they do not want to rate well check if
      else if (document.getElementsByClassName('player__track-buttons-item')[1].className.includes('liked')) {
        document.getElementsByClassName('player__track-buttons-item')[1].click();
      }
    }
  };
}

setup();
init();
