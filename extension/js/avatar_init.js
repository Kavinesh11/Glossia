let avatarInitialized = false;
let retryCount = 0;
const maxRetries = 5;
let lookup = {};
let messageListener = null;

function initializeAvatarSystem() {
  const loadingStatus = document.getElementById('loading-status');
  const avatarContainer = document.getElementById('avatar-container');

    console.log('Initializing avatar system...');
    
      
      CWASA.init(function(success) {
        if (success) {
          console.log('CWASA initialized successfully');
          window.TUavatarLoaded = true;   
          // Hide loading and show avatar
          if (loadingStatus) loadingStatus.style.display = 'none';
          if (avatarContainer) avatarContainer.style.display = 'block';
          
          // Force canvas redraw
          const canvas = document.querySelector('.canvasAv.av0');
          if (canvas) {
            canvas.style.visibility = 'visible';
            canvas.width = canvas.width; // Force redraw
          }
          
          setupEventHandlers();
          avatarInitialized = true;
          
          // Notify parent window that avatar is ready
          window.parent.postMessage({ type: 'AVATAR_READY' }, '*');
        } else {
          console.error('CWASA initialization failed');
          loadingStatus.textContent = 'Avatar initialization failed. Retrying...';
          retryInitialization();
        }
      });
}

function checkUIElements() {
  const hasUI = $(".txtaSiGMLText").length > 0 && $(".bttnPlaySiGMLText").length > 0;
  if (!hasUI) console.warn('CWASA UI elements not found');
  return hasUI;
}

function retryInitialization() {
  const loadingStatus = document.getElementById('loading-status');
  
  if (retryCount < maxRetries) {
    retryCount++;
    console.log(`Retrying initialization (attempt ${retryCount})...`);
    if (loadingStatus) {
      loadingStatus.textContent = `Loading avatar system... (Attempt ${retryCount})`;
    }
    setTimeout(initializeAvatarSystem, 1000 * retryCount);
  } else {
    console.error('Failed to initialize avatar after maximum retries');
    if (loadingStatus) {
      loadingStatus.textContent = 'Failed to load avatar system. Please refresh the page.';
    }
  }
}

function setupEventHandlers() {
  // Remove previous listener if exists
  if (messageListener) {
    window.removeEventListener('message', messageListener);
  }

  fetch(chrome.runtime.getURL("SignFiles/sigmlData.json"))
    .then(response => response.json())
    .then(data => {
      lookup = {};
      data.forEach(item => {
        lookup[item.w.toLowerCase()] = item.s;
      });
      
      messageListener = function(event) {
        if (event.data.type === 'PLAY_TEXT' && avatarInitialized) {
          playText(event.data.text);
        }
      };
      window.addEventListener('message', messageListener);
    })
    .catch(error => {
      console.error('Error loading sigmlData:', error);
    });
}

function playText(text) {
  if (!text || !avatarInitialized) return;
  
  console.log('Playing text:', text);
  
  const words = text.split(/\s+/);
  playNext(0);

  function playNext(i) {
    if (i >= words.length) return;
    const word = words[i].toLowerCase();

    if (lookup[word]) {
      const $textArea = $(".txtaSiGMLText");
      const $playButton = $(".bttnPlaySiGMLText");
      
      if ($textArea.length && $playButton.length) {
        $textArea.val(lookup[word]);
        $playButton.click();
        setTimeout(() => playNext(i + 1), 2000);
      } else {
        console.error('CWASA UI elements missing during playback');
      }
    } else {
      spellWord(word, () => playNext(i + 1));
    }
  }

  function spellWord(word, callback) {
    let charIndex = 0;
    const chars = word.split('');

    function nextChar() {
      if (charIndex >= chars.length) return callback();
      const char = chars[charIndex];
      
      if (lookup[char]) {
        const $textArea = $(".txtaSiGMLText");
        const $playButton = $(".bttnPlaySiGMLText");
        
        if ($textArea.length && $playButton.length) {
          $textArea.val(lookup[char]);
          $playButton.click();
        }
      }
      
      charIndex++;
      setTimeout(nextChar, 1000);
    }
    
    nextChar();
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeAvatarSystem, 500);
});