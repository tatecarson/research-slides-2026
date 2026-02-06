let broadcastChannel;
let isBroadcastEnabled = false;

function initBroadcastChannel() {
  try {
    broadcastChannel = new BroadcastChannel('presentation-sync');
    console.log('Broadcast channel initialized');

    // Listen for slide changes
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    // Handle incoming messages
    broadcastChannel.onmessage = (event) => {
      const data = event.data;
      console.log('Received message:', data);

      if (data.type === 'slideChange') {
        // Go to the specified slide number
        window.location.hash = data.slideNumber;
      }
    };
  } catch (error) {
    console.error('Error initializing broadcast channel:', error);
  }
}

function handleKeyDown(event) {
  if (!isBroadcastEnabled) return;
  
  // Handle slide navigation
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    const slideNumber = window.location.hash.slice(1) || '0';
    broadcastChannel.postMessage({
      type: 'slideChange',
      slideNumber: slideNumber
    });
  }
}

function handleClick(event) {
  if (!isBroadcastEnabled || event.target.id === 'broadcast-toggle') return;
  
  // Send slide number on click
  const slideNumber = window.location.hash.slice(1) || '0';
  broadcastChannel.postMessage({
    type: 'slideChange',
    slideNumber: slideNumber
  });
}

function toggleBroadcast(event) {
  event.stopPropagation();
  isBroadcastEnabled = !isBroadcastEnabled;
  
  const button = event.target;
  if (isBroadcastEnabled) {
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.textContent = 'Broadcasting ✓';
    
    // Send initial slide number
    const slideNumber = window.location.hash.slice(1) || '0';
    broadcastChannel.postMessage({
      type: 'slideChange',
      slideNumber: slideNumber
    });
  } else {
    button.style.backgroundColor = '';
    button.style.color = '';
    button.textContent = 'Start Broadcasting';
  }
  
  console.log('Broadcast is now ' + (isBroadcastEnabled ? 'enabled' : 'disabled'));
}

window.addEventListener('load', () => {
  initBroadcastChannel();
  
  const toggleButton = document.createElement('button');
  toggleButton.id = 'broadcast-toggle';
  toggleButton.textContent = 'Start Broadcasting';
  toggleButton.style.position = 'fixed';
  toggleButton.style.top = '10px';
  toggleButton.style.left = '10px';
  toggleButton.style.zIndex = '1000';
  toggleButton.style.padding = '8px 16px';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '4px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.fontFamily = 'Arial, sans-serif';
  toggleButton.style.fontSize = '14px';
  toggleButton.style.transition = 'all 0.3s ease';
  
  toggleButton.addEventListener('click', toggleBroadcast);
  document.body.appendChild(toggleButton);
  
  // Also listen for hash changes to sync slides
  window.addEventListener('hashchange', () => {
    if (isBroadcastEnabled) {
      const slideNumber = window.location.hash.slice(1) || '0';
      broadcastChannel.postMessage({
        type: 'slideChange',
        slideNumber: slideNumber
      });
    }
  });
});
