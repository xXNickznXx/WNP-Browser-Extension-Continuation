// Adds support for Youtube Music

let lastImgVideoID = '';
let currIMG = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Youtube Music';
    },

    readyCheck: () => {
      return (
        document.getElementsByTagName('video').length > 0 &&
        document.getElementsByClassName('title ytmusic-player-bar')[0].textContent.length > 0
      );
    },

    state: () => {
      return document.getElementsByTagName('video')[0].paused ? 2 : 1;
    },

    title: () => {
      return document.getElementsByClassName('title ytmusic-player-bar')[0].textContent;
    },

    artist: () => {
      // If has both artist and album return artist
      if (document.getElementsByClassName('byline ytmusic-player-bar')[0].children.length > 0) {
        return document.getElementsByClassName('byline ytmusic-player-bar')[0].children[0].textContent;
      }
      // Otherwise it is a video and just has uploader name
      return document.getElementsByClassName('byline ytmusic-player-bar')[0].textContent;
    },

    album: () => {
      // If the song being played where we would usually find the album and where we would usually find the year of release we find the words view and like then it is likely a video
      if (
        document.getElementsByClassName('byline ytmusic-player-bar')[0].children[2].textContent.includes('view') &&
        document.getElementsByClassName('byline ytmusic-player-bar')[0].children[4].textContent.includes('like')
      ) {
        return '';
      }

      return document.getElementsByClassName('byline ytmusic-player-bar')[0].children[2].textContent;

      // Google stopped putting the name of the album at the end of the queue
      // If queue has a name use that
      // else if (document.getElementsByClassName("queue-title ytmusic-player-page")[0].children.length > 0)
      // {
      //	const temp = document.getElementsByClassName("queue-title ytmusic-player-page")[0].children[0].textContent;
      //	// Trim "Album - " from the beginning of the string if it exists
      //	if (temp.indexOf("Album - ") === 0)
      //	{
      //		temp = temp.substring("Album - ".length);
      //	}
      //	return temp;
      // }
      // Otherwise just return it as blank and let the skin handle it
    },

    cover: () => {
      let videoID = document.getElementsByClassName('ytp-title')[0].children[0].children[0].href;
      videoID = videoID.substring(videoID.lastIndexOf('=') + 1);
      let cover = document.getElementsByClassName('image ytmusic-player-bar')[0].src;

      // Check if cover is from youtube if it is some work need done first
      if (cover.includes('ytimg')) {
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
      }
      cover = cover.substring(0, cover.lastIndexOf('='));
      return cover;
    },

    durationString: () => {
      const durTemp = document.getElementsByClassName('time-info ytmusic-player-bar')[0].textContent;
      return durTemp.substring(durTemp.indexOf(' / ') + ' / '.length);
    },

    positionString: () => {
      const posTemp = document.getElementsByClassName('time-info ytmusic-player-bar')[0].textContent;
      return posTemp.substring(0, posTemp.indexOf(' / '));
    },

    volume: () => {
      return document.getElementsByTagName('video')[0].volume;
    },

    rating: () => {
      // Check if thumbs has two paths, if it does not then it is active
      if (document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[1].getAttribute('aria-pressed') === 'true') {
        return 5;
      }
      if (document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[0].getAttribute('aria-pressed') === 'true') {
        return 1;
      }

      return 0;
    },

    repeat: () => {
      // Way to check if on repeat
      if (document.getElementsByTagName('ytmusic-player-bar')[0].getAttribute('repeat-mode_') !== 'NONE') {
        // Way to check if repeat one
        if (document.getElementsByTagName('ytmusic-player-bar')[0].getAttribute('repeat-mode_') === 'ONE') {
          return 2;
        }
        return 1;
      }
      return 0;
    },

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementById('play-pause-button').click();
    },

    next: () => {
      document.getElementsByClassName('next-button')[0].click();
    },

    previous: () => {
      document.getElementsByClassName('previous-button')[0].click();
    },

    progress: (progress) => {
      const loc = document.getElementById('progress-bar').children[0].children[0].children[0].getBoundingClientRect();
      progress *= loc.width;

      const a = document.getElementById('progress-bar').children[0].children[0].children[0];
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
      if (document.getElementsByTagName('video')[0].muted && volume > 0) {
        document.getElementsByTagName('video')[0].muted = false;
      } else if (volume === 0) {
        document.getElementsByTagName('video')[0].muted = true;
      }
      document.getElementsByTagName('video')[0].volume = volume;
    },

    repeat: () => {
      document.getElementsByClassName('repeat')[0].click();
    },

    shuffle: () => {
      document.getElementsByClassName('shuffle')[0].click();
    },

    toggleThumbsUp: () => {
      document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[1].click();
    },

    toggleThumbsDown: () => {
      document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[0].click();
    },

    rating: (rating) => {
      // Check if thumbs has two paths, if it does not then it is active
      if (rating > 3) {
        // If thumbs up is not active
        if (document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[1].getAttribute('aria-pressed') !== 'true') {
          document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[1].click();
        }
      } else if (rating < 3 && rating > 0) {
        // If thumbs down is not active active
        if (document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[0].getAttribute('aria-pressed') !== 'true') {
          document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[0].click();
        }
      } else {
        // If either is pressed undo that
        if (document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[1].getAttribute('aria-pressed') === 'true') {
          document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[1].click();
        }
        if (document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[0].getAttribute('aria-pressed') === 'true') {
          document.getElementsByClassName('middle-controls-buttons')[0].children[0].children[0].click();
        }
      }
    }
  };
}

setup();
init();
