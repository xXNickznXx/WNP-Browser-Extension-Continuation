// Adds support for Pandora

let lastKnownAlbum = '';
let currAudioElement = null;

// Convert every words to start with capital (Note: Does NOT ignore words that should not be)
function capitalize(str) {
  str = str.replace(/-/g, ' ');
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function setup() {
  musicInfo = {
    player: () => {
      return 'Pandora';
    },

    readyCheck: () => {
      // Makes sure the current music element used is up to date
      for (const el of document.getElementsByTagName('audio')) {
        if (el.ontimeupdate === null) {
          // Yes I know this is a hacky way to do this but it works and is rather quite efficient
          el.ontimeupdate = () => {
            currAudioElement = this;
          };
        }
      }

      return document.getElementsByClassName('Tuner__Audio__TrackDetail__title').length > 0 && currAudioElement !== null;
    },

    state: () => {
      // If pandora asked if you are still listening it is paused
      if (document.getElementsByClassName('StillListeningBody').length > 0) {
        return 2;
      }
      return document.getElementsByClassName('PlayButton__Icon')[0].children[0].getAttribute('d').includes('22.5v-21l16.5') ? 2 : 1;
    },

    title: () => {
      // Avoid using the titles from web-now-playing.js wherever possible
      // This is done so we know when we need to reset the tag used for the album
      /* globals currTitle:true */
      if (currTitle !== document.getElementsByClassName('Tuner__Audio__TrackDetail__title')[0].textContent) {
        lastKnownAlbum = '';
      }
      return document.getElementsByClassName('Tuner__Audio__TrackDetail__title')[0].textContent;
    },

    artist: () => {
      // Avoid using the titles from web-now-playing.js wherever possible
      // This is done so we know when we need to reset the tag used for the album
      /* globals currAlbum:true */
      if (currAlbum !== document.getElementsByClassName('Tuner__Audio__TrackDetail__artist')[0].textContent) {
        lastKnownAlbum = '';
      }
      return document.getElementsByClassName('Tuner__Audio__TrackDetail__artist')[0].textContent;
    },

    album: () => {
      if (document.getElementsByClassName('nowPlayingTopInfo__current__albumName').length > 0) {
        lastKnownAlbum = document.getElementsByClassName('nowPlayingTopInfo__current__albumName')[0].textContent;
        return lastKnownAlbum;
      }
      // Fallback for it album is not visible, note that it is url formatted so I have to do extra parsing
      // This will only run if the album has changed
      else if (lastKnownAlbum === '') {
        // Do all extra passing in advance so string check works across both if I already have the string set correctly
        let albumURL = document
          .getElementsByClassName('Tuner__Audio__TrackDetail__title')[0]
          .href.replace('://www.pandora.com/artist/', '');
        albumURL = albumURL.substring(albumURL.indexOf('/') + 1);
        return capitalize(albumURL.substring(0, albumURL.indexOf('/')));
      }

      return lastKnownAlbum;
    },

    cover: () => {
      const cover =
        document.getElementsByClassName('ImageLoader__cover')[document.getElementsByClassName('ImageLoader__cover').length - 1].src;

      // If cover is default return to use default in Rainmeter
      if (cover === 'https://www.pandora.com/web-version/1.58.0/images/album_90.png') {
        return '';
      }
      return cover.replace('90W_90H', '500W_500H');
    },

    durationString: () => {
      if (document.getElementsByClassName('VolumeDurationControl__Duration')[0].children[2].textContent !== '') {
        return document.getElementsByClassName('VolumeDurationControl__Duration')[0].children[2].textContent;
      }
      return null;
    },

    positionString: () => {
      if (document.getElementsByClassName('VolumeDurationControl__Duration')[0].children[0].textContent !== '') {
        return document.getElementsByClassName('VolumeDurationControl__Duration')[0].children[0].textContent;
      }
      return null;
    },

    volume: () => {
      return currAudioElement.volume;
    },

    rating: () => {
      if (document.getElementsByClassName('Tuner__Control__ThumbUp__Button--active').length > 0) {
        return 5;
      } else if (document.getElementsByClassName('Tuner__Control__ThumbDown__Button--active').length > 0) {
        return 1;
      }
      return 0;
    },

    repeat: null,

    shuffle: () => {
      if (document.getElementsByClassName('ShuffleButton__button__shuffleString').length > 0) {
        return document.getElementsByClassName('ShuffleButton__button__shuffleString')[0].textContent.includes('On') ? 1 : 0;
      }
      return null;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      // Click on still listening pop if it exists
      if (document.getElementsByClassName('StillListeningBody').length > 0) {
        document.getElementsByClassName('StillListeningBody')[0].children[2].click();
      }
      document.getElementsByClassName('PlayButton')[0].click();
    },

    next: () => {
      document.getElementsByClassName('SkipButton')[0].click();
    },

    previous: () => {
      document.getElementsByClassName('ReplayButton')[0].click();
    },

    progressSeconds: (position) => {
      currAudioElement.currentTime = position;
    },

    volume: (volume) => {
      if (currAudioElement.muted && volume > 0) {
        currAudioElement.muted = false;
      } else if (volume === 0) {
        currAudioElement.muted = true;
      }
      currAudioElement.volume = volume;
    },

    repeat: null,

    shuffle: () => {
      // We only can change shuffle state if it is visable
      if (document.getElementsByClassName('ShuffleButton__button__shuffleString').length > 0) {
        document.getElementsByClassName('ShuffleButton__button__shuffleString')[0].click();
      }
    },

    toggleThumbsUp: () => {
      document.getElementsByClassName('ThumbUpButton ')[0].click();
    },

    toggleThumbsDown: () => {
      document.getElementsByClassName('ThumbDownButton')[0].click();
    },

    rating: (rating) => {
      // Check if thumbs has two paths, if it does not then it is active
      if (rating > 3) {
        // If thumbs up is not active
        if (document.getElementsByClassName('Tuner__Control__ThumbUp__Button--active').length === 0) {
          document.getElementsByClassName('ThumbUpButton ')[0].click();
        }
      } else if (rating < 3 && rating > 0) {
        // If thumbs down is not active active
        if (document.getElementsByClassName('Tuner__Control__ThumbDown__Button--active').length === 0) {
          document.getElementsByClassName('ThumbDownButton')[0].click();
        }
      } else {
        if (document.getElementsByClassName('Tuner__Control__ThumbUp__Button--active').length > 0) {
          document.getElementsByClassName('ThumbUpButton ')[0].click();
        } else if (document.getElementsByClassName('Tuner__Control__ThumbDown__Button--active').length > 0) {
          document.getElementsByClassName('ThumbDownButton')[0].click();
        }
      }
    }
  };
}

setup();
init();
