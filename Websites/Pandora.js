//Adds support for Pandora

function capitalize(str)
{
	str = str.replace(/-/g, ' ');
	return str.replace(/\w\S*/g, function(txt)
	{
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

var lastKnownAlbum = "";
var currAudioElement;

function setup()
{
	var pandoraInfoHandler = createNewMusicInfo();

	pandoraInfoHandler.player = function()
	{
		return "Pandora";
	};

	pandoraInfoHandler.readyCheck = function()
	{
		//Makes sure the current music element used is up to date
		for (i = 0; i < document.getElementsByTagName("audio").length; i++)
		{
			if (document.getElementsByTagName("audio")[i].ontimeupdate === null)
			{
				document.getElementsByTagName("audio")[i].ontimeupdate = function()
				{
					currAudioElement = this;
				}
			}
		}

		return document.getElementsByClassName("Tuner__Audio__TrackDetail__title").length > 0 &&
			currAudioElement != null;
	};

	pandoraInfoHandler.state = function()
	{
		//If pandora asked if you are still listening it is paused
		if (document.getElementsByClassName("StillListeningBody").length > 0)
		{
			return 2;
		}
		return document.getElementsByClassName("PlayButton__Icon")[0].children[0].getAttribute("xlink:href").includes("pause") ? 1 : 2;
	};
	pandoraInfoHandler.title = function()
	{
		//Avoid using the titles from WebNowPlaying.js wherever possible
		//This is done so we know when we need to reset the tag used for the album
		if (currTitle !== document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].innerText)
		{
			lastKnownAlbum = "";
		}
		return document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].innerText;
	};
	pandoraInfoHandler.artist = function()
	{
		//Avoid using the titles from WebNowPlaying.js wherever possible
		//This is done so we know when we need to reset the tag used for the album
		if (currAlbum !== document.getElementsByClassName("Tuner__Audio__TrackDetail__artist")[0].innerText)
		{
			lastKnownAlbum = "";
		}
		return document.getElementsByClassName("Tuner__Audio__TrackDetail__artist")[0].innerText;
	};
	pandoraInfoHandler.album = function()
	{
		if (document.getElementsByClassName("nowPlayingTopInfo__current__albumName").length > 0)
		{
			lastKnownAlbum = document.getElementsByClassName("nowPlayingTopInfo__current__albumName")[0].innerText;
			return lastKnownAlbum;
		}
		//Fallback for it album is not visable, note that it is url formatted so I have to do extra parsing
		//This will only run if the album has changed
		else if (lastKnownAlbum === "")
		{
			//Do all extra pasing in advance so string check works accross both if I already have the string set correctly
			var albumURL = document.getElementsByClassName("Tuner__Audio__TrackDetail__title")[0].children[0].href.replace("://www.pandora.com/artist/", "");
			albumURL = albumURL.substring(albumURL.indexOf("/") + 1);
			return capitalize(albumURL.substring(0, albumURL.indexOf("/")));
		}

		return lastKnownAlbum;
	};
	pandoraInfoHandler.cover = function()
	{
		return document.getElementsByClassName("ImageLoader__cover")[document.getElementsByClassName("ImageLoader__cover").length - 1].src.replace("90W_90H", "500W_500H");
	};
	pandoraInfoHandler.durationString = function()
	{
		return document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[2].innerText;
	};
	pandoraInfoHandler.positionString = function()
	{
		return document.getElementsByClassName("VolumeDurationControl__Duration")[0].children[0].innerText;
	};
	pandoraInfoHandler.volume = function()
	{
		return currAudioElement.volume;
	};
	pandoraInfoHandler.rating = function()
	{
		if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length > 0)
		{
			return 5;
		}
		else if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length > 0)
		{
			return 1;
		}
		return 0;
	};
	pandoraInfoHandler.repeat = null;
	pandoraInfoHandler.shuffle = function()
	{
		return document.getElementsByClassName("ShuffleButton__button__shuffleString")[0].innerText.includes("On") ? 1 : 0;
	};


	var pandoraEventHandler = createNewMusicEventHandler();

	//Define custom check logic to make sure you are not trying to update info when nothing is playing
	pandoraEventHandler.readyCheck = function()
	{
		return document.getElementsByClassName("Tuner__Audio__TrackDetail__title").length > 0;
	};

	pandoraEventHandler.playpause = function()
	{
		//Click on still listening pop if it exists
		if (document.getElementsByClassName("StillListeningBody").length > 0)
		{
			document.getElementsByClassName("StillListeningBody")[0].children[2].click();
		}
		document.getElementsByClassName("PlayButton")[0].click();
	};
	pandoraEventHandler.next = function()
	{
		document.getElementsByClassName("SkipButton")[0].click();
	};
	pandoraEventHandler.previous = function()
	{
		document.getElementsByClassName("ReplayButton")[0].click();
	};
	pandoraEventHandler.progressSeconds = function(position)
	{
		currAudioElement.currentTime = position;;
	};
	pandoraEventHandler.volume = function(volume)
	{
		if (currAudioElement.muted && volume > 0)
		{
			currAudioElement.muted = false;
		}
		else if (volume == 0)
		{
			currAudioElement.muted = true;
		}
		currAudioElement.volume = volume;
	};
	pandoraEventHandler.repeat = null;
	pandoraEventHandler.shuffle = function()
	{
		document.getElementsByClassName("ShuffleButton__button__shuffleString")[0].click();
	};
	pandoraEventHandler.toggleThumbsUp = function()
	{
		document.getElementsByClassName("ThumbUpButton ")[0].click();
	};
	pandoraEventHandler.toggleThumbsDown = function()
	{
		document.getElementsByClassName("ThumbDownButton")[0].click();
	};
	pandoraEventHandler.rating = function(rating)
	{
		//Check if thumbs has two paths, if it does not then it is active
		if (rating > 3)
		{
			//If thumbs up is not active
			if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length === 0)
			{
				document.getElementsByClassName("ThumbUpButton ")[0].click();
			}
		}
		else if (rating < 3 && rating > 0)
		{
			//If thumbs down is not active active
			if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length === 0)
			{
				document.getElementsByClassName("ThumbDownButton")[0].click();
			}
		}
		else
		{
			if (document.getElementsByClassName("Tuner__Control__ThumbUp__Button--active").length > 0)
			{
				document.getElementsByClassName("ThumbUpButton ")[0].click();
			}
			else if (document.getElementsByClassName("Tuner__Control__ThumbDown__Button--active").length > 0)
			{
				document.getElementsByClassName("ThumbDownButton")[0].click();
			}
		}
	};
}

setup();
init();