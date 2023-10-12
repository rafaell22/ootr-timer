let deferredPrompt;

// Dismiss the install prompt when the dismiss button is clicked
document.getElementById('dismiss-button').addEventListener('click', () => {
  hideInstallPrompt();
});

// Helper function to hide the install prompt
function hideInstallPrompt() {
  document.getElementById('install-prompt').classList.add('hidden');
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  deferredPrompt = event;

  showInstallPrompt();
});

// Helper function to show the install prompt
function showInstallPrompt() {
  document.getElementById('install-prompt').classList.remove('hidden');
}

// Show the install prompt when the install button is clicked
document.getElementById('install-button').addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('App installed successfully!');
      }
      deferredPrompt = null; // Reset the deferredPrompt variable
      hideInstallPrompt(); // Hide the install prompt
    });
  }
});

window.addEventListener('appinstalled', (event) => {
  // Perform actions when the app is installed
  console.log('App installed successfully!');
});
