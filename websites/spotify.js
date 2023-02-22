// Adds support for Spotify

let lastKnownTitle = '';
let lastKnownAlbumArt = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Spotify';
    },

    readyCheck: () => {
      return (
        document.getElementsByClassName('Root__now-playing-bar').length > 0 &&
        document.getElementsByClassName('Root__now-playing-bar')[0].textContent.length > 0
      );
    },

    state: () => {
      return document.getElementsByClassName('player-controls__buttons')[0].children[2].getAttribute('aria-label').includes('Pause')
        ? 1
        : 2;
    },

    title: () => {
      if (
        lastKnownTitle !=
        document.getElementsByClassName('Root__now-playing-bar')[0].children[0].children[0].children[0].children[0].children[1].children[0]
          .textContent
      ) {
        lastKnownAlbumArt = '';
        lastKnownTitle =
          document.getElementsByClassName('Root__now-playing-bar')[0].children[0].children[0].children[0].children[0].children[1]
            .children[0].textContent;
      }
      return lastKnownTitle;
    },

    artist: () => {
      return document.getElementsByClassName('Root__now-playing-bar')[0].children[0].children[0].children[0].children[0].children[1]
        .children[1].textContent;
    },

    album: null,

    cover: () => {
      // If album art is blank update it
      if (lastKnownAlbumArt === '') {
        lastKnownAlbumArt = document.getElementsByClassName('cover-art')[0].children[0].children[1].src;
      }
      // If album art is not blank and we have 3 album art then it must be the big version on display so update to current album art
      else if (document.getElementsByClassName('cover-art').length === 3) {
        lastKnownAlbumArt = document.getElementsByClassName('cover-art')[0].children[0].children[1].src;
      }
      // If it was not blnak and we have less than 3 album art then it is already set to the small album art or it is set to the big album art and the big album art is not visible
      return lastKnownAlbumArt;
    },

    durationString: () => {
      return document.getElementsByClassName('playback-bar')[0].children[2].textContent;
    },

    positionString: () => {
      return document.getElementsByClassName('playback-bar')[0].children[0].textContent;
    },

    volume: () => {
      return (
        parseFloat(
          document.getElementsByClassName('volume-bar')[0].children[1].children[0].children[0].children[1].style.left.replace('%', '')
        ) / 100
      );
    },

    rating: () => {
      // I have to check if it equal to true if I cast it since javascript is javascript
      if (
        document
          .getElementsByClassName('Root__now-playing-bar')[0]
          .children[0].children[0].children[0].children[0].children[2].children[0].children[0].getAttribute('aria-checked') === 'true'
      ) {
        return 5;
      }
      return 0;
    },

    repeat: () => {
      if (document.getElementsByClassName('player-controls__buttons')[0].children[4].getAttribute('aria-checked') === 'true') {
        return 1;
      }
      if (document.getElementsByClassName('player-controls__buttons')[0].children[4].getAttribute('aria-checked') === 'mixed') {
        return 2;
      }
      return 0;
    },

    shuffle: () => {
      return document.getElementsByClassName('player-controls__buttons')[0].children[0].getAttribute('aria-checked') == 'true' ? 1 : 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementsByClassName('player-controls__buttons')[0].children[2].click();
    },

    next: () => {
      document.getElementsByClassName('player-controls__buttons')[0].children[3].click();
    },

    previous: () => {
      document.getElementsByClassName('player-controls__buttons')[0].children[1].click();
    },

    progress: (progress) => {
      const loc = document.getElementsByClassName('playback-bar')[0].children[1].children[0].getBoundingClientRect();
      progress *= loc.width;

      const a = document.getElementsByClassName('playback-bar')[0].children[1].children[0];
      const e = document.createEvent('MouseEvents');
      e.initMouseEvent(
        'mousedown',
        true,
        true,
        window,
        1,
        screenX + loc.left + progress,
        screenY + loc.top + loc.height / 2,
        loc.left + progress,
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
        screenX + loc.left + progress,
        screenY + loc.top + loc.height / 2,
        loc.left + progress,
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

    volume: (volume) => {
      const loc = document.getElementsByClassName('volume-bar')[0].children[1].children[0].getBoundingClientRect();
      volume *= loc.width;

      const a = document.getElementsByClassName('volume-bar')[0].children[1].children[0];
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
      document.getElementsByClassName('player-controls__buttons')[0].children[4].click();
    },

    shuffle: () => {
      document.getElementsByClassName('player-controls__buttons')[0].children[0].click();
    },

    toggleThumbsUp: () => {
      document
        .getElementsByClassName('Root__now-playing-bar')[0]
        .children[0].children[0].children[0].children[0].children[2].children[0].children[0].click();
    },

    toggleThumbsDown: null,

    rating: (rating) => {
      if (rating > 3) {
        if (
          document
            .getElementsByClassName('Root__now-playing-bar')[0]
            .children[0].children[0].children[0].children[0].children[2].children[0].children[0].getAttribute('aria-checked') !== 'true'
        ) {
          document
            .getElementsByClassName('Root__now-playing-bar')[0]
            .children[0].children[0].children[0].children[0].children[2].children[0].children[0].click();
        }
      } else {
        if (
          document
            .getElementsByClassName('Root__now-playing-bar')[0]
            .children[0].children[0].children[0].children[0].children[2].children[0].children[0].getAttribute('aria-checked') === 'true'
        ) {
          document
            .getElementsByClassName('Root__now-playing-bar')[0]
            .children[0].children[0].children[0].children[0].children[2].children[0].children[0].click();
        }
      }
    }
  };
}

setup();
init();
