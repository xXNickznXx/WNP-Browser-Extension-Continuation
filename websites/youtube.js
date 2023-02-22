// Adds support for youtube

let lastImgVideoID = '';
let currIMG = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Youtube';
    },

    readyCheck: () => {
      return document.querySelector('.html5-main-video[src]') && document.querySelector('.ytd-video-primary-info-renderer .title');
    },

    state: () => {
      return document.querySelector('.html5-main-video').paused ? 2 : 1;
    },

    title: () => {
      // return document.querySelector('#above-the-fold #title h1').textContent;
      return document.querySelector('.ytd-video-primary-info-renderer .title').textContent;
    },

    artist: () => {
      // return document.querySelector('#above-the-fold #channel-name #text').textContent;
      return document.querySelector('.ytd-video-secondary-info-renderer #upload-info #text').textContent;
    },

    album: () => {
      // If using a playlist just use the title of that
      if (document.querySelector('#secondary #playlist .title').textContent) {
        return document.querySelector('#secondary #playlist .title').textContent;
      }
      // If playing a video with a hashtag use that
      if (document.querySelector('#above-the-fold #super-title').textContent) {
        return document.querySelector('#above-the-fold #super-title').textContent;
      }
      return '';
    },

    cover: () => {
      const videoID = window.location.href.substring(window.location.href.indexOf('v=') + 2, window.location.href.indexOf('v=') + 2 + 11);

      if (lastImgVideoID !== videoID && videoID !== 'ttps://www.') {
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

    durationString: () => {
      return document.querySelector('.ytp-time-duration').textContent;
    },

    position: () => {
      return document.querySelector('.html5-main-video').currentTime;
    },

    volume: () => {
      return document.querySelector('.html5-main-video').volume;
    },

    rating: () => {
      // Check if thumbs up button is active
      if (document.querySelector('#above-the-fold #top-level-buttons-computed')) {
        if (
          document
            .querySelector('#above-the-fold #top-level-buttons-computed')
            .children[0].firstElementChild.firstElementChild.firstElementChild.getAttribute('aria-pressed') === 'true'
        ) {
          return 5;
        }
        // Check if thumbs down button is active
        if (
          document
            .querySelector('#above-the-fold #top-level-buttons-computed')
            .children[1].firstElementChild.firstElementChild.firstElementChild.getAttribute('aria-pressed') === 'true'
        ) {
          return 1;
        }
      }
      return 0;
    },

    repeat: () => {
      if (document.querySelector('.html5-main-video').loop === true) {
        return 2;
      }
      if (document.querySelector('#secondary #playlist #playlist-action-menu').innerHTML) {
        // TODO: currently theres no "ariaPressed" on that button
        return document.querySelector('#secondary #playlist #playlist-action-menu').children[0].children[0].children[0].children[0]
          .children[0].children[0].ariaPressed === 'true'
          ? 1
          : 0;
      }
      return 0;
    },

    shuffle: () => {
      if (document.querySelector('#secondary #playlist #playlist-action-menu').innerHTML) {
        return document.querySelector('#secondary #playlist #playlist-action-menu').children[0].children[0].children[1].children[0]
          .children[0].children[0].ariaPressed === 'true'
          ? 1
          : 0;
      }
      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.querySelector('.ytp-play-button').click();
    },

    // TODO: implement tab handling
    next: () => {
      document.querySelector('.ytp-next-button').click();
    },

    previous: () => {
      if (document.querySelector('.ytp-prev-button').getAttribute('aria-disabled') === 'false') {
        document.querySelector('.ytp-prev-button').click();
      }
    },

    progressSeconds: (position) => {
      document.querySelector('.html5-main-video').currentTime = position;
    },

    volume: (volume) => {
      if (document.querySelector('.html5-main-video').muted && volume > 0) {
        document.querySelector('.html5-main-video').muted = false;
      } else if (volume === 0) {
        document.querySelector('.html5-main-video').muted = true;
      }
      document.querySelector('.html5-main-video').volume = volume;
    },

    repeat: () => {
      // If no repeat button on the page then use video's loop element to loop the video
      if (document.querySelector('#secondary #playlist #playlist-action-menu').innerHTML === '') {
        document.querySelector('.html5-main-video').loop = !document.querySelector('.html5-main-video').loop;
      } else {
        if (document.querySelector('.html5-main-video').loop === true) {
          document.querySelector('.html5-main-video').loop = false;
          if (
            document.querySelector('#secondary #playlist #playlist-action-menu').children[0].children[0].children[0].children[0].children[0]
              .children[0].ariaPressed === 'true'
          ) {
            document
              .querySelector('#secondary #playlist #playlist-action-menu')
              .children[0].children[0].children[0].children[0].children[0].children[0].click();
          }
        } else if (
          document.querySelector('#secondary #playlist #playlist-action-menu').children[0].children[0].children[0].children[0].children[0]
            .children[0].ariaPressed === 'true'
        ) {
          document
            .querySelector('#secondary #playlist #playlist-action-menu')
            .children[0].children[0].children[0].children[0].children[0].children[0].click();
          document.querySelector('.html5-main-video').loop = true;
        } else {
          document
            .querySelector('#secondary #playlist #playlist-action-menu')
            .children[0].children[0].children[0].children[0].children[0].children[0].click();
        }
      }
    },

    shuffle: () => {
      if (document.querySelector('#secondary #playlist #playlist-action-menu').innerHTML) {
        document
          .querySelector('#secondary #playlist #playlist-action-menu')
          .children[0].children[0].children[1].children[0].children[0].children[0].click();
      }
    },

    toggleThumbsUp: () => {
      document
        .querySelector('#above-the-fold #top-level-buttons-computed')
        .children[0].firstElementChild.firstElementChild.firstElementChild.click();
    },

    toggleThumbsDown: () => {
      document
        .querySelector('#above-the-fold #top-level-buttons-computed')
        .children[1].firstElementChild.firstElementChild.firstElementChild.click();
    },

    rating: (rating) => {
      const thumbsUp = document.querySelector('#above-the-fold #top-level-buttons-computed').children[0].firstElementChild.firstElementChild
        .firstElementChild;
      const thumbsDown = document.querySelector('#above-the-fold #top-level-buttons-computed').children[1].firstElementChild
        .firstElementChild.firstElementChild;
      if (rating > 3 && thumbsUp.getAttribute('aria-pressed') === 'false') {
        thumbsUp.click();
      } else if (rating === 3 || rating === 0) {
        if (thumbsUp.getAttribute('aria-pressed') === 'true') {
          thumbsUp.click();
        } else if (thumbsDown.getAttribute('aria-pressed') === 'true') {
          thumbsDown.click();
        }
      } else if (rating < 3 && thumbsDown.getAttribute('aria-pressed') === 'false') {
        thumbsDown.click();
      }
    }
  };
}

setup();
init();
