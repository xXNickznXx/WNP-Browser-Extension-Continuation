// Adds support for Deezer

let lastAlbumURL = '';
let lastKnownAlbum = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Deezer';
    },

    readyCheck: () => {
      return document.getElementsByClassName('track-link').length > 0;
    },

    state: () => {
      return document
        .getElementsByClassName('player-controls')[0]
        .children[0].children[2].children[0].children[0].className.baseVal.includes('pause')
        ? 1
        : 2;
    },

    title: () => {
      return document.getElementsByClassName('track-link')[0].textContent;
    },

    artist: () => {
      return document.getElementsByClassName('track-link')[1].textContent;
    },

    album: () => {
      // Check if album URL has changed
      if (lastAlbumURL !== document.getElementsByClassName('track-link')[0].href) {
        // If changed set to new URL and update album name
        lastAlbumURL = document.getElementsByClassName('track-link')[0].href;

        const ajaxReq = new XMLHttpRequest();
        (ajaxReq.onreadystatechange = () => {
          if (ajaxReq.readyState === 4) {
            lastKnownAlbum = ajaxReq.response.querySelector('meta[name="twitter:title"]').content;
          }
        }),
          (ajaxReq.responseType = 'document');

        ajaxReq.open('get', document.getElementsByClassName('track-link')[0].href);
        ajaxReq.send();
      }

      return lastKnownAlbum;
    },

    cover: () => {
      return document.getElementsByClassName('queuelist')[0].children[0].children[0].children[0].src.replace('28x28', '1200x1200');
    },

    durationString: () => {
      return document.getElementsByClassName('slider-counter-max')[0].textContent;
    },

    positionString: () => {
      return document.getElementsByClassName('slider-counter-current')[0].textContent;
    },

    // Deezer has a dumb new volume system
    volume: null,

    rating: () => {
      for (const child of document.getElementsByClassName('track-actions')[0].children[0].children) {
        if (child.children[0].children[0].tagName === 'svg' && child.children[0].children[0].className.baseVal.includes('love')) {
          if (child.children[0].children[0].className.baseVal.includes('active')) {
            return 5;
          }
        }
      }
      return 0;
    },

    repeat: () => {
      const childCount = document.getElementsByClassName('player-options')[0].children[0].children[0].children[0].childElementCount;
      if (
        document
          .getElementsByClassName('player-options')[0]
          .children[0].children[0].children[0].children[childCount - 4].children[0].children[0].className.baseVal.includes('active')
      ) {
        if (
          document
            .getElementsByClassName('player-options')[0]
            .children[0].children[0].children[0].children[childCount - 4].children[0].children[0].className.baseVal.includes('one')
        ) {
          return 2;
        }
        return 1;
      }
      return 0;
    },

    shuffle: () => {
      const childCount = document.getElementsByClassName('player-options')[0].children[0].children[0].children[0].childElementCount;
      if (
        document
          .getElementsByClassName('player-options')[0]
          .children[0].children[0].children[0].children[childCount - 3].children[0].children[0].className.baseVal.includes('active')
      ) {
        return 1;
      }
      // Return shuffle true if using flow or a radio station
      else if (
        document.getElementsByClassName('player-options')[0].children[0].children[0].children[0].children[childCount - 3].children[0]
          .disabled
      ) {
        return 1;
      }
      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementsByClassName('player-controls')[0].children[0].children[2].children[0].click();
    },

    next: () => {
      document.getElementsByClassName('player-controls')[0].children[0].children[4].children[0].children[0].click();
    },

    previous: () => {
      document.getElementsByClassName('player-controls')[0].children[0].children[0].children[0].children[0].click();
    },

    progress: null,
    // Deezer has the dumbest progress bar I have ever seen, this will the the track bar to be active and show the tooltip
    // But it will not change the progress, if any one else wants to figure out this shit feel free
    // deezerEventHandler.progress = function(progress)
    // {
    //	// Deezer does another dumb thing where
    //
    //	let loc = document.getElementsByClassName("track-seekbar")[0].children[0].getBoundingClientRect();
    //
    //	let a = document.getElementsByClassName("track-seekbar")[0].children[0];
    //	let e = document.createEvent('MouseEvents');
    //
    //	e.initMouseEvent('mouseover', true, true, window, 1,
    //		screenX + loc.left + loc.width / 2, screenY + loc.top + loc.height / 2,
    //		loc.left + loc.width / 2, loc.top + loc.height / 2,
    //		false, false, false, false, 0, null);
    //	a.dispatchEvent(e);
    //
    //	loc = document.getElementsByClassName("track-seekbar")[0].children[0].children[1].children[2].getBoundingClientRect();
    //	progress *= loc.width;
    //	a = document.getElementsByClassName("track-seekbar")[0].children[0].children[1].children[2];
    //	e = document.createEvent('MouseEvents');
    //
    //	e.initMouseEvent('mouseover', true, true, window, 0,
    //		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
    //		loc.left + progress, loc.top + loc.height / 2,
    //		false, false, false, false, 0, null);
    //	a.dispatchEvent(e);
    //	e.initMouseEvent('mousedown', true, true, window, 1,
    //		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
    //		loc.left + progress, loc.top + loc.height / 2,
    //		false, false, false, false, 0, null);
    //	a.dispatchEvent(e);
    //	e.initMouseEvent('mousemove', true, true, window, 0,
    //		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
    //		loc.left + progress, loc.top + loc.height / 2,
    //		false, false, false, false, 0, null);
    //	a.dispatchEvent(e);
    //	e.initMouseEvent('mouseup', true, true, window, 1,
    //		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
    //		loc.left + progress, loc.top + loc.height / 2,
    //		false, false, false, false, 0, null);
    //	a.dispatchEvent(e);
    //	e.initMouseEvent('click', true, true, window, 1,
    //		screenX + loc.left + progress, screenY + loc.top + loc.height / 2,
    //		loc.left + progress, loc.top + loc.height / 2,
    //		false, false, false, false, 0, null);
    //	a.dispatchEvent(e);
    // };

    volume: null,

    repeat: () => {
      const childCount = document.getElementsByClassName('player-options')[0].children[0].children[0].children[0].childElementCount;
      document.getElementsByClassName('player-options')[0].children[0].children[0].children[0].children[childCount - 4].children[0].click();
    },

    shuffle: () => {
      const childCount = document.getElementsByClassName('player-options')[0].children[0].children[0].children[0].childElementCount;
      document.getElementsByClassName('player-options')[0].children[0].children[0].children[0].children[childCount - 3].children[0].click();
    },

    // Yup Deezers rating is still dumb
    toggleThumbsUp: () => {
      for (const child of document.getElementsByClassName('track-actions')[0].children[0].children) {
        if (child.children[0].children[0].tagName === 'svg' && child.children[0].children[0].className.baseVal.includes('love')) {
          child.children[0].click();
        }
      }
    },

    toggleThumbsDown: null,

    rating: (rating) => {
      for (const child of document.getElementsByClassName('track-actions')[0].children[0].children) {
        if (child.children[0].children[0].tagName === 'svg' && child.children[0].children[0].className.baseVal.includes('love')) {
          // We are rating this high
          if (rating > 3) {
            // If thumbs up is not active and now needs to be
            if (!child.children[0].children[0].className.baseVal.includes('active')) {
              child.children[0].click();
            }
          }
          // We are not rating this high
          else {
            // If thumbs up is active deactivate it
            if (child.children[0].children[0].className.baseVal.includes('active')) {
              child.children[0].click();
            }
          }
        }
      }
    }
  };
}

setup();
init();
