// Adds support for PlayerFM

function setup() {
  musicInfo = {
    player: () => {
      return 'PlayerFM';
    },

    readyCheck: () => {
      return (
        document.getElementsByClassName('current-series-link').length > 0 &&
        document.getElementsByClassName('current-series-link')[0].textContent.length > 0
      );
    },

    state: () => {
      return document.getElementsByClassName('control pause')[0].style.display === '' ? 1 : 2;
    },

    title: () => {
      return document.getElementsByClassName('current-episode-link')[0].textContent;
    },

    artist: () => {
      return document.getElementsByClassName('current-series-link')[0].textContent;
    },

    album: null,

    cover: () => {
      const coverSmall = document.getElementsByClassName('thumb')[0].children[0].getAttribute('src');
      return coverSmall.replace('128', '256');
    },

    durationString: () => {
      // Player.fm displayes duration as "time remaining" so we have to do some math to find the actual duration
      // for the currently playing media.
      const remainingDuration = document.getElementsByClassName('time-remaining')[0].textContent;
      const currentPosition = document.getElementsByClassName('time-elapsed')[0].textContent;

      const times = [0, 0, 0];
      const max = times.length;

      const positionParts = (currentPosition || '').split(':');
      const durationParts = (remainingDuration || '').split(':');

      // normalize time values
      for (let i = 0; i < max; i++) {
        positionParts[i] = isNaN(parseInt(positionParts[i])) ? 0 : parseInt(positionParts[i]);
        durationParts[i] = isNaN(parseInt(durationParts[i])) ? 0 : parseInt(durationParts[i]);
      }

      // store time values
      for (let i = 0; i < max; i++) {
        times[i] = positionParts[i] + durationParts[i];
      }

      let hours = times[0];
      let minutes = times[1];
      let seconds = times[2];

      if (seconds >= 60) {
        const m = (seconds / 60) << 0;
        minutes += m;
        seconds -= 60 * m;
      }

      if (minutes >= 60) {
        const h = (minutes / 60) << 0;
        hours += h;
        minutes -= 60 * h;
      }

      return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    },

    positionString: () => {
      return document.getElementsByClassName('time-elapsed')[0].textContent;
    },

    volume: null,

    rating: null,

    repeat: null,

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      if (document.getElementsByClassName('control play')[0].style.display === 'none') {
        document.getElementsByClassName('control pause')[0].click();
      } else {
        document.getElementsByClassName('control play')[0].click();
      }
    },

    next: () => {
      document.getElementsByClassName('control fast-forward')[0].click();
    },

    previous: () => {
      document.getElementsByClassName('control fast-backward')[0].click();
    },

    progress: (progress) => {
      const loc = document.getElementsByClassName('progress-base')[0].getBoundingClientRect();
      progress *= loc.width;

      const a = document.getElementsByClassName('progress-base')[0];
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

    volume: null,

    repeat: null,

    shuffle: null,

    toggleThumbsUp: null,

    toggleThumbsDown: null,

    rating: null
  };
}

setup();
init();
