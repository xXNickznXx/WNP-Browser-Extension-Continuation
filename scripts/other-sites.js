/* globals setupCustomSite, setupGenericSite, setupElementEvents, updateCurrentElement */

// TODO: replace callback param with 'then' call on 'get' when switching to MV3
chrome.storage.sync.get(null, (entries) => {
  const sites = Object.entries(entries).filter(([key, _]) => !['useGeneric', 'useGenericList', 'listType', 'genericList'].includes(key));
  const site = sites.find(([_, value]) => window.location.hostname.includes(value.pattern));
  if (site) {
    console.log(site[0], site[1]);
    setupCustomSite(site);
    init();
  } else if (entries.useGeneric) {
    // Setup events on all elements to get when updated (Also called in readyCheck)
    setupElementEvents();

    // This will update which element is selected to display
    setInterval(() => {
      updateCurrentElement();
    }, 1000);

    // Standard setup but check settings first
    if (entries.useGenericList) {
      const isInList = entries.genericList.some((element) => window.location.hostname.includes(element));
      if ((isInList && entries.listType === 'whitelist') || (!isInList && entries.listType === 'blacklist')) {
        setupGenericSite();
        init();
      }
    } else {
      setupGenericSite();
      init();
    }
  }
});
