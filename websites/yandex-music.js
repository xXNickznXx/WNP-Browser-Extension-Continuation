// Adds support for Yandex Music

let lastAlbumURL = '';
let lastKnownAlbum = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Yandex Music';
    },

    readyCheck: () => {
      return document.getElementsByClassName('track__title').length > 0;
    },

    state: () => {
      return document.getElementsByClassName('player-controls__btn_pause')[0] ? 1 : 2;
    },

    title: () => {
      return document.getElementsByClassName('track__title')[0].textContent;
    },

    artist: () => {
      return document.getElementsByClassName('track__artists')[0].textContent;
    },

    album: () => {
      if (lastAlbumURL !== document.getElementsByClassName('track__title')[0].href) {
        lastAlbumURL = document.getElementsByClassName('track__title')[0].href;

        const ajaxReq = new XMLHttpRequest();
        ajaxReq.onreadystatechange = () => {
          if (ajaxReq.readyState === 4) {
            const jsonAlbum = JSON.parse(ajaxReq.response);
            lastKnownAlbum = jsonAlbum.title;
          }
        };
        ajaxReq.open(
          'GET',
          'https://music.yandex.ru/handlers/album.jsx?album=' +
            lastAlbumURL
              .substr(lastAlbumURL.search('/album/') + 7, lastAlbumURL.length)
              .substr(0, lastAlbumURL.substr(lastAlbumURL.search('/album/') + 7, lastAlbumURL.length).search('/'))
        );
        ajaxReq.send();
      }

      return lastKnownAlbum;
    },

    cover: () => {
      return document
        .getElementsByClassName('track_type_player')[0]
        .getElementsByClassName('entity-cover__image')[0]
        .src.replace('50x50', '1000x1000');
    },

    durationString: () => {
      return document.getElementsByClassName('progress__right')[0].textContent;
    },

    positionString: () => {
      return document.getElementsByClassName('progress__left')[0].textContent;
    },

    volume: () => {
      return parseInt(document.getElementsByClassName('volume__bar')[0].children[0].children[0].children[0].style.height) / 100;
    },

    rating: () => {
      if (document.getElementsByClassName('player-controls__track-controls')[0].children[0].classList.contains('d-like_on')) {
        return 5;
      } else if (document.getElementsByClassName('d-icon_circle-crossed_on').length > 0) {
        return 1;
      }
      return 0;
    },

    repeat: () => {
      if (document.getElementsByClassName('player-controls__btn_repeat_state2').length > 0) {
        return 1;
      } else if (document.getElementsByClassName('player-controls__btn_repeat_state1').length > 0) {
        return 2;
      }

      return 0;
    },

    shuffle: () => {
      if (document.getElementsByClassName('d-icon_shuffle-gold').length > 0) {
        return 1;
      }

      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementsByClassName('player-controls__btn_play')[0].click();
    },

    next: () => {
      document.getElementsByClassName('player-controls__btn_next')[0].click();
    },

    previous: () => {
      document.getElementsByClassName('player-controls__btn_prev')[0].click();
    },

    progressSeconds: (position) => {
      // Add HTML element <script>
      const scriptHTML = document.createElement('script');
      scriptHTML.classList.add('embedded-script-progress');
      // use externalAPI site to rewind songs and delete <script>
      scriptHTML.textContent =
        'externalAPI.setPosition(' + position + ');document.getElementsByClassName("embedded-script-progress")[0].remove();';
      document.head.appendChild(scriptHTML);
    },

    volume: (volume) => {
      const scriptHTML = document.createElement('script');
      scriptHTML.classList.add('embedded-script-volume');
      scriptHTML.textContent =
        'externalAPI.setVolume(' + volume + ');document.getElementsByClassName("embedded-script-volume")[0].remove();';
      document.head.appendChild(scriptHTML);
    },

    repeat: () => {
      document.getElementsByClassName('player-controls__btn_repeat')[0].click();
    },

    shuffle: () => {
      document.getElementsByClassName('player-controls__btn_shuffle')[0].click();
    },

    toggleThumbsUp: () => {
      document.getElementsByClassName('player-controls__track-controls')[0].children[0].click();
    },

    toggleThumbsDown: () => {
      document.getElementsByClassName('player-controls__track-controls')[0].children[3].click();
    },

    rating: (rating) => {
      if (rating > 3) {
        document.getElementsByClassName('player-controls__track-controls')[0].children[0].click();
      } else {
        document.getElementsByClassName('player-controls__track-controls')[0].children[3].click();
      }
    }
  };
}

setup();
init();
