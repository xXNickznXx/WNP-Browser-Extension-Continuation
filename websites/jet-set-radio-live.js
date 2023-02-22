// Adds support for Jet Set Radio Live

let songInfoEl;
let player;
let cover;

function _wallpaperCanvas(bgUrl, cb) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  (img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0, 0);
    cb(canvas);
  }),
    (img.src = bgUrl);
}

function generateCover(bg) {
  if (typeof bg === 'string') {
    _wallpaperCanvas(bg, (wall) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      (img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(wall, (canvas.width - wall.width) * 0.5, (canvas.height - wall.height) * 0.5);
        ctx.drawImage(this, 0, 0);
        cover = canvas.toDataURL('image/png');
      }),
        (img.src = document.querySelector('#graffitiSoulFrame > img').src);
    });
  } else {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    (img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = document.querySelector('#chameleonWallpaper').style.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this, 0, 0);
      cover = canvas.toDataURL('image/png');
    }),
      (img.src = document.querySelector('#graffitiSoulFrame > img').src);
  }
}

// https://stackoverflow.com/a/29939805
function basename(str, sep, ext) {
  str = str.substr(str.lastIndexOf(sep) + 1);
  if (ext) str = str.substr(0, str.lastIndexOf('.'));
  return str;
}

// Get track info from file name instead of #programInformationText so we can show info while it loads and when paused
function getTrackInfo() {
  return decodeURIComponent(basename(document.querySelector('#audioPlayer').currentSrc, '/', true)).split(/ - (.+)/);
}

function setup() {
  musicInfo = {
    player: () => {
      return 'Jet Set Radio Live';
    },

    readyCheck: () => {
      player = document.querySelector('#audioPlayer');
      songInfoEl = document.querySelector('#programInformationText');
      return songInfoEl && songInfoEl.innerHTML.length > 0;
    },

    state: () => {
      return player.paused ? 2 : 1;
    },

    title: () => {
      const text = songInfoEl.textContent;
      if (text === 'Bump') return 'Bump';

      return getTrackInfo()[1];
    },

    artist: () => {
      const text = songInfoEl.textContent;
      if (text === 'Bump') return 'DJ Professor K';

      return getTrackInfo()[0];
    },

    album: null,

    cover: () => {
      return cover;
    },

    duration: () => {
      return player.duration;
    },

    position: () => {
      return player.currentTime;
    },

    volume: () => {
      return player.volume;
    },

    rating: null,

    repeat: null,

    shuffle: () => {
      const shuffleBtn = document.querySelector('#shuffleButton');
      if (shuffleBtn) {
        return document.querySelector('#shuffleButton').style.opacity === '1' ? 1 : 0;
      }
      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      if (player.paused) {
        document.querySelector('#playTrackButton').dispatchEvent(new Event('mousedown'));
      } else {
        document.querySelector('#pauseTrackButton').dispatchEvent(new Event('mousedown'));
      }
    },

    next: () => {
      document.querySelector('#nextTrackButton').dispatchEvent(new Event('mousedown'));
    },

    previous: null,

    progressSeconds: (position) => {
      player.currentTime = position;
    },

    volume: (volume) => {
      if (player.muted && volume > 0) {
        player.muted = false;
      } else if (volume === 0) {
        player.muted = true;
      }
      player.volume = volume;
    },

    repeat: null,

    shuffle: () => {
      const shuffleBtn = document.querySelector('#shuffleButton');
      if (shuffleBtn) {
        shuffleBtn.dispatchEvent(new Event('mousedown'));
      }
    },

    toggleThumbsUp: null,

    toggleThumbsDown: null,

    rating: null
  };
}

// Only generate cover when station image changes
document.querySelector('#graffitiSoul').onload = () => generateCover();
// ...and again when the new background is eventually loaded
document.querySelector('#wallpaperImageTop').onload = (event) => generateCover(event.target.src);

setup();
init();
