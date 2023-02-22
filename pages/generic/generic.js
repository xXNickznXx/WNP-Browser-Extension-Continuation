// Initialize view by getting values from chrome.storage
document.addEventListener('DOMContentLoaded', () => {
  // TODO: replace callback param with 'then' call on 'get' when switching to MV3
  chrome.storage.sync.get(['useGeneric', 'useGenericList', 'listType', 'genericList'], (entries) => {
    // Check if theres something stored
    if (Object.keys(entries).length) {
      document.getElementById('useGeneric').checked = entries.useGeneric;
      document.getElementById('useGenericList').checked = entries.useGenericList;
      document.getElementById('listType').value = entries.listType;
      document.getElementById('genericList').value = entries.genericList.join('\n');
    } else {
      document.getElementById('useGeneric').checked = false;
      document.getElementById('useGenericList').checked = false;
      document.getElementById('listType').value = 'whitelist';
      document.getElementById('genericList').value = '';
    }
  });
});

// Save options in chrome.storage
document.onvisibilitychange = () => {
  if (document.visibilityState === 'hidden') {
    chrome.storage.sync.set({
      useGeneric: document.getElementById('useGeneric').checked,
      useGenericList: document.getElementById('useGenericList').checked,
      listType: document.getElementById('listType').value,
      genericList: document.getElementById('genericList').value.split('\n')
    });
  }
};
