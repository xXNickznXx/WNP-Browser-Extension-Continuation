// Adds support for the youtube tv

let lastImgVideoID = '';
let currIMG = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Youtube TV';
    },

    readyCheck: () => {
      return (
        document.getElementsByClassName('player-video-title').length > 0 &&
        document.getElementsByClassName('player-video-title')[0].textContent.length > 0
      );
    },

    state: () => {
      let state = document.getElementsByClassName('html5-main-video')[0].paused ? 2 : 1;
      // if (document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label") === null)
      // {
      //	state = 3;
      // }
      // It is possible for the video to be "playing" but not started
      if (state === 1 && document.getElementsByClassName('html5-main-video')[0].played.length <= 0) {
        state = 2;
      }
      return state;
    },

    title: () => {
      return document.getElementsByClassName('player-video-title')[0].textContent;
    },

    artist: () => {
      return document.getElementsByClassName('username')[0].textContent;
    },

    album: () => {
      // If using a playlist just use the title of that
      if (document.getElementsByClassName('set-context').length > 0) {
        return document.getElementsByClassName('set-context')[0].textContent;
      }

      // Otherwise youtube tv has no other context normally
      return '';
    },

    cover: () => {
      const videoID = window.location.href.substring(window.location.href.indexOf('v=') + 2, window.location.href.indexOf('v=') + 2 + 11);

      if (lastImgVideoID !== videoID) {
        lastImgVideoID = videoID;
        const img = document.createElement('img');
        img.setAttribute('src', 'https://i.ytimg.com/vi/' + videoID + '/maxresdefault.jpg');
        img.onload = () => {
          if (img.height > 90) {
            currIMG = 'https://i.ytimg.com/vi/' + videoID + '/maxresdefault.jpg';
          } else {
            currIMG = 'https://i.ytimg.com/vi/' + videoID + '/mqdefault.jpg';
          }
        };
        img.onerror = () => {
          currIMG = 'https://i.ytimg.com/vi/' + videoID + '/mqdefault.jpg';
        };
      }

      return currIMG;
    },

    duration: () => {
      return document.getElementsByClassName('html5-main-video')[0].duration;
    },

    position: () => {
      return document.getElementsByClassName('html5-main-video')[0].currentTime;
    },

    volume: () => {
      return document.getElementsByClassName('html5-main-video')[0].volume;
    },

    rating: null,

    repeat: () => {
      // Youtube TV has no repeat function so I made my own using video looping
      return document.getElementsByClassName('html5-main-video')[0].loop ? 1 : 0;
    },

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      if (document.getElementsByClassName('html5-main-video')[0].paused) {
        document.getElementsByClassName('html5-main-video')[0].play();
      } else {
        document.getElementsByClassName('html5-main-video')[0].pause();
      }
    },

    // TODO: implement tab handling
    next: () => {
      const a = document.getElementsByClassName('icon-player-next button')[0];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    previous: () => {
      const a = document.getElementsByClassName('icon-player-prev button')[0];
      const e = document.createEvent('MouseEvents');

      e.initMouseEvent('mousedown', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mouseup', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },

    progressSeconds: (position) => {
      document.getElementsByClassName('html5-main-video')[0].currentTime = position;
    },

    volume: (volume) => {
      if (document.getElementsByClassName('html5-main-video')[0].muted && volume > 0) {
        document.getElementsByClassName('html5-main-video')[0].muted = false;
      } else if (volume === 0) {
        document.getElementsByClassName('html5-main-video')[0].muted = true;
      }
      document.getElementsByClassName('html5-main-video')[0].volume = volume;
    },

    repeat: () => {
      const repeat = !document.getElementsByClassName('html5-main-video')[0].loop;
      document.getElementsByClassName('html5-main-video')[0].loop = repeat;
    },

    shuffle: null,

    toggleThumbsUp: null,

    toggleThumbsDown: null,

    rating: null
  };
}

setup();
init();
