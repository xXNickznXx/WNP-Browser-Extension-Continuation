if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  chrome.runtime.sendMessage({ theme: 'dark' });
} else {
  chrome.runtime.sendMessage({ theme: 'light' });
}

window.matchMedia('(prefers-color-scheme: dark)').onchange = (event) => {
  if (event.matches) {
    chrome.runtime.sendMessage({ theme: 'dark' });
  } else {
    chrome.runtime.sendMessage({ theme: 'light' });
  }
};
