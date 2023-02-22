// Adds support for Plex

let element;
let lastCover = null;

function blobToDataURL(blob) {
  const a = new FileReader();
  (a.onload = (e) => {
    lastCover = e.target.result;
  }),
    a.readAsDataURL(blob);
}

function setup() {
  musicInfo = {
    player: () => {
      return 'Plex';
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

      return element !== undefined && element !== null && element.duration > 0;
    },

    state: () => {
      return element.paused ? 2 : 1;
    },

    title: () => {
      return document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-titlesContainer]').children[0].textContent;
    },

    artist: () => {
      return document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-titlesContainer]').children[1].children[0].textContent;
    },

    album: () => {
      return document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-titlesContainer]').children[1].children[2].textContent;
    },

    cover: () => {
      // Plex cover is really low res, and due to their obfuscation and the fact that users can use a pin code
      // There is little I can do about it, and even if I could the highest res is only 187x187
      // Also fuck plex for putting this behind a blob

      let cover = document.querySelector('*[class*=AudioVideoPlayerControlsMetadata-cardContainer]').children[0].children[0].children[0]
        .children[0].children[0].style.backgroundImage;
      cover = cover.substring(cover.indexOf('(') + 2, cover.indexOf(')') - 1);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', cover, true);
      xhr.responseType = 'blob';
      xhr.onload = () => {
        if (this.status === 200) {
          const myBlob = this.response;
          blobToDataURL(myBlob);
        }
      };
      xhr.send();
      // Last cover is updated in blob to data url
      return lastCover;
    },

    duration: () => {
      return element.duration;
    },

    position: () => {
      return element.currentTime;
    },

    volume: () => {
      return element.volume;
    },

    rating: () => {
      return document.querySelector('*[class*=StarRating-slider]').children[1].children[0].getAttribute('aria-valuenow');
    },

    repeat: () => {
      if (document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[0].className.includes('Active')) {
        if (
          document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[0].children[0].className.includes('one')
        ) {
          return 2;
        }
        return 1;
      }
      return 0;
    },

    shuffle: () => {
      if (document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[4].className.includes('Active')) {
        return 1;
      }
      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      const a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[2];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    next: () => {
      const a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[3];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    previous: () => {
      const a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[1];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
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
      const a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[0];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    shuffle: () => {
      const a = document.querySelector('*[class*=AudioVideoPlayerControls-buttonGroupCenter]').children[4];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    toggleThumbsUp: () => {
      let rating = 5;
      // If already rated 5 stars
      if (document.querySelector('*[class*=StarRating-slider]').children[1].children[0].getAttribute('aria-valuenow') === 5) {
        rating = 3;
      }
      // So we click at star midpoint
      rating -= 0.5;

      const loc = document.querySelector('*[class*=StarRating-slider]').children[0].getBoundingClientRect();
      const a = document.querySelector('*[class*=StarRating-slider]').children[0];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent(
        'mousedown',
        true,
        true,
        window,
        1,
        screenX + loc.left + loc.width * (rating / 5),
        screenY + loc.top + loc.height / 2,
        loc.left + loc.width * (rating / 5),
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
        screenX + loc.left + loc.width * (rating / 5),
        screenY + loc.top + loc.height / 2,
        loc.left + loc.width * (rating / 5),
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

    toggleThumbsDown: () => {
      let rating = 1;
      // If already rated 1 stars
      if (document.querySelector('*[class*=StarRating-slider]').children[1].children[0].getAttribute('aria-valuenow') === 1) {
        rating = 3;
      }
      // So we click at star midpoint
      rating -= 0.5;

      const loc = document.querySelector('*[class*=StarRating-slider]').children[0].getBoundingClientRect();
      const a = document.querySelector('*[class*=StarRating-slider]').children[0];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent(
        'mousedown',
        true,
        true,
        window,
        1,
        screenX + loc.left + loc.width * (rating / 5),
        screenY + loc.top + loc.height / 2,
        loc.left + loc.width * (rating / 5),
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
        screenX + loc.left + loc.width * (rating / 5),
        screenY + loc.top + loc.height / 2,
        loc.left + loc.width * (rating / 5),
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

    rating: (rating) => {
      // Plex does not allow reseting ratings as far is I know
      if (rating === 0) {
        rating = 3;
      }
      // So we click at star midpoint
      rating -= 0.5;

      const loc = document.querySelector('*[class*=StarRating-slider]').children[0].getBoundingClientRect();
      const a = document.querySelector('*[class*=StarRating-slider]').children[0];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent(
        'mousedown',
        true,
        true,
        window,
        1,
        screenX + loc.left + loc.width * (rating / 5),
        screenY + loc.top + loc.height / 2,
        loc.left + loc.width * (rating / 5),
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
        screenX + loc.left + loc.width * (rating / 5),
        screenY + loc.top + loc.height / 2,
        loc.left + loc.width * (rating / 5),
        loc.top + loc.height / 2,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
    }
  };
}

setup();
init();
