// Initialize view by getting values from chrome.storage
document.addEventListener('DOMContentLoaded', () => {
  // TODO: replace 'local' with 'session' when switching to MV3
  // TODO: replace callback param with 'then' call on 'get' when switching to MV3
  chrome.storage.local.get(['flagAsOutdated', 'flagAsNotConnected', 'flagAsConnected'], (entries) => {
    for (const [key, value] of Object.entries(entries)) {
      document.getElementById(key).hidden = !value;
    }
  });
});
