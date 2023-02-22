// TODO: eval not supported in MV3. wait for https://github.com/w3c/webextensions/pull/331
// eslint-disable-next-line no-unused-vars
function setupCustomSite([key, value]) {
  const musicInfos = value.musicInfo;
  musicInfo = {
    player: () => key,

    readyCheck: musicInfos.readyCheck ? () => new Function(musicInfos.readyCheck)() : null,

    state: musicInfos.state ? () => new Function(musicInfos.state)() : null,

    title: musicInfos.title ? () => new Function(musicInfos.title)() : null,

    artist: musicInfos.artist ? () => new Function(musicInfos.artist)() : null,

    album: musicInfos.album ? () => new Function(musicInfos.album)() : null,

    cover: musicInfos.cover ? () => new Function(musicInfos.cover)() : null,

    duration: musicInfos.duration ? () => new Function(musicInfos.duration)() : null,

    durationString: musicInfos.durationString ? () => new Function(musicInfos.durationString)() : null,

    position: musicInfos.position ? () => new Function(musicInfos.position)() : null,

    positionString: musicInfos.positionString ? () => new Function(musicInfos.positionString)() : null,

    volume: musicInfos.volume ? () => new Function(musicInfos.volume)() : null,

    rating: musicInfos.rating ? () => new Function(musicInfos.rating)() : null,

    repeat: musicInfos.repeat ? () => new Function(musicInfos.repeat)() : null,

    shuffle: musicInfos.shuffle ? () => new Function(musicInfos.shuffle)() : null
  };

  const musicEventHandlers = value.musicEventHandler;
  musicEventHandler = {
    readyCheck: musicEventHandlers.readyCheck ? () => new Function(musicEventHandlers.readyCheck)() : musicInfo.readyCheck,

    playpause: musicEventHandlers.playpause ? () => new Function(musicEventHandlers.playpause)() : null,

    next: musicEventHandlers.next ? () => new Function(musicEventHandlers.next)() : null,

    previous: musicEventHandlers.previous ? () => new Function(musicEventHandlers.previous)() : null,

    // TODO: implement
    progress: (progress) => {
      console.log(progress);
    },

    // TODO: implement
    progressSeconds: (position) => {
      console.log(position);
    },

    // TODO: implement
    volume: (volume) => {
      console.log(volume);
    },

    repeat: musicEventHandlers.repeat ? () => new Function(musicEventHandlers.repeat)() : null,

    shuffle: musicEventHandlers.shuffle ? () => new Function(musicEventHandlers.shuffle)() : null,

    toggleThumbsUp: musicEventHandlers.toggleThumbsUp ? () => new Function(musicEventHandlers.toggleThumbsUp)() : null,

    toggleThumbsDown: musicEventHandlers.toggleThumbsDown ? () => new Function(musicEventHandlers.toggleThumbsDown)() : null,

    // TODO: implement
    rating: (rating) => {
      console.log(rating);
    }
  };
}
