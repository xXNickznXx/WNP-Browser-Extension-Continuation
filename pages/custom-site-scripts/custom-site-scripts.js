// Initialize view by getting values from chrome.storage
document.addEventListener('DOMContentLoaded', () => {
  // TODO: replace callback param with 'then' call on get when switching to MV3
  chrome.storage.sync.get(null, (entries) => {
    const sites = Object.entries(entries).filter(([key, _]) => !['useGeneric', 'useGenericList', 'listType', 'genericList'].includes(key));
    const sitesEl = document.getElementById('sites');
    if (sites.length) {
      for (const [key, _] of sites) {
        const siteEl = document.createElement('a');
        const text = document.createTextNode(key);
        siteEl.append(text);
        const span = document.createElement('span');
        span.textContent = '\u27A1';
        siteEl.append(span);
        siteEl.href = `../editor/editor.html?player=${key}`;
        siteEl.target = '_blank';
        sitesEl.append(siteEl);
      }
    } else {
      const p = document.createElement('p');
      p.textContent = 'Currently no custom Site Script exists';
      sitesEl.append(p);
    }
  });
});
