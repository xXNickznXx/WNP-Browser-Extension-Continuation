// Adds support for Soundcloud

let lastKnownTag = '';

function setup() {
  musicInfo = {
    player: () => {
      return 'Soundcloud';
    },

    readyCheck: () => {
      return document.getElementsByClassName('playbackSoundBadge__title').length > 0;
    },

    state: () => {
      return document.getElementsByClassName('playControl')[0].className.includes('playing') ? 1 : 2;
    },

    title: () => {
      // Avoid using the titles from web-now-playing.js wherever possible
      // This is done so we know when we need to reset the tag used for the album
      /* globals currTitle:true */
      if (currTitle !== document.getElementsByClassName('playbackSoundBadge__titleLink')[0].title) {
        lastKnownTag = '';
      }
      return document.getElementsByClassName('playbackSoundBadge__titleLink')[0].title;
    },

    artist: () => {
      return document.getElementsByClassName('playbackSoundBadge__lightLink')[0].textContent;
    },

    album: () => {
      if (document.getElementsByClassName('sc-button-play playButton sc-button sc-button-xlarge sc-button-pause').length > 0) {
        const tag = document.getElementsByClassName('sc-button-play playButton sc-button sc-button-xlarge sc-button-pause')[0].parentElement
          .parentElement.children[2].children;
        lastKnownTag = tag[tag.length - 1].textContent;
        return tag[tag.length - 1].textContent;
      }
      if (document.getElementsByClassName('queueItemView m-active').length > 0) {
        return document.getElementsByClassName('queueItemView m-active')[0].children[2].children[0].children[1].title.replace('From ', '');
      }
      return lastKnownTag;
    },

    cover: () => {
      const currCover = document.getElementsByClassName('playbackSoundBadge__avatar sc-media-image')[0].children[0].children[0].style
        .backgroundImage;
      return currCover
        .substring(currCover.indexOf('(') + 2, currCover.indexOf(')') - 1)
        .replace('50x50', '500x500')
        .replace('120x120', '500x500');
    },

    durationString: () => {
      return document.getElementsByClassName('playbackTimeline__duration')[0].children[1].textContent;
    },

    positionString: () => {
      return document.getElementsByClassName('playbackTimeline__timePassed')[0].children[1].textContent;
    },

    volume: () => {
      return (
        parseInt(document.getElementsByClassName('volume__sliderProgress')[0].style.height) /
        document.getElementsByClassName('volume__sliderBackground')[0].getBoundingClientRect().height
      );
    },

    rating: () => {
      if (document.getElementsByClassName('playbackSoundBadge__like')[0].className.includes('selected')) {
        return 5;
      }
      return 0;
    },

    repeat: () => {
      if (document.getElementsByClassName('m-one').length > 0) {
        return 2;
      }
      if (document.getElementsByClassName('m-all').length > 0) {
        return 1;
      }
      return 0;
    },

    shuffle: () => {
      if (document.getElementsByClassName('m-shuffling').length > 0) {
        return 1;
      }
      return 0;
    }
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      document.getElementsByClassName('playControl')[0].click();
    },

    next: () => {
      document.getElementsByClassName('skipControl__next')[0].click();
    },

    previous: () => {
      document.getElementsByClassName('skipControl__previous')[0].click();
    },

    progress: (progress) => {
      const loc = document.getElementsByClassName('playbackTimeline__progressWrapper')[0].getBoundingClientRect();
      progress *= loc.width;

      const a = document.getElementsByClassName('playbackTimeline__progressWrapper')[0];
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
      let a = document.getElementsByClassName('volume')[0];
      let e = document.createEvent('MouseEvents');
      e.initMouseEvent('mouseover', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
      e.initMouseEvent('mousemove', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);

      let counter = 0;
      const volumeReadyTest = setInterval(() => {
        if (document.getElementsByClassName('volume expanded hover').length > 0) {
          clearInterval(volumeReadyTest);
          const loc = document.getElementsByClassName('volume__sliderBackground')[0].getBoundingClientRect();
          volume *= loc.height;

          a = document.getElementsByClassName('volume__sliderBackground')[0];
          e = document.createEvent('MouseEvents');
          // As much as I hate hard coded stuff for some reason the click is always of by 5, no idea where it comes from but it is always exactly 5
          e.initMouseEvent(
            'mousedown',
            true,
            true,
            window,
            1,
            screenX + loc.left + loc.width / 2,
            screenY + loc.bottom - volume + 5,
            loc.left + loc.width / 2,
            loc.bottom - volume + 5,
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
            screenX + loc.left + loc.width / 2,
            screenY + loc.bottom - volume + 5,
            loc.left + loc.width / 2,
            loc.bottom - volume + 5,
            false,
            false,
            false,
            false,
            0,
            null
          );
          a.dispatchEvent(e);

          a = document.getElementsByClassName('volume')[0];
          e = document.createEvent('MouseEvents');
          e.initMouseEvent('mouseout', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          a.dispatchEvent(e);
        } else {
          counter++;
          if (counter > 10) {
            clearInterval(volumeReadyTest);
          }
        }
      }, 25);
    },

    repeat: () => {
      document.getElementsByClassName('repeatControl')[0].click();
    },

    shuffle: () => {
      document.getElementsByClassName('shuffleControl')[0].click();
    },

    toggleThumbsUp: () => {
      document.getElementsByClassName('playbackSoundBadge__like')[0].click();
    },

    toggleThumbsDown: null,

    rating: (rating) => {
      // Check if thumbs has two paths, if it does not then it is active
      if (rating > 3) {
        // If thumbs up is not active
        if (!document.getElementsByClassName('playbackSoundBadge__like')[0].className.includes('selected')) {
          document.getElementsByClassName('playbackSoundBadge__like')[0].click();
        }
      } else {
        if (document.getElementsByClassName('playbackSoundBadge__like')[0].className.includes('selected')) {
          document.getElementsByClassName('playbackSoundBadge__like')[0].click();
        }
      }
    }
  };
}

setup();
init();
