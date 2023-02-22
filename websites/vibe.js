// Adds support for VIBE

function setup() {
  musicInfo = {
    player: () => {
      return 'VIBE';
    },

    readyCheck: () => {
      return document.getElementsByClassName('menu_item item_library').length > 0;
    },

    state: () => {
      return document.getElementsByClassName('btn_now')[0].className.includes('play') ? 1 : 2;
    },

    title: () => {
      return document.getElementsByClassName('link')[0].textContent;
    },

    artist: () => {
      const artists = document.getElementsByClassName('artist')[0].textContent;
      return artists.substring(6);
    },

    album: () => {
      return document.getElementsByClassName('ly_info_area')[0].children[0].title;
    },

    cover: () => {
      const currCover = document.getElementsByClassName('thumb_cover')[0].children[0].src;
      return currCover.substring(0, currCover.indexOf('&'));
    },

    durationString: () => {
      const totalTime = document.getElementsByClassName('remain')[0].textContent;
      return totalTime.substring(totalTime.indexOf(':') - 2, totalTime.indexOf(':') + 3);
    },

    positionString: () => {
      const currTime = document.getElementsByClassName('now')[0].textContent;
      return currTime.substring(currTime.indexOf(':') - 2, currTime.indexOf(':') + 3);
    },

    volume: () => {
      return parseInt(document.getElementsByClassName('bar_status')[0].children[0].style.width) / 100;
    },

    rating: () => {
      if (document.getElementsByClassName('btn_like')[0].className.includes('on')) {
        return 5;
      }
      return 0;
    },

    repeat: () => {
      if (document.getElementsByClassName('btn_repeat')[0].className.includes('once')) {
        return 2;
      }
      if (document.getElementsByClassName('btn_repeat')[0].className.includes('all')) {
        return 1;
      }
      return 0;
    },

    shuffle: () => {
      if (document.getElementsByClassName('btn_shuffle')[0].className.includes('on')) {
        return 1;
      }
      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementsByClassName('btn_now')[0].click();
    },

    next: () => {
      document.getElementsByClassName('btn_play_next')[0].click();
    },

    previous: () => {
      document.getElementsByClassName('btn_play_prev')[0].click();
    },

    progress: (progress) => {
      const loc = document.getElementsByClassName('playing_progress')[0].getBoundingClientRect();
      progress *= loc.width;

      const a = document.getElementsByClassName('playing_progress')[0].children[0].children[1];
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

    volume: (
      // kanged from spotify.js
      volume
    ) => {
      const loc = document.getElementsByClassName('bar_volume')[0].getBoundingClientRect();
      volume *= loc.width;

      const a = document.getElementsByClassName('bar_volume')[0].children[0].children[0];
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
      document.getElementsByClassName('btn_repeat')[0].click();
    },

    shuffle: () => {
      document.getElementsByClassName('btn_shuffle')[0].click();
    },

    toggleThumbsUp: () => {
      document.getElementsByClassName('btn_like')[0].click();
    },

    toggleThumbsDown: null,

    rating: null
  };
}

setup();
init();
