// This is a generic handler for unsupported sites.
// This will only run if given permissions on all sites.
// Note: Having an image is not guaranteed

let possibleArtist = '';

let element = null;
let elements = [];

// Proposed solution for dynamic instancing of content:
// Came up with for Pandora and improved to make it more dynamic

// Basically it adds to every element a function to call on time update
// This then accumulates sources that have updated until the current element is requested
// If the last returned element is in the updated list then it is returned
// If it is not then whatever element was updated the most recently is returned
// If the list is empty then it returns the last used element
// If no element has been used in the past then it returns the first video element in that page
// If there is no video element then it returns the first audio element in that page
// If these is no elements at all then it returns null
// At that point in time the accumlated elements are purged from the list

// Adds an audio or video source to a list of elements
function addToChangedList(source) {
  elements.push(source);
}

// eslint-disable-next-line no-unused-vars
function updateCurrentElement() {
  // If any elements have been updated since last check
  if (elements.length > 0) {
    // If last used element does not exist in array select a new one
    if (elements.indexOf(element) < 0) {
      // Update element to the element that came in most recently
      // TODO: make this ignore elements that are muted or have no sound
      // TODO: prioritize elements in the list that had a state or src change more recently to break ties
      element = elements[elements.length - 1];
    }
  }
  // No elements have been updated, only try to change element if it is null
  else if (element === null || element === undefined) {
    // Check all audio elements and set element to the first one with any length
    for (const audioEl of document.getElementsByTagName('audio')) {
      if (audioEl.duration > 0) {
        element = audioEl;
        break;
      }
    }
    // If no suitable audio element was found try to check for video elements
    if (element === null) {
      // TODO: check if there is a way to see if a video has audio
      for (const videoEl of document.getElementsByTagName('video')) {
        if (videoEl.duration > 0) {
          element = videoEl;
          break;
        }
      }
    }
  }

  // Clear array of updated elements
  elements = [];
}

function setupElementEvents() {
  for (const videoEl of document.getElementsByTagName('video')) {
    if (videoEl.ontimeupdate === null) {
      videoEl.ontimeupdate = () => {
        addToChangedList(this);
      };
    }
  }
  for (const audioEl of document.getElementsByTagName('audio')) {
    // TODO: may have to not check if null in case someone else has a time update event already (Although in those cases I may break their site)
    if (audioEl.ontimeupdate === null) {
      audioEl.ontimeupdate = () => {
        addToChangedList(this);
      };
    }
  }
}

// eslint-disable-next-line no-unused-vars
function setupGenericSite() {
  // TODO: possibly monitor all audio and video tags in a page for changes

  musicInfo = {
    player: () => {
      return document.domain;
    },

    readyCheck: () => {
      // Most elements will already have events attached but this will add it to any new elements
      setupElementEvents();
      return element !== undefined && element !== null && element.duration > 0;
    },

    state: () => {
      return element.paused ? 2 : 1;
    },

    title: () => {
      let title = '';
      // TODO: Send all of these to the artist guesser?
      if (document.querySelector('meta[property="og:title"]') !== null) {
        title = document.querySelector('meta[property="og:title"]').content;
      } else if (document.querySelector('meta[name="title"]') !== null) {
        title = document.querySelector('meta[name="title"]').content;
      } else {
        title = document.title;

        // TODO: Possibly strip stupid chars like ◼ ❙❙ ❚❚ ► ▮▮ ▶ ▷ ❘ ❘ ▷
      }

      // Try to inteligently parse title to see if it contains the artist info
      // This errors on the side of not getting the artist to prevent messing up the title
      // ie it does not just look for the word by in the title
      let temp = title.toLowerCase();
      let cutStart;
      let cutEnd;
      if (temp.includes(', by')) {
        // TODO: I probably could make this a function that takes a search string in the future

        // Find cutoff points
        cutStart = temp.indexOf(', by');
        cutEnd = temp.indexOf(', by') + 4; // +4 because I am lazy and ", by" is 4 chars
        temp = temp.substring(cutEnd);
        // Skip the space the the beginning if their is one
        if (temp.charAt(0) === ' ') {
          cutEnd++;
        }

        possibleArtist = title.substring(cutEnd);
        title = title.substring(0, cutStart);
      } else if (temp.includes('by:')) {
        // Find cutoff points
        cutStart = temp.indexOf('by:');
        cutEnd = temp.indexOf('by:') + 3; // +3 because I am lazy and "by:" is 3 chars
        temp = temp.substring(cutEnd);
        // Skip the space the the beginning if their is one
        if (temp.charAt(0) === ' ') {
          cutEnd++;
        }

        possibleArtist = title.substring(cutEnd);
        title = title.substring(0, cutStart);
      }
      // Possible additions that may be too aggressive "|" "-"

      return title;
    },

    artist: () => {
      if (possibleArtist.length > 0) {
        return possibleArtist;
      }

      let temp = document.domain;
      temp = temp.substring(0, temp.lastIndexOf('.'));
      temp = temp.substring(temp.lastIndexOf('.') + 1);
      temp = temp.charAt(0).toUpperCase() + temp.slice(1);

      if (temp === '') {
        temp = 'Localhost';
      }
      return temp;
    },

    album: () => {
      let temp = document.domain;
      temp = temp.substring(0, temp.lastIndexOf('.'));
      temp = temp.substring(temp.lastIndexOf('.') + 1);
      temp = temp.charAt(0).toUpperCase() + temp.slice(1);

      if (temp === '') {
        temp = 'Localhost';
      }
      return temp;
    },

    cover: () => {
      if (element.poster !== undefined) {
        return element.poster;
      }
      return document.querySelector('meta[property="og:image"]')?.content;
    },

    duration: () => {
      return element.duration;
    },

    position: () => {
      return element.currentTime;
    },

    volume: () => {
      if (!element.muted) {
        return element.volume;
      }
      return 0;
    },

    rating: null,

    repeat: () => {
      return element.loop ? 2 : 0;
    },

    shuffle: null
  };

  musicEventHandler = {
    readyCheck: musicInfo.readyCheck,

    playpause: () => {
      if (element.paused) {
        element.play();
      } else {
        element.pause();
      }
    },

    next: () => {
      element.currentTime = element.duration;
    },

    previous: () => {
      element.currentTime = 0;
    },

    progressSeconds: (position) => {
      element.currentTime = position;
    },

    volume: (volume) => {
      if (element.muted && volume > 0) {
        element.muted = false;
      } else if (volume === 0) {
        element.muted = true;
      }
      element.volume = volume;
    },

    repeat: () => {
      element.loop = !element.loop;
    },

    shuffle: null,

    toggleThumbsUp: null,

    toggleThumbsDown: null,

    rating: null
  };
}
