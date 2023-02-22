(() => {
  const deleteButton = document.getElementById('delete');
  const form = document.forms.form;
  const formFields = form.elements;
  const musicInfoFields = formFields.musicInfo.elements;
  const musicEventHandlerFields = formFields.musicEventHandler.elements;
  let player = new URLSearchParams(window.location.search).get('player');
  let confirmDelete = false;
  const codeMirrors = [];

  if (player) {
    // TODO: replace callback param with 'then' call on 'get' when switching to MV3
    chrome.storage.sync.get(player, (entries) => {
      console.log(Object.keys(entries)[0], Object.values(entries)[0]);
      if (entries && Object.keys(entries).length > 0) {
        deleteButton.hidden = false;
        musicInfoFields.player.value = player;
        formFields.pattern.value = entries[player].pattern;
        for (const [key, value] of Object.entries(entries[player].musicInfo)) {
          musicInfoFields[key].value = value;
        }
        for (const [key, value] of Object.entries(entries[player].musicEventHandler)) {
          musicEventHandlerFields[key].value = value;
        }
      } else {
        const notExisting = document.getElementById('notExisting');
        const notExistingP = notExisting.querySelector('p');
        notExistingP.textContent = notExistingP.textContent.replace('[NAME]', player);
        notExisting.hidden = false;
        // Set player to null for later logic
        player = null;
      }
    });
  }

  // TODO: find a better way than timeout
  setTimeout(() => {
    const textareas = Array.from(formFields).filter((field) => field.tagName === 'TEXTAREA');
    for (const textarea of textareas) {
      const codeMirror = CodeMirror.fromTextArea(textarea, {
        mode: 'javascript',
        theme: 'default',
        tabSize: 2,
        lineNumbers: true,
        viewportMargin: Infinity,
        extraKeys: {
          Tab: (cm) => {
            if (cm.getSelection().includes('\n')) {
              cm.execCommand('indentMore');
            } else {
              cm.execCommand('insertSoftTab');
            }
          },
          'Shift-Tab': (cm) => cm.execCommand('indentLess'),
          'Ctrl-Space': 'autocomplete'
        }
      });
      codeMirrors.push(codeMirror);
    }
  }, 10);

  deleteButton.onclick = async () => {
    if (confirmDelete) {
      // TODO: replace callback param with 'then' call on 'remove' when switching to MV3
      chrome.storage.sync.remove(player, () => {
        window.close();
        // TODO: display success notification
      });
    } else {
      deleteButton.textContent = 'Click again to confirm delete';
      confirmDelete = true;
    }
  };

  document.getElementById('githubIssue').onclick = () => {
    let url = `### pattern\n${formFields.pattern.value}`;
    for (const codeMirror of codeMirrors) {
      if (codeMirror.getValue()) {
        url += `\n### ${codeMirror.getTextArea().name}`;
        url += '\n```javascript';
        url += `\n${codeMirror.getValue()}`;
        url += '\n```';
      }
    }

    window.open(
      `https://github.com/tjhrulz/WebNowPlaying-BrowserExtension/issues/new?title=${encodeURIComponent(
        `Add site support for ${musicInfoFields.player.value}`
      )}&body=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  document.getElementById('submit').onclick = async () => {
    // write content of codeMirrors back to the textareas
    for (const codeMirror of codeMirrors) {
      codeMirror.save();
    }

    const error = document.getElementById('error');
    // Hide error
    error.textContent = '';
    error.hidden = true;
    // Validate form
    if (await areFieldsValid([musicInfoFields.player, formFields.pattern, musicInfoFields.title], error, player)) {
      chrome.storage.sync.set({
        [musicInfoFields.player.value]: {
          pattern: formFields.pattern.value || null,
          musicInfo: {
            readyCheck: musicInfoFields.readyCheck.value || null,
            state: musicInfoFields.state.value || null,
            title: musicInfoFields.title.value || null,
            artist: musicInfoFields.artist.value || null,
            album: musicInfoFields.album.value || null,
            cover: musicInfoFields.cover.value || null,
            duration: musicInfoFields.duration.value || null,
            durationString: musicInfoFields.durationString.value || null,
            position: musicInfoFields.position.value || null,
            positionString: musicInfoFields.positionString.value || null,
            volume: musicInfoFields.volume.value || null,
            rating: musicInfoFields.rating.value || null,
            repeat: musicInfoFields.repeat.value || null,
            shuffle: musicInfoFields.shuffle.value || null
          },
          musicEventHandler: {
            readyCheck: musicEventHandlerFields.readyCheck.value || null,
            playpause: musicEventHandlerFields.playpause.value || null,
            next: musicEventHandlerFields.next.value || null,
            previous: musicEventHandlerFields.previous.value || null,
            progress: musicEventHandlerFields.progress.value || null,
            progressSeconds: musicEventHandlerFields.progressSeconds.value || null,
            volume: musicEventHandlerFields.volume.value || null,
            repeat: musicEventHandlerFields.repeat.value || null,
            shuffle: musicEventHandlerFields.shuffle.value || null,
            toggleThumbsUp: musicEventHandlerFields.toggleThumbsUp.value || null,
            toggleThumbsDown: musicEventHandlerFields.toggleThumbsDown.value || null,
            rating: musicEventHandlerFields.rating.value || null
          }
        }
      });
      if (player && player !== musicInfoFields.player.value) {
        chrome.storage.sync.remove(player);
        window.location.href = `?player=${musicInfoFields.player.value}`;
      } else {
        window.location.href = `?player=${musicInfoFields.player.value}`;
      }
      // TODO: display success notification
    }
  };

  /**
   * Needs to be async because it waits for chrome.storage
   * @param {Element[]} fields
   * @param {Element} error
   * @param {string} edit
   */
  async function areFieldsValid(fields, error, edit) {
    let valid = true;
    for await (const field of fields) {
      if (!field.value) {
        valid = false;
        error.textContent += `${field.name} needs to be filled. `;
        error.hidden = false;
      } else if (!edit && field.name === 'player') {
        // TODO: replace callback param with 'then' call on 'get' and remove promise when switching to MV3
        await new Promise((resolve) => {
          chrome.storage.sync.get(field.value, (value) => {
            if (value && Object.keys(value).length > 0) {
              valid = false;
              error.textContent += `player with the name '${field.value}' already exists. `;
              error.hidden = false;
            }
            resolve();
          });
        });
      }
    }
    return valid;
  }
})();
