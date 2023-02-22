// ASCII titles generated with https://patorjk.com/software/taag/#p=display&f=Roman&t=THIS
/*
oooooo     oooo       .o.       ooooooooo.   ooooo       .o.       oooooooooo.  ooooo        oooooooooooo  .oooooo..o
 `888.     .8'       .888.      `888   `Y88. `888'      .888.      `888'   `Y8b `888'        `888'     `8 d8P'    `Y8
  `888.   .8'       .8"888.      888   .d88'  888      .8"888.      888     888  888          888         Y88bo.
   `888. .8'       .8' `888.     888ooo88P'   888     .8' `888.     888oooo888'  888          888oooo8     `"Y8888o.
    `888.8'       .88ooo8888.    888`88b.     888    .88ooo8888.    888    `88b  888          888    "         `"Y88b
     `888'       .8'     `888.   888  `88b.   888   .8'     `888.   888    .88P  888       o  888       o oo     .d8P
      `8'       o88o     o8888o o888o  o888o o888o o88o     o8888o o888bood8P'  o888ooooood8 o888ooooood8 8""88888P'
*/
let websocket;
let sendData;
let outdatedCheck;

// Use this object to define custom logic to retrieve data
let musicInfo = {
  // Mandatory, just give the player name
  player: null,
  // Check player is ready to start doing info checks. ie. it is fully loaded and has the song title
  // While false no other info checks will be called
  readyCheck: null,
  state: null,
  title: null,
  artist: null,
  album: null,
  cover: null,
  duration: null,
  durationString: null,
  position: null,
  positionString: null,
  volume: null,
  rating: null,
  repeat: null,
  shuffle: null
};

// Use this object to define custom event logic
let musicEventHandler = {
  readyCheck: null,
  playpause: null,
  next: null,
  previous: null,
  progress: null,
  progressSeconds: null,
  volume: null,
  repeat: null,
  shuffle: null,
  toggleThumbsUp: null,
  toggleThumbsDown: null,
  rating: null
};

// This is used to cache recently sent values so updates only send new values
const current = {
  player: null, // Always make sure this is set

  state: null,
  title: null,
  artist: null,
  album: null,
  cover: null,
  duration: null,
  position: null,
  volume: null,
  rating: null,
  repeat: null,
  shuffle: null
};

var MusicInfos;
(function (MusicInfos) {
  MusicInfos['STATE'] = 'state';
  MusicInfos['TITLE'] = 'title';
  MusicInfos['ARTIST'] = 'artist';
  MusicInfos['ALBUM'] = 'album';
  MusicInfos['COVER'] = 'cover';
  MusicInfos['DURATION'] = 'duration';
  MusicInfos['POSITION'] = 'position';
  MusicInfos['VOLUME'] = 'volume';
  MusicInfos['RATING'] = 'rating';
  MusicInfos['REPEAT'] = 'repeat';
  MusicInfos['SHUFFLE'] = 'shuffle';
})(MusicInfos || (MusicInfos = {}));

/*
ooooo   ooooo oooooooooooo ooooo        ooooooooo.   oooooooooooo ooooooooo.    .oooooo..o
`888'   `888' `888'     `8 `888'        `888   `Y88. `888'     `8 `888   `Y88. d8P'    `Y8
 888     888   888          888          888   .d88'  888          888   .d88' Y88bo.
 888ooooo888   888oooo8     888          888ooo88P'   888oooo8     888ooo88P'   `"Y8888o.
 888     888   888    "     888          888          888    "     888`88b.         `"Y88b
 888     888   888       o  888       o  888          888       o  888  `88b.  oo     .d8P
o888o   o888o o888ooooood8 o888ooooood8 o888o        o888ooooood8 o888o  o888o 8""88888P'
*/
function pad(number) {
  let numberAsString = String(number);
  return numberAsString.length < 2 ? `0${numberAsString}` : numberAsString;
}

// Convert seconds to a time string acceptable to Rainmeter
function convertNumberToTimeString(numberInSeconds) {
  const numberInMinutes = parseInt(numberInSeconds / 60);
  if (numberInMinutes < 60) {
    return `${numberInMinutes}:${pad(parseInt(numberInSeconds % 60))}`;
  }
  return `${parseInt(numberInMinutes / 60)}:${pad(parseInt(numberInMinutes % 60))}:${pad(parseInt(numberInSeconds % 60))}`;
}

/*
ooooo     ooo ooooooooo.   oooooooooo.         .o.       ooooooooooooo oooooooooooo ooooooooo.
`888'     `8' `888   `Y88. `888'   `Y8b       .888.      8'   888   `8 `888'     `8 `888   `Y88.
 888       8   888   .d88'  888      888     .8"888.          888       888          888   .d88'
 888       8   888ooo88P'   888      888    .8' `888.         888       888oooo8     888ooo88P'
 888       8   888          888      888   .88ooo8888.        888       888    "     888`88b.
 `88.    .8'   888          888     d88'  .8'     `888.       888       888       o  888  `88b.
   `YbodP'    o888o        o888bood8P'   o88o     o8888o     o888o     o888ooooood8 o888o  o888o
*/
function updateInfo() {
  if (musicInfo.readyCheck === null || musicInfo.readyCheck()) {
    for (const [key, value] of Object.entries(MusicInfos)) {
      // Try catch for each updater to make sure info is fail safe
      try {
        if (value === MusicInfos.DURATION || value === MusicInfos.POSITION) {
          if (musicInfo[`${value}String`] !== null && musicInfo[`${value}String`] !== undefined) {
            const temp = musicInfo[`${value}String`]();
            if (current[value] !== temp && temp !== null) {
              websocket.send(`${key}:${temp}`);
              current[value] = temp;
            }
          } else if (musicInfo[value] !== null && musicInfo[value] !== undefined) {
            const temp = isNaN(musicInfo[value]()) ? null : convertNumberToTimeString(musicInfo[value]());
            if (current[value] !== temp && temp !== null) {
              websocket.send(`${key}:${temp}`);
              current[value] = temp;
            }
          }
        } else if (value === MusicInfos.VOLUME) {
          if (musicInfo[value] !== null && musicInfo[value] !== undefined) {
            const temp = isNaN(musicInfo[value]()) ? null : parseFloat(musicInfo.volume()) * 100;
            if (current[value] !== temp && temp !== null) {
              websocket.send(`${key}:${temp}`);
              current[value] = temp;
            }
          }
        } else {
          if (musicInfo[value] !== null && musicInfo[value] !== undefined) {
            const temp = musicInfo[value]();
            if (current[value] !== temp && temp !== null) {
              websocket.send(`${key}:${temp}`);
              current[value] = temp;
            }
          }
        }
      } catch (e) {
        websocket.send(`Error: [Cannot update "${value}" for ${musicInfo.player()}]`);
        websocket.send(`ErrorD: [${e}]`);
        throw e;
      }
    }
  } else {
    // TODO: Maybe make it so it clears data/disconnects if this is true and not just sets music to stopped
    if (current.state !== 0) {
      websocket.send('STATE:0');
      current.state = 0;
    }
  }
}

/*
oooooooooooo oooooo     oooo oooooooooooo ooooo      ooo ooooooooooooo  .oooooo..o
`888'     `8  `888.     .8'  `888'     `8 `888b.     `8' 8'   888   `8 d8P'    `Y8
 888           `888.   .8'    888          8 `88b.    8       888      Y88bo.
 888oooo8       `888. .8'     888oooo8     8   `88b.  8       888       `"Y8888o.
 888    "        `888.8'      888    "     8     `88b.8       888           `"Y88b
 888       o      `888'       888       o  8       `888       888      oo     .d8P
o888ooooood8       `8'       o888ooooood8 o8o        `8      o888o     8""88888P'
*/
function fireEvent(event) {
  try {
    if (musicEventHandler.readyCheck === null || musicEventHandler.readyCheck()) {
      if (event.data.toLowerCase() === 'playpause' && musicEventHandler.playpause !== null && musicEventHandler.playpause !== undefined) {
        musicEventHandler.playpause();
      } else if (event.data.toLowerCase() === 'next' && musicEventHandler.next !== null && musicEventHandler.next !== undefined) {
        musicEventHandler.next();
      } else if (
        event.data.toLowerCase() === 'previous' &&
        musicEventHandler.previous !== null &&
        musicEventHandler.previous !== undefined
      ) {
        musicEventHandler.previous();
      } else if (event.data.toLowerCase().includes('setprogress ') || event.data.toLowerCase().includes('setposition ')) {
        if (musicEventHandler.progress !== null && musicEventHandler.progress !== undefined) {
          let progress = event.data.toLowerCase();
          // +9 because "progress " is 9 chars
          progress = progress.substring(progress.indexOf('progress ') + 9);
          // Goto the : at the end of the command, this command is now a compound command the first half is seconds the second is percent
          progress = parseFloat(progress.substring(0, progress.indexOf(':')));

          musicEventHandler.progress(progress);
        } else if (musicEventHandler.progressSeconds !== null && musicEventHandler.progressSeconds !== undefined) {
          let position = event.data.toLowerCase();
          // +9 because "position " is 9 chars
          position = position.substring(position.indexOf('position ') + 9);
          // Goto the : at the end of the command, this command is now a compound command the first half is seconds the second is percent
          position = parseInt(position.substring(0, position.indexOf(':')));

          musicEventHandler.progressSeconds(position);
        }
      } else if (
        event.data.toLowerCase().includes('setvolume ') &&
        musicEventHandler.volume !== null &&
        musicEventHandler.volume !== undefined
      ) {
        let volume = event.data.toLowerCase();
        // +7 because "volume " is 7 chars
        volume = parseInt(volume.substring(volume.indexOf('volume ') + 7)) / 100;
        musicEventHandler.volume(volume);
      } else if (event.data.toLowerCase() === 'repeat' && musicEventHandler.repeat !== null && musicEventHandler.repeat !== undefined) {
        musicEventHandler.repeat();
      } else if (event.data.toLowerCase() === 'shuffle' && musicEventHandler.shuffle !== null && musicEventHandler.shuffle !== undefined) {
        musicEventHandler.shuffle();
      } else if (
        event.data.toLowerCase() === 'togglethumbsup' &&
        musicEventHandler.toggleThumbsUp !== null &&
        musicEventHandler.toggleThumbsUp !== undefined
      ) {
        musicEventHandler.toggleThumbsUp();
      } else if (
        event.data.toLowerCase() === 'togglethumbsdown' &&
        musicEventHandler.toggleThumbsDown !== null &&
        musicEventHandler.toggleThumbsDown !== undefined
      ) {
        musicEventHandler.toggleThumbsDown();
      } else if (
        event.data.toLowerCase().includes('rating') &&
        musicEventHandler.rating !== null &&
        musicEventHandler.rating !== undefined
      ) {
        let rating = event.data.toLowerCase();
        // Check if additional rating info is given
        if (rating.length > 6) {
          // +7 because "rating " is 7 chars
          rating = parseInt(rating.substring(rating.indexOf('rating ') + 7));
        } else {
          rating = 0;
        }
        musicEventHandler.rating(rating);
      }
    }
  } catch (e) {
    websocket.send(`Error: [Cannot send event to ${musicInfo.player()}]`);
    websocket.send(`ErrorD: [${e}]`);
    throw e;
  }
}

/*
 .oooooo..o oooooooooooo ooooooooooooo ooooo     ooo ooooooooo.
d8P'    `Y8 `888'     `8 8'   888   `8 `888'     `8' `888   `Y88.
Y88bo.       888              888       888       8   888   .d88'
 `"Y8888o.   888oooo8         888       888       8   888ooo88P'
     `"Y88b  888    "         888       888       8   888
oo     .d8P  888       o      888       `88.    .8'   888
8""88888P'  o888ooooood8     o888o        `YbodP'    o888o
*/

// Max length of time between attempting to reconnect
// 1000 = 1s * 60 = 1min
const MAXTIMEOUT = 1000 * 60;
let connectionAttemptCount = 0;
// eslint-disable-next-line no-unused-vars
function init() {
  // TODO: allow custom ports
  const url = 'ws://127.0.0.1:8974/';
  websocket = new WebSocket(url);
  websocket.onopen = () => {
    // Reset connection attempts since we are now connected
    connectionAttemptCount = 0;
    current.player = musicInfo.player();
    websocket.send(`PLAYER:${current.player}`);
    // If this is not cleared in 1s then assume plugin version is so old it has no version send
    outdatedCheck = setTimeout(() => {
      chrome.runtime.sendMessage({ method: 'flagAsOutdated' });
    }, 1000);
    // TODO: Dynamic update rate based on success rate
    sendData = setInterval(() => {
      if (websocket.readyState === WebSocket.OPEN) {
        updateInfo();
      }
    }, 100);
  };
  websocket.onclose = () => {
    chrome.runtime.sendMessage({ method: 'flagAsNotConnected' });
    clearInterval(sendData);
    connectionAttemptCount++;
    // If we fail repeatedly, exponentially increase the length of time between connection attempts
    // Cap at maximum timeout
    const timeoutLength = Math.min(1000 + Math.pow(10, connectionAttemptCount / 4), MAXTIMEOUT);
    setTimeout(() => {
      init();
    }, timeoutLength);
  };
  websocket.onmessage = (event) => {
    const versionNumber = event.data.toLowerCase().split(':');
    if (versionNumber[0].includes('version')) {
      // Check that version number is the same major version
      if (versionNumber[1].split('.')[1] < 5) {
        chrome.runtime.sendMessage({ method: 'flagAsOutdated' });
      } else {
        // Clear timeout set above
        clearTimeout(outdatedCheck);

        chrome.runtime.sendMessage({ method: 'flagAsConnected' });
      }
    }
    try {
      fireEvent(event);
    } catch (e) {
      websocket.send(`Error: [${e}]`);
      throw e;
    }
  };
  websocket.onerror = (event) => {
    if (typeof event.data !== 'undefined') {
      throw event;
    }
  };
}

window.onbeforeunload = () => {
  if (websocket !== undefined) {
    websocket.onclose = () => {}; // disable onclose handler first
    websocket.close();
  }
};
