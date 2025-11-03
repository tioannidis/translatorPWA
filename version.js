// Version info for Puter Translator
const version = '1.2.2';

// Display version in the footer
document.addEventListener('DOMContentLoaded', () => {
    // Update version info in footer
    const versionElement = document.querySelector('.version-info');
    if (versionElement) {
        versionElement.textContent = `v${version}`;
    }

    // Update version in PWA settings tab
    const appVersionPwa = document.getElementById('app-version-pwa');
    if (appVersionPwa) {
        appVersionPwa.textContent = version;
    }
});
