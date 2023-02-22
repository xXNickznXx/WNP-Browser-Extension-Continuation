// eslint-disable-next-line no-unused-vars
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.method) {
    // Remove flags
    // TODO: replace 'local' with 'session' when switching to MV3
    chrome.storage.local.remove(['flagAsOutdated', 'flagAsNotConnected', 'flagAsConnected']);

    if (message.method === 'flagAsOutdated') {
      // Set badge
      // TODO: replace 'browserAction' with 'action' when switching to MV3
      chrome.browserAction.setBadgeText({ text: '🔄' });
      // TODO: replace 'browserAction' with 'action' when switching to MV3
      chrome.browserAction.setBadgeBackgroundColor({ color: '#FFFF00' });

      // Set flag
      // TODO: replace 'local' with 'session' when switching to MV3
      chrome.storage.local.set({ flagAsOutdated: true });
    } else if (message.method === 'flagAsNotConnected') {
      // Set badge
      // TODO: replace 'browserAction' with 'action' when switching to MV3
      chrome.browserAction.setBadgeText({ text: '🔌' });
      // TODO: replace 'browserAction' with 'action' when switching to MV3
      chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' });

      // Set flag
      // TODO: replace 'local' with 'session' when switching to MV3
      chrome.storage.local.set({ flagAsNotConnected: true });
    } else if (message.method === 'flagAsConnected') {
      // Set badge
      // TODO: replace 'browserAction' with 'action' when switching to MV3
      chrome.browserAction.setBadgeText({ text: '' });

      // Set flag
      // TODO: replace 'local' with 'session' when switching to MV3
      chrome.storage.local.set({ flagAsConnected: true });
    }
  } else if (message.theme) {
    if (message.theme === 'dark') {
      // TODO: replace 'browserAction' with 'action' when switching to MV3
      chrome.browserAction.setIcon({
        path: {
          16: 'assets/icons/light-icon-16.png',
          48: 'assets/icons/light-icon-48.png',
          128: 'assets/icons/light-icon-128.png'
        }
      });
    } else if (message.theme === 'light') {
      // TODO: replace 'browserAction' with 'action' when switching to MV3
      chrome.browserAction.setIcon({
        path: {
          16: 'assets/icons/icon-16.png',
          48: 'assets/icons/icon-48.png',
          128: 'assets/icons/icon-128.png'
        }
      });
    }
  }
});

// TODO: remove when switching to MV3
chrome.runtime.onSuspend.addListener(() => {
  chrome.storage.local.clear();
});
