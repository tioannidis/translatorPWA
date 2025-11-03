        // Global variables
        let favorites = [];
        let settings = {
            theme: 'light',
            autoTranslate: true,
            selectedModel: 'gpt-4o-mini',
            currentMode: 'translator'
        };
        let isLoading = false;
        let isDarkMode = false;
        let translationTimeout = null;
        let autoTranslateEnabled = true;
        let isWriterLoading = false;

        // Language names mapping
        const languageNames = {
            'auto': 'Auto-Detect',
            'de': 'Deutsch',
            'en': 'English',
            'es': 'Español',
            'fr': 'Français',
            'it': 'Italiano',
            'pt': 'Português',
            'uk': 'Українська',
            'ja': '日本語',
            'ko': '한국어',
            'zh': '中文',
            'ar': 'العربية',
            'hi': 'हिन्दी',
            'tr': 'Türkçe',
            'pl': 'Polski',
            'nl': 'Nederlands',
            'sv': 'Svenska',
            'da': 'Dansk',
            'no': 'Norsk',
            'fi': 'Suomi',
            'cs': 'Čeština',
            'sk': 'Slovenčina',
            'hu': 'Magyar',
            'ro': 'Română',
            'bg': 'Български',
            'hr': 'Hrvatski',
            'sl': 'Slovenščina',
            'et': 'Eesti',
            'lv': 'Latviešu',
            'lt': 'Lietuvių',
            'el': 'Ελληνικά',
            'he': 'עברית',
            'fa': 'فارسی',
            'ur': 'اردو',
            'bn': 'বাংলা',
            'ta': 'தமிழ்',
            'te': 'తెలుగు',
            'ml': 'മലയാളം',
            'th': 'ไทย',
            'vi': 'Tiếng Việt',
            'id': 'Bahasa Indonesia',
            'ms': 'Bahasa Melayu',
            'tl': 'Filipino',
            'sw': 'Kiswahili',
            'af': 'Afrikaans'
        };

        // DOM elements
        const inputText = document.getElementById('inputText');
        const outputText = document.getElementById('outputText');
        const sourceLanguage = document.getElementById('sourceLanguage');
        const targetLanguage = document.getElementById('targetLanguage');
        const translateBtn = document.getElementById('translateBtn');
        const copyTranslation = document.getElementById('copyTranslation');
        const clearInput = document.getElementById('clearInput');
        const pasteInput = document.getElementById('pasteInput');
        const swapLanguages = document.getElementById('swapLanguages');
        const themeToggle = document.getElementById('themeToggle');
        const charCount = document.getElementById('charCount');
        const outputCharCount = document.getElementById('outputCharCount');
        const favoritesList = document.getElementById('favoritesList');
        const favoritesSearch = document.getElementById('favoritesSearch');
        const clearFavorites = document.getElementById('clearFavorites');
        const favoriteBtn = document.getElementById('favoriteBtn');
        const autoTranslateToggle = document.getElementById('autoTranslateToggle');
        const modelSelector = document.getElementById('modelSelector');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const inputPanelTitle = document.getElementById('inputPanelTitle');
        const outputPanelTitle = document.getElementById('outputPanelTitle');
        
        // Popup elements
        const showFavoritesBtn = document.getElementById('showFavoritesBtn');
        const favoritesPopup = document.getElementById('favoritesPopup');
        const favoritesOverlay = document.getElementById('favoritesOverlay');
        const closeFavoritesBtn = document.getElementById('closeFavoritesBtn');

        // Text Editor Popup elements
        const expandInputBtn = document.getElementById('expandInputBtn');
        const expandWriterInputBtn = document.getElementById('expandWriterInputBtn');
        const textEditorPopup = document.getElementById('textEditorPopup');
        const textEditorOverlay = document.getElementById('textEditorOverlay');
        const closeTextEditorBtn = document.getElementById('closeTextEditorBtn');
        const textEditorTitle = document.getElementById('textEditorTitle');
        const textEditorTextarea = document.getElementById('textEditorTextarea');
        const textEditorCharCount = document.getElementById('textEditorCharCount');
        const textEditorHeaderCharCount = document.getElementById('textEditorHeaderCharCount');
        const textEditorClear = document.getElementById('textEditorClear');
        const textEditorPaste = document.getElementById('textEditorPaste');
        const textEditorSave = document.getElementById('textEditorSave');

        // Text Viewer Popup elements
        const expandOutputBtn = document.getElementById('expandOutputBtn');
        const expandWriterOutputBtn = document.getElementById('expandWriterOutputBtn');
        const textViewerPopup = document.getElementById('textViewerPopup');
        const textViewerOverlay = document.getElementById('textViewerOverlay');
        const closeTextViewerBtn = document.getElementById('closeTextViewerBtn');
        const textViewerTitle = document.getElementById('textViewerTitle');
        const textViewerTextarea = document.getElementById('textViewerTextarea');
        const textViewerCharCount = document.getElementById('textViewerCharCount');
        const textViewerHeaderCharCount = document.getElementById('textViewerHeaderCharCount');
        const textViewerCopy = document.getElementById('textViewerCopy');
        
        // Control elements
        const translatorControls = document.getElementById('translatorControls');
        const writerControls = document.getElementById('writerControls');
        const translatorTab2 = document.getElementById('translatorTab2');
        const writerTab2 = document.getElementById('writerTab2');
        const modelSelector2 = document.getElementById('modelSelector2');
        
        // Mode and Writer elements
        const translatorTab = document.getElementById('translatorTab');
        const writerTab = document.getElementById('writerTab');
        const translatorMode = document.getElementById('translatorMode');
        const writerMode = document.getElementById('writerMode');
        const writerInputText = document.getElementById('writerInputText');
        const writerOutputText = document.getElementById('writerOutputText');
        const writerCharCount = document.getElementById('writerCharCount');
        const writerOutputCharCount = document.getElementById('writerOutputCharCount');
        const writerLanguageSelect = document.getElementById('writerLanguageSelectHeader');
        const correctBtn = document.getElementById('correctBtn');
        const paraphraseBtn = document.getElementById('paraphraseBtn');
        const copyWriterOutput = document.getElementById('copyWriterOutput');
        const clearWriterInput = document.getElementById('clearWriterInput');
        const pasteWriterInput = document.getElementById('pasteWriterInput');
        const writerLoadingIndicator = document.getElementById('writerLoadingIndicator');

        // Initialize app
        async function initApp() {
            // Register Service Worker for PWA functionality
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('Service Worker registered:', registration);

                    // Listen for Service Worker updates
                    navigator.serviceWorker.addEventListener('message', (event) => {
                        if (event.data && event.data.type === 'SW_UPDATED') {
                            console.log('Service Worker updated:', event.data.cacheName);
                        }
                    });
                } catch (error) {
                    console.log('Service Worker registration failed:', error);
                }
            }

            // Initialize Puter SDK
            try {
                // Check if user is authenticated with Puter
                const isAuthenticated = await checkPuterAuth();

                if (!isAuthenticated) {
                    // Show login prompt
                    await promptPuterLogin();
                }

                await loadSettings();
                await loadFavorites();
                renderFavorites();
                setupEventListeners();
                updateUI();
            } catch (error) {
                console.error('App initialization failed:', error);
                // Continue with local-only mode if Puter auth fails
                await loadSettings();
                await loadFavorites();
                renderFavorites();
                setupEventListeners();
                updateUI();
            }
        }

        // Check if user is authenticated with Puter
        async function checkPuterAuth() {
            try {
                // Try to read a test file to check authentication
                const isAuth = puter.auth && puter.auth.isSignedIn && await puter.auth.isSignedIn();
                return isAuth;
            } catch (error) {
                return false;
            }
        }

        // Prompt user to login to Puter
        async function promptPuterLogin() {
            try {
                // Show a user-friendly login message
                const shouldLogin = confirm(
                    'Diese App verwendet Puter.com für Cloud-Speicherung.\n\n' +
                    'Möchtest du dich jetzt anmelden?\n\n' +
                    '(Du kannst die App auch ohne Anmeldung verwenden, aber deine Daten werden nur lokal gespeichert.)'
                );

                if (shouldLogin && puter.auth && puter.auth.signIn) {
                    await puter.auth.signIn();
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Puter login failed:', error);
                return false;
            }
        }

        // Settings management with localStorage fallback
        async function loadSettings() {
            try {
                // Try to load from Puter first
                const data = await puter.fs.read('translator-settings.json');
                const text = await data.text();
                settings = { ...settings, ...JSON.parse(text) }; // Merge with defaults
            } catch (error) {
                // Fallback to localStorage
                try {
                    const localData = localStorage.getItem('translator-settings');
                    if (localData) {
                        settings = { ...settings, ...JSON.parse(localData) };
                    } else {
                        console.log('No existing settings found, using defaults');
                        await saveSettings();
                    }
                } catch (localError) {
                    console.log('Error loading from localStorage:', localError);
                    await saveSettings();
                }
            }
            
            // Apply loaded settings
            isDarkMode = settings.theme === 'dark';
            autoTranslateEnabled = settings.autoTranslate;
            applyTheme();
            updateAutoTranslateButton();
            
            // Set model selector if available
            if (modelSelector) {
                const modelExists = Array.from(modelSelector.options).some(option => option.value === settings.selectedModel);
                if (modelExists) {
                    modelSelector.value = settings.selectedModel;
                    if (modelSelector2) modelSelector2.value = settings.selectedModel;
                } else {
                    settings.selectedModel = 'gpt-4o-mini';
                    modelSelector.value = 'gpt-4o-mini';
                    if (modelSelector2) modelSelector2.value = 'gpt-4o-mini';
                }
            }
            
            // Set mode
            if (settings.currentMode) {
                switchMode(settings.currentMode);
            }
        }

        async function saveSettings() {
            try {
                const data = JSON.stringify(settings, null, 2);
                // Try Puter first
                try {
                    await puter.fs.write('translator-settings.json', data);
                } catch (puterError) {
                    // Fallback to localStorage
                    localStorage.setItem('translator-settings', data);
                }
            } catch (error) {
                console.error('Error saving settings:', error);
                showError('Fehler beim Speichern der Einstellungen: ' + error.message);
            }
        }

        // Theme management
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            settings.theme = isDarkMode ? 'dark' : 'light';
            applyTheme();
            saveSettings();
        }

        function applyTheme() {
            document.body.classList.toggle('dark-mode', isDarkMode);
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
            themeToggle.title = isDarkMode ? 'Hell-Modus' : 'Dunkel-Modus';
        }

        // Auto-translate management
        function toggleAutoTranslate() {
            autoTranslateEnabled = !autoTranslateEnabled;
            settings.autoTranslate = autoTranslateEnabled;
            updateAutoTranslateButton();
            saveSettings();
            
            // Clear any pending auto-translation
            clearTimeout(translationTimeout);
        }

        function updateAutoTranslateButton() {
            if (autoTranslateToggle) {
                autoTranslateToggle.textContent = autoTranslateEnabled ? '🔄 Auto: Ein' : '⏸️ Auto: Aus';
                autoTranslateToggle.title = autoTranslateEnabled ? 'Auto-Übersetzung deaktivieren' : 'Auto-Übersetzung aktivieren';
            }
        }

        // Model selection management
        function saveSelectedModel() {
            if (modelSelector) {
                settings.selectedModel = modelSelector.value;
                // Sync both model selectors
                if (modelSelector2) {
                    modelSelector2.value = modelSelector.value;
                }
                saveSettings();
            }
        }

        function saveSelectedModel2() {
            if (modelSelector2) {
                settings.selectedModel = modelSelector2.value;
                // Sync both model selectors
                if (modelSelector) {
                    modelSelector.value = modelSelector2.value;
                }
                saveSettings();
            }
        }

        // Mode switching
        function switchMode(mode) {
            settings.currentMode = mode;
            
            // Update tab states - both sets
            translatorTab.classList.remove('active');
            writerTab.classList.remove('active');
            if (translatorTab2) translatorTab2.classList.remove('active');
            if (writerTab2) writerTab2.classList.remove('active');
            
            if (mode === 'writer') {
                writerTab.classList.add('active');
                if (writerTab2) writerTab2.classList.add('active');
                translatorMode.style.display = 'none';
                writerMode.style.display = 'grid';
                // Switch controls
                translatorControls.style.display = 'none';
                writerControls.style.display = 'flex';
            } else {
                translatorTab.classList.add('active');
                if (translatorTab2) translatorTab2.classList.add('active');
                translatorMode.style.display = 'grid';
                writerMode.style.display = 'none';
                // Switch controls
                translatorControls.style.display = 'flex';
                writerControls.style.display = 'none';
            }
            
            saveSettings();
        }

        // Popup functions
        function showFavoritesPopup() {
            favoritesPopup.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function hideFavoritesPopup() {
            favoritesPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Text Editor Popup functions
        let currentEditMode = 'translator'; // 'translator' or 'writer'

        function showTextEditor(mode) {
            currentEditMode = mode;
            
            // Set title and get current text
            let currentText = '';
            if (mode === 'translator') {
                textEditorTitle.textContent = '📝 Text Editor - Eingabe';
                currentText = inputText.value;
            } else if (mode === 'writer') {
                textEditorTitle.textContent = '📝 Text Editor - Writer Eingabe';
                currentText = writerInputText.value;
            }
            
            // Set current text in editor
            textEditorTextarea.value = currentText;
            updateTextEditorCharCount();
            
            // Show popup
            textEditorPopup.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus textarea after a short delay to ensure it's visible
            setTimeout(() => {
                textEditorTextarea.focus();
                // Set cursor to end of text
                textEditorTextarea.setSelectionRange(currentText.length, currentText.length);
            }, 100);
        }

        function hideTextEditor() {
            textEditorPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        function saveTextEditorContent() {
            const content = textEditorTextarea.value;
            
            // Save to appropriate field
            if (currentEditMode === 'translator') {
                inputText.value = content;
                updateUI();
                
                // Trigger auto-translate if enabled
                if (autoTranslateEnabled && content.trim()) {
                    clearTimeout(translationTimeout);
                    translationTimeout = setTimeout(() => {
                        translateText();
                    }, 500);
                }
            } else if (currentEditMode === 'writer') {
                writerInputText.value = content;
                updateWriterCharCount();
            }
            
            hideTextEditor();
        }

        function clearTextEditor() {
            textEditorTextarea.value = '';
            updateTextEditorCharCount();
            textEditorTextarea.focus();
        }

        async function pasteToTextEditor() {
            textEditorTextarea.focus();
            
            try {
                if (navigator.clipboard && navigator.clipboard.readText) {
                    const text = await navigator.clipboard.readText();
                    textEditorTextarea.value = text;
                    updateTextEditorCharCount();
                    
                    // Visual feedback
                    const originalText = textEditorPaste.textContent;
                    textEditorPaste.textContent = '✅ Eingefügt!';
                    
                    setTimeout(() => {
                        textEditorPaste.textContent = originalText;
                    }, 2000);
                } else {
                    document.execCommand('paste');
                    updateTextEditorCharCount();
                    
                    const originalText = textEditorPaste.textContent;
                    textEditorPaste.textContent = '📋 Strg+V verwenden';
                    
                    setTimeout(() => {
                        textEditorPaste.textContent = originalText;
                    }, 2000);
                }
            } catch (error) {
                console.error('Paste failed:', error);
                const originalText = textEditorPaste.textContent;
                textEditorPaste.textContent = '⌨️ Strg+V drücken';
                
                setTimeout(() => {
                    textEditorPaste.textContent = originalText;
                }, 3000);
                
                textEditorTextarea.focus();
            }
        }

        function updateTextEditorCharCount() {
            const count = textEditorTextarea.value.length;
            textEditorCharCount.textContent = `${count} Zeichen`;
            textEditorHeaderCharCount.textContent = `${count} Zeichen`;
            
            // Update button states
            textEditorClear.disabled = !textEditorTextarea.value.trim();
        }

        // Text Viewer Popup functions
        let currentViewMode = 'translator'; // 'translator' or 'writer'

        function showTextViewer(mode) {
            currentViewMode = mode;
            
            // Set title and get current text
            let currentText = '';
            if (mode === 'translator') {
                textViewerTitle.textContent = '👁️ Text Viewer - Übersetzung';
                currentText = outputText.value;
            } else if (mode === 'writer') {
                textViewerTitle.textContent = '👁️ Text Viewer - Korrigierter Text';
                currentText = writerOutputText.value;
            }
            
            // Set current text in viewer
            textViewerTextarea.value = currentText;
            updateTextViewerCharCount();
            
            // Show popup
            textViewerPopup.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus textarea for text selection
            setTimeout(() => {
                textViewerTextarea.focus();
                textViewerTextarea.select();
            }, 100);
        }

        function hideTextViewer() {
            textViewerPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        async function copyFromTextViewer() {
            if (!textViewerTextarea.value) return;

            try {
                await navigator.clipboard.writeText(textViewerTextarea.value);
                
                // Visual feedback
                const originalText = textViewerCopy.textContent;
                textViewerCopy.textContent = '✅ Kopiert!';
                
                setTimeout(() => {
                    textViewerCopy.textContent = originalText;
                }, 2000);
            } catch (error) {
                console.error('Copy failed:', error);
                showError('Kopieren fehlgeschlagen');
            }
        }

        function updateTextViewerCharCount() {
            const count = textViewerTextarea.value.length;
            textViewerCharCount.textContent = `${count} Zeichen`;
            textViewerHeaderCharCount.textContent = `${count} Zeichen`;
        }

        // Favorites management
        async function loadFavorites() {
            try {
                // Try to load from Puter first
                const data = await puter.fs.read('translation-favorites.json');
                const text = await data.text();
                favorites = JSON.parse(text);
            } catch (error) {
                // Fallback to localStorage
                try {
                    const localData = localStorage.getItem('translation-favorites');
                    if (localData) {
                        favorites = JSON.parse(localData);
                    } else {
                        console.log('No existing favorites found, starting fresh');
                        favorites = [];
                    }
                } catch (localError) {
                    console.log('Error loading from localStorage:', localError);
                    favorites = [];
                }
            }
        }

        async function saveFavorites() {
            try {
                const data = JSON.stringify(favorites, null, 2);
                // Try Puter first
                try {
                    await puter.fs.write('translation-favorites.json', data);
                } catch (puterError) {
                    // Fallback to localStorage
                    localStorage.setItem('translation-favorites', data);
                }
            } catch (error) {
                console.error('Error saving favorites:', error);
                showError('Fehler beim Speichern der Favoriten: ' + error.message);
            }
        }

        // Main translation function
        async function translateText() {
            const text = inputText.value.trim();
            if (!text || isLoading) return;

            const sourceLang = sourceLanguage.value;
            const targetLang = targetLanguage.value;

            if (targetLang === 'auto') {
                showError('Zielsprache kann nicht "Auto-Detect" sein');
                return;
            }

            setLoading(true);
            
            try {
                // Create translation prompt
                let prompt;
                if (sourceLang === 'auto') {
                    prompt = `Translate the following text to ${languageNames[targetLang]}. Only return the translation, no explanations:\n\n${text}`;
                } else {
                    prompt = `Translate the following text from ${languageNames[sourceLang]} to ${languageNames[targetLang]}. Only return the translation, no explanations:\n\n${text}`;
                }

                // Get selected model
                const selectedModel = modelSelector.value;
                
                // Use puter.ai.chat for translation
                const response = await puter.ai.chat(prompt, {
                    model: selectedModel,
                    stream: true
                });

                // Handle the response safely
                let translatedText = '';
                
                try {
                    // Handle streaming response (like in your example)
                    for await (const part of response) {
                        if (part?.text) {
                            translatedText += part.text;
                        }
                    }
                } catch (error) {
                    console.error('Response parsing error:', error);
                    translatedText = 'Übersetzung fehlgeschlagen';
                }

                // Display translation
                outputText.value = translatedText;
                updateCharCount();

            } catch (error) {
                console.error('Translation error:', error);
                showError('Übersetzung fehlgeschlagen: ' + error.message);
            } finally {
                setLoading(false);
            }
        }

        // Writer functions
        async function correctText() {
            const text = writerInputText.value.trim();
            if (!text || isWriterLoading) return;

            const language = writerLanguageSelect.value;
            const languageName = languageNames[language];

            setWriterLoading(true);
            
            try {
                const prompt = `Korrigiere den folgenden ${languageName}-Text grammatikalisch und stilistisch. Behalte den ursprünglichen Sinn und Ton bei. Gib nur den korrigierten Text zurück, keine Erklärungen:\n\n${text}`;
                
                const selectedModel = modelSelector.value;
                
                const response = await puter.ai.chat(prompt, {
                    model: selectedModel,
                    stream: true
                });

                // Handle the response safely
                let correctedText = '';
                
                try {
                    // Handle streaming response (like in your example)
                    for await (const part of response) {
                        if (part?.text) {
                            correctedText += part.text;
                        }
                    }
                } catch (error) {
                    console.error('Response parsing error:', error);
                    correctedText = 'Korrektur fehlgeschlagen';
                }

                writerOutputText.value = correctedText;
                updateWriterCharCount();

            } catch (error) {
                console.error('Correction error:', error);
                showError('Korrektur fehlgeschlagen: ' + error.message);
            } finally {
                setWriterLoading(false);
            }
        }

        async function paraphraseText() {
            const text = writerInputText.value.trim();
            if (!text || isWriterLoading) return;

            const language = writerLanguageSelect.value;
            const languageName = languageNames[language];

            setWriterLoading(true);
            
            try {
                const prompt = `Formuliere den folgenden ${languageName}-Text um, ohne die ursprüngliche Bedeutung zu verändern. Verwende andere Wörter und Satzstrukturen. Gib nur den umformulierten Text zurück, keine Erklärungen:\n\n${text}`;
                
                const selectedModel = modelSelector.value;
                
                const response = await puter.ai.chat(prompt, {
                    model: selectedModel,
                    stream: true
                });

                // Handle the response safely
                let paraphrasedText = '';
                
                try {
                    // Handle streaming response (like in your example)
                    for await (const part of response) {
                        if (part?.text) {
                            paraphrasedText += part.text;
                        }
                    }
                } catch (error) {
                    console.error('Response parsing error:', error);
                    paraphrasedText = 'Umformulierung fehlgeschlagen';
                }

                writerOutputText.value = paraphrasedText;
                updateWriterCharCount();

            } catch (error) {
                console.error('Paraphrase error:', error);
                showError('Umformulierung fehlgeschlagen: ' + error.message);
            } finally {
                setWriterLoading(false);
            }
        }

        function setWriterLoading(loading) {
            isWriterLoading = loading;
            writerLoadingIndicator.style.display = loading ? 'flex' : 'none';
            writerOutputText.style.display = loading ? 'none' : 'block';
            correctBtn.disabled = loading || !writerInputText.value.trim();
            correctBtn.textContent = loading ? '🔄 Korrigiert...' : '✏️ Korrigieren';
            paraphraseBtn.disabled = loading || !writerInputText.value.trim();
        }

        function updateWriterCharCount() {
            const inputCount = writerInputText.value.length;
            const outputCount = writerOutputText.value.length;
            
            writerCharCount.textContent = `${inputCount} Zeichen`;
            writerOutputCharCount.textContent = `${outputCount} Zeichen`;
            
            correctBtn.disabled = isWriterLoading || !writerInputText.value.trim();
            paraphraseBtn.disabled = isWriterLoading || !writerInputText.value.trim();
            copyWriterOutput.disabled = !writerOutputText.value.trim();
            clearWriterInput.disabled = !writerInputText.value.trim();
            expandWriterOutputBtn.disabled = !writerOutputText.value.trim();
        }

        function clearWriterInputText() {
            writerInputText.value = '';
            writerOutputText.value = '';
            updateWriterCharCount();
            writerInputText.focus();
        }

        async function pasteToWriterInput() {
            // Focus textarea first to ensure proper context
            writerInputText.focus();
            
            try {
                // Try modern clipboard API first
                if (navigator.clipboard && navigator.clipboard.readText) {
                    const text = await navigator.clipboard.readText();
                    writerInputText.value = text;
                    updateWriterCharCount();
                    
                    // Visual feedback
                    const originalText = pasteWriterInput.textContent;
                    pasteWriterInput.textContent = '✅ Eingefügt!';
                    
                    setTimeout(() => {
                        pasteWriterInput.textContent = originalText;
                    }, 2000);
                } else {
                    // Fallback: simulate Ctrl+V
                    document.execCommand('paste');
                    updateWriterCharCount();
                    
                    // Visual feedback
                    const originalText = pasteWriterInput.textContent;
                    pasteWriterInput.textContent = '📋 Strg+V verwenden';
                    
                    setTimeout(() => {
                        pasteWriterInput.textContent = originalText;
                    }, 2000);
                }
            } catch (error) {
                console.error('Paste failed:', error);
                // Show user how to paste manually
                const originalText = pasteWriterInput.textContent;
                pasteWriterInput.textContent = '⌨️ Strg+V drücken';
                
                setTimeout(() => {
                    pasteWriterInput.textContent = originalText;
                }, 3000);
                
                // Focus textarea so user can paste manually
                writerInputText.focus();
            }
        }

        async function copyWriterToClipboard() {
            if (!writerOutputText.value) return;

            try {
                await navigator.clipboard.writeText(writerOutputText.value);
                
                const originalText = copyWriterOutput.textContent;
                copyWriterOutput.textContent = '✅ Kopiert!';
                
                setTimeout(() => {
                    copyWriterOutput.textContent = originalText;
                }, 2000);
            } catch (error) {
                console.error('Copy failed:', error);
                showError('Kopieren fehlgeschlagen');
            }
        }

        // UI helper functions
        function setLoading(loading) {
            isLoading = loading;
            loadingIndicator.style.display = loading ? 'flex' : 'none';
            outputText.style.display = loading ? 'none' : 'block';
            translateBtn.disabled = loading || !inputText.value.trim();
            translateBtn.textContent = loading ? '🔄 Übersetzt...' : '✨ Übersetzen';
        }

        function updateCharCount() {
            const inputCount = inputText.value.length;
            const outputCount = outputText.value.length;
            
            charCount.textContent = `${inputCount} Zeichen`;
            outputCharCount.textContent = `${outputCount} Zeichen`;
            
            // Update button states
            translateBtn.disabled = isLoading || !inputText.value.trim();
            copyTranslation.disabled = !outputText.value.trim();
            clearInput.disabled = !inputText.value.trim();
            favoriteBtn.disabled = !outputText.value.trim() || !inputText.value.trim();
            expandOutputBtn.disabled = !outputText.value.trim();
        }

        function updatePanelTitles() {
            const sourceLang = sourceLanguage.value;
            const targetLang = targetLanguage.value;
            
            inputPanelTitle.textContent = sourceLang === 'auto' ? 'Text eingeben' : languageNames[sourceLang];
            outputPanelTitle.textContent = languageNames[targetLang];
        }

        function updateUI() {
            updateCharCount();
            updatePanelTitles();
        }

        // Favorites management
        function renderFavorites() {
            const searchTerm = favoritesSearch.value.toLowerCase();
            const filteredFavorites = favorites.filter(f => 
                f.original.toLowerCase().includes(searchTerm) || 
                f.translated.toLowerCase().includes(searchTerm)
            );

            if (filteredFavorites.length === 0) {
                favoritesList.innerHTML = `
                    <div style="text-align: center; color: #999; padding: 40px 20px;">
                        ${searchTerm ? 'Keine Favoriten gefunden' : 'Noch keine Favoriten vorhanden.<br><small>Klicke den ⭐ Button um eine Übersetzung zu favorisieren.</small>'}
                    </div>
                `;
                return;
            }

            favoritesList.innerHTML = filteredFavorites.map(favorite => {
                const date = new Date(favorite.timestamp).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const sourceName = favorite.sourceLang === 'auto' ? 'Auto' : languageNames[favorite.sourceLang];
                const targetName = languageNames[favorite.targetLang];

                return `
                    <div class="history-item favorite-item" onclick="loadFavorite(${favorite.id})">
                        <button class="delete-favorite-btn" onclick="event.stopPropagation(); deleteFavorite(${favorite.id})" title="Favorit löschen">×</button>
                        <div class="history-item-lang">⭐ ${sourceName} → ${targetName}</div>
                        <div class="history-item-text">${favorite.original}</div>
                        <div class="history-item-translation">${favorite.translated}</div>
                        <div class="history-item-date">${date}</div>
                    </div>
                `;
            }).join('');
        }

        function loadFavorite(id) {
            const favorite = favorites.find(f => f.id === id);
            if (favorite) {
                inputText.value = favorite.original;
                outputText.value = favorite.translated;
                sourceLanguage.value = favorite.sourceLang;
                targetLanguage.value = favorite.targetLang;
                updateUI();
            }
        }

        async function addToFavorites() {
            const text = inputText.value.trim();
            const translatedText = outputText.value.trim();
            
            if (!text || !translatedText) return;

            const sourceLang = sourceLanguage.value;
            const targetLang = targetLanguage.value;

            // Check if already exists
            const exists = favorites.find(f => 
                f.original === text && 
                f.translated === translatedText &&
                f.sourceLang === sourceLang &&
                f.targetLang === targetLang
            );

            if (exists) {
                showError('Diese Übersetzung ist bereits in den Favoriten!');
                return;
            }

            const favorite = {
                id: Date.now(),
                original: text,
                translated: translatedText,
                sourceLang: sourceLang,
                targetLang: targetLang,
                timestamp: new Date().toISOString()
            };

            favorites.unshift(favorite);
            
            // Limit favorites to 50 items
            if (favorites.length > 50) {
                favorites = favorites.slice(0, 50);
            }

            await saveFavorites();
            renderFavorites();

            // Visual feedback
            const originalText = favoriteBtn.textContent;
            favoriteBtn.textContent = '⭐ Hinzugefügt!';
            
            setTimeout(() => {
                favoriteBtn.textContent = originalText;
            }, 2000);
        }

        async function deleteFavorite(id) {
            if (confirm('Möchtest du diesen Favoriten wirklich löschen?')) {
                favorites = favorites.filter(f => f.id !== id);
                await saveFavorites();
                renderFavorites();
            }
        }

        async function clearFavoritesData() {
            if (confirm('Möchtest du wirklich alle Favoriten löschen?')) {
                favorites = [];
                await saveFavorites();
                renderFavorites();
            }
        }

        // Utility functions
        function swapLanguagesHandler() {
            if (sourceLanguage.value === 'auto') {
                showError('Auto-Detect kann nicht als Zielsprache verwendet werden');
                return;
            }

            // Swap language selections
            const tempSource = sourceLanguage.value;
            sourceLanguage.value = targetLanguage.value;
            targetLanguage.value = tempSource;

            // Swap texts
            const tempText = inputText.value;
            inputText.value = outputText.value;
            outputText.value = tempText;

            updateUI();
        }

        function clearInputText() {
            inputText.value = '';
            outputText.value = '';
            updateUI();
            inputText.focus();
        }

        async function pasteFromClipboard() {
            // Focus textarea first to ensure proper context
            inputText.focus();
            
            try {
                // Try modern clipboard API first
                if (navigator.clipboard && navigator.clipboard.readText) {
                    const text = await navigator.clipboard.readText();
                    inputText.value = text;
                    updateUI();
                    
                    // Trigger auto-translate if enabled
                    if (autoTranslateEnabled && text.trim()) {
                        clearTimeout(translationTimeout);
                        translationTimeout = setTimeout(() => {
                            translateText();
                        }, 500);
                    }
                    
                    // Visual feedback
                    const originalText = pasteInput.textContent;
                    pasteInput.textContent = '✅ Eingefügt!';
                    
                    setTimeout(() => {
                        pasteInput.textContent = originalText;
                    }, 2000);
                } else {
                    // Fallback: simulate Ctrl+V
                    document.execCommand('paste');
                    updateUI();
                    
                    // Visual feedback
                    const originalText = pasteInput.textContent;
                    pasteInput.textContent = '📋 Strg+V verwenden';
                    
                    setTimeout(() => {
                        pasteInput.textContent = originalText;
                    }, 2000);
                }
            } catch (error) {
                console.error('Paste failed:', error);
                // Show user how to paste manually
                const originalText = pasteInput.textContent;
                pasteInput.textContent = '⌨️ Strg+V drücken';
                
                setTimeout(() => {
                    pasteInput.textContent = originalText;
                }, 3000);
                
                // Focus textarea so user can paste manually
                inputText.focus();
            }
        }

        async function copyToClipboard() {
            if (!outputText.value) return;

            try {
                await navigator.clipboard.writeText(outputText.value);
                
                // Visual feedback
                const originalText = copyTranslation.textContent;
                copyTranslation.textContent = '✅ Kopiert!';
                
                setTimeout(() => {
                    copyTranslation.textContent = originalText;
                }, 2000);
            } catch (error) {
                console.error('Copy failed:', error);
                showError('Kopieren fehlgeschlagen');
            }
        }

        function showError(message) {
            // Remove existing error messages
            document.querySelectorAll('.error').forEach(el => el.remove());
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = message;
            
            document.querySelector('.main-content').prepend(errorDiv);
            
            setTimeout(() => errorDiv.remove(), 5000);
        }

        // Auto-translate with debounce
        function setupAutoTranslate() {
            inputText.addEventListener('input', () => {
                clearTimeout(translationTimeout);
                
                if (inputText.value.trim() && !isLoading && autoTranslateEnabled) {
                    translationTimeout = setTimeout(() => {
                        translateText();
                    }, 1500); // Auto-translate after 1.5 seconds of no typing
                } else if (!inputText.value.trim()) {
                    outputText.value = '';
                    updateCharCount();
                }
            });
        }

        // Event listeners
        function setupEventListeners() {
            // Input and translation
            inputText.addEventListener('input', updateUI);
            translateBtn.addEventListener('click', translateText);
            
            // Language controls
            sourceLanguage.addEventListener('change', updateUI);
            targetLanguage.addEventListener('change', updateUI);
            swapLanguages.addEventListener('click', swapLanguagesHandler);
            
            // Model selection
            modelSelector.addEventListener('change', () => {
                saveSelectedModel();
                updateUI();
            });

            // Model selection - second selector
            if (modelSelector2) {
                modelSelector2.addEventListener('change', () => {
                    saveSelectedModel2();
                    updateUI();
                });
            }
            
            // Mode switching
            translatorTab.addEventListener('click', () => {
                switchMode('translator');
            });
            
            writerTab.addEventListener('click', () => {
                switchMode('writer');
            });

            // Mode switching - second set
            if (translatorTab2) {
                translatorTab2.addEventListener('click', () => {
                    switchMode('translator');
                });
            }
            
            if (writerTab2) {
                writerTab2.addEventListener('click', () => {
                    switchMode('writer');
                });
            }
            
            // Actions
            clearInput.addEventListener('click', clearInputText);
            pasteInput.addEventListener('click', pasteFromClipboard);
            copyTranslation.addEventListener('click', copyToClipboard);
            favoriteBtn.addEventListener('click', addToFavorites);
            autoTranslateToggle.addEventListener('click', toggleAutoTranslate);
            
            // Writer actions
            writerInputText.addEventListener('input', updateWriterCharCount);
            correctBtn.addEventListener('click', correctText);
            paraphraseBtn.addEventListener('click', paraphraseText);
            copyWriterOutput.addEventListener('click', copyWriterToClipboard);
            clearWriterInput.addEventListener('click', clearWriterInputText);
            pasteWriterInput.addEventListener('click', pasteToWriterInput);
            
            // Theme
            themeToggle.addEventListener('click', toggleTheme);
            
            // Favorites
            favoritesSearch.addEventListener('input', renderFavorites);
            clearFavorites.addEventListener('click', clearFavoritesData);
            showFavoritesBtn.addEventListener('click', showFavoritesPopup);
            closeFavoritesBtn.addEventListener('click', hideFavoritesPopup);
            favoritesOverlay.addEventListener('click', hideFavoritesPopup);
            
            // Keyboard shortcuts
            inputText.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    translateText();
                }
            });
            
            writerInputText.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    correctText();
                }
            });

            // Text Editor events
            expandInputBtn.addEventListener('click', () => {
                showTextEditor('translator');
            });
            
            if (expandWriterInputBtn) {
                expandWriterInputBtn.addEventListener('click', () => {
                    showTextEditor('writer');
                });
            }
            
            closeTextEditorBtn.addEventListener('click', hideTextEditor);
            textEditorOverlay.addEventListener('click', hideTextEditor);
            textEditorSave.addEventListener('click', saveTextEditorContent);
            textEditorClear.addEventListener('click', clearTextEditor);
            textEditorPaste.addEventListener('click', pasteToTextEditor);
            textEditorTextarea.addEventListener('input', updateTextEditorCharCount);

            // Text Viewer events
            expandOutputBtn.addEventListener('click', () => {
                showTextViewer('translator');
            });
            
            if (expandWriterOutputBtn) {
                expandWriterOutputBtn.addEventListener('click', () => {
                    showTextViewer('writer');
                });
            }
            
            closeTextViewerBtn.addEventListener('click', hideTextViewer);
            textViewerOverlay.addEventListener('click', hideTextViewer);
            textViewerCopy.addEventListener('click', copyFromTextViewer);

            // ESC key to close popups
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (textViewerPopup.style.display === 'block') {
                        hideTextViewer();
                    } else if (textEditorPopup.style.display === 'block') {
                        hideTextEditor();
                    } else if (favoritesPopup.style.display === 'block') {
                        hideFavoritesPopup();
                    }
                }
            });
            
            // Ctrl+Enter to save in text editor
            textEditorTextarea.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault();
                    saveTextEditorContent();
                }
            });

            // Setup auto-translate
            setupAutoTranslate();
        }

        // Tab switching functionality
        function switchTab(tabName) {
            // Hide all tab panes
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Remove active from all buttons
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Show selected tab
            const selectedTab = document.getElementById(tabName + '-tab');
            if (selectedTab) {
                selectedTab.classList.add('active');
            }

            // Activate selected button
            const buttons = document.querySelectorAll('.tab-button');
            buttons.forEach(btn => {
                if (btn.onclick.toString().includes(tabName)) {
                    btn.classList.add('active');
                }
            });

            // Show/hide translator and writer controls based on selected tab
            if (tabName === 'pwa') {
                // Hide both translator and writer controls when PWA tab is active
                if (translatorControls) translatorControls.style.display = 'none';
                if (writerControls) writerControls.style.display = 'none';

                // Calculate storage when PWA tab is opened
                setTimeout(() => calculateStorageSize(), 100);
            } else if (tabName === 'translator') {
                // Show appropriate controls based on current mode
                if (settings.currentMode === 'writer') {
                    if (translatorControls) translatorControls.style.display = 'none';
                    if (writerControls) writerControls.style.display = 'flex';
                } else {
                    if (translatorControls) translatorControls.style.display = 'flex';
                    if (writerControls) writerControls.style.display = 'none';
                }
            }
        }

        // Calculate storage size
        async function calculateStorageSize() {
            try {
                // Calculate localStorage size
                let totalSize = 0;
                for (let key in localStorage) {
                    if (localStorage.hasOwnProperty(key)) {
                        totalSize += localStorage[key].length + key.length;
                    }
                }
                const sizeKB = (totalSize / 1024).toFixed(2);

                const storageSpan = document.getElementById('storage-size-pwa');
                if (storageSpan) {
                    storageSpan.textContent = `${sizeKB} KB`;
                }

                // Calculate favorites size
                const favoritesData = localStorage.getItem('translation-favorites');
                if (favoritesData) {
                    const favSizeKB = (favoritesData.length / 1024).toFixed(2);
                    const favSpan = document.getElementById('favorites-size-pwa');
                    if (favSpan) {
                        const favCount = JSON.parse(favoritesData).length;
                        favSpan.textContent = `${favSizeKB} KB (${favCount} Favoriten)`;
                    }
                } else {
                    const favSpan = document.getElementById('favorites-size-pwa');
                    if (favSpan) {
                        favSpan.textContent = 'Keine Favoriten gespeichert';
                    }
                }
            } catch (error) {
                console.error('Error calculating storage size:', error);
            }
        }

        // Clear cache and reload
        async function clearCacheAndReload() {
            try {
                showReloadStatus('success', 'Cache wird geleert...');

                // Clear various browser caches
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(cacheNames.map(name => caches.delete(name)));
                }

                // Clear service worker cache
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(registrations.map(reg => reg.unregister()));
                }

                // Note: We deliberately do NOT clear localStorage to preserve user data

                showReloadStatus('success', 'Cache geleert! App wird neu geladen...');

                setTimeout(() => {
                    window.location.reload(true);
                }, 1000);

            } catch (error) {
                showReloadStatus('error', `Fehler beim Cache leeren: ${error.message}`);
            }
        }

        // Hard reload
        function hardReload() {
            showReloadStatus('success', 'Vollständiger Neu-Start wird durchgeführt...');

            setTimeout(() => {
                // Force a hard reload by adding a cache-busting parameter
                const url = new URL(window.location);
                url.searchParams.set('_t', Date.now());
                window.location.href = url.toString();
            }, 1000);
        }

        // Show reload status
        function showReloadStatus(type, message) {
            const status = document.getElementById('reloadStatus');
            if (!status) return;

            status.className = type === 'success' ? 'success' : 'error';
            status.textContent = message;
            status.style.display = 'block';

            // Set background color based on type
            if (type === 'success') {
                status.style.backgroundColor = '#d4edda';
                status.style.color = '#155724';
                status.style.border = '1px solid #c3e6cb';
            } else {
                status.style.backgroundColor = '#f8d7da';
                status.style.color = '#721c24';
                status.style.border = '1px solid #f5c6cb';
            }

            // Auto-hide after 5 seconds
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        }

        // Initialize app when page loads
        window.addEventListener('load', initApp);
