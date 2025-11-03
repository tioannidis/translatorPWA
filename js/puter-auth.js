// Puter Authentication Manager for Translator
class PuterAuthManager {
    constructor() {
        this.isLoggedIn = false;
        this.username = '';
    }

    // Initialize auth functionality
    async initialize() {
        // Check Puter login status
        await this.checkPuterLoginStatus();

        // Setup auth button click handler if not already set
        const loginBtn = document.getElementById('puterLoginBtn');
        if (loginBtn && !loginBtn.hasAttribute('data-initialized')) {
            loginBtn.setAttribute('data-initialized', 'true');
            loginBtn.addEventListener('click', () => this.handleAuth());
        }
    }

    // Check if user is logged in to Puter
    async checkPuterLoginStatus() {
        try {
            if (typeof puter === 'undefined') {
                console.warn('Puter SDK not loaded yet');
                return;
            }

            const isSignedIn = await puter.auth.isSignedIn();

            if (isSignedIn) {
                const user = await puter.auth.getUser();
                this.updateLoginUI(true, user.username);
                this.isLoggedIn = true;
                this.username = user.username;
            } else {
                this.updateLoginUI(false);
                this.isLoggedIn = false;
                this.username = '';
            }
        } catch (error) {
            console.error('Error checking Puter login status:', error);
            this.updateLoginUI(false);
            this.isLoggedIn = false;
            this.username = '';
        }
    }

    // Update login UI
    updateLoginUI(isLoggedIn, username = '') {
        const loginBtn = document.getElementById('puterLoginBtn');
        const loginIcon = document.getElementById('puterLoginIcon');
        const loginText = document.getElementById('puterLoginText');
        const loginStatus = document.getElementById('puterLoginStatus');
        const usernameSpan = document.getElementById('puterUsername');

        if (!loginBtn) return;

        if (isLoggedIn) {
            loginBtn.classList.add('logged-in');
            if (loginIcon) loginIcon.textContent = '✅';
            if (loginText) loginText.textContent = 'Abmelden';

            if (loginStatus && usernameSpan) {
                usernameSpan.textContent = username;
                loginStatus.style.display = 'flex';
            }
        } else {
            loginBtn.classList.remove('logged-in');
            if (loginIcon) loginIcon.textContent = '🔐';
            if (loginText) loginText.textContent = 'Puter Login';

            if (loginStatus) {
                loginStatus.style.display = 'none';
            }
        }
    }

    // Handle login/logout
    async handleAuth() {
        try {
            if (this.isLoggedIn) {
                // Logout
                if (confirm('Möchtest du dich wirklich von Puter abmelden?')) {
                    await puter.auth.signOut();
                    this.updateLoginUI(false);
                    this.isLoggedIn = false;
                    this.username = '';
                    console.log('Erfolgreich von Puter abgemeldet');
                }
            } else {
                // Login
                console.log('Puter Login wird geöffnet...');
                await puter.auth.signIn();

                // Check if login was successful
                const isSignedIn = await puter.auth.isSignedIn();
                if (isSignedIn) {
                    const user = await puter.auth.getUser();
                    this.updateLoginUI(true, user.username);
                    this.isLoggedIn = true;
                    this.username = user.username;
                    console.log(`Willkommen, ${user.username}! Du bist jetzt bei Puter angemeldet.`);
                }
            }
        } catch (error) {
            console.error('Puter auth error:', error);
            alert(`Fehler bei der Authentifizierung: ${error.message}`);
        }
    }

    // Get auth status
    getAuthStatus() {
        return {
            isLoggedIn: this.isLoggedIn,
            username: this.username
        };
    }
}

// Global instance
const puterAuth = new PuterAuthManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        puterAuth.initialize();
    });
} else {
    puterAuth.initialize();
}
