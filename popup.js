// =============================================================================
// PERFECT INSTA POST - VERSION 2.0 (CLEAN & PERFORMANT)
// Architecture simplifiée : popup.js → api.js → backend
// =============================================================================

import { API } from './api.js';
import { analytics } from './analytics.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
    maxImageSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    defaultOptions: {
        postType: 'lifestyle',
        tone: 'casual'
    }
};

// =============================================================================
// ÉTAT GLOBAL
// =============================================================================

const State = {
    auth: {
        isAuthenticated: false,
        token: null,
        user: null
    },
    currentImage: null,
    currentFile: null,
    result: null,
    isGenerating: false
};

// =============================================================================
// ÉLÉMENTS DOM
// =============================================================================

const DOM = {
    // Auth
    authSection: null,
    googleLoginBtn: null,
    userBar: null,
    userEmail: null,
    userPlan: null,
    logoutBtn: null,

    // Upload
    uploadArea: null,
    imageInput: null,
    previewImage: null,

    // Config
    configSection: null,
    postTypeSelect: null,
    toneSelect: null,
    locationInput: null,
    contextInput: null,
    generateBtn: null,

    // Results
    resultsSection: null,
    generatedCaption: null,
    hashtagsContainer: null,
    suggestionsList: null,
    copyAllBtn: null,
    copyCaptionBtn: null,
    copyHashtagsBtn: null,
    rewriteBtn: null,
    newPostBtn: null
};

// =============================================================================
// INITIALISATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Perfect Insta Post v2.0 - Initialisation');

    // 1. Traduire la page
    i18n.translatePage();

    // 2. Initialiser les références DOM
    initDOM();

    // 3. Charger l'authentification
    await loadAuth();

    // 4. Configurer les event listeners
    setupListeners();

    // 5. Mettre à jour l'UI
    updateUI();

    console.log('✅ Popup initialisé');
});

function initDOM() {
    // Auth
    DOM.authSection = document.getElementById('authSection');
    DOM.googleLoginBtn = document.getElementById('googleLoginBtn');
    DOM.userBar = document.getElementById('userBar');
    DOM.userEmail = document.getElementById('userEmail');
    DOM.userPlan = document.getElementById('userPlan');
    DOM.logoutBtn = document.getElementById('logoutBtn');

    // Upload
    DOM.uploadArea = document.getElementById('uploadArea');
    DOM.imageInput = document.getElementById('imageInput');
    DOM.previewImage = document.getElementById('previewImage');

    // Config
    DOM.configSection = document.getElementById('configSection');
    DOM.postTypeSelect = document.getElementById('postType');
    DOM.toneSelect = document.getElementById('tone');
    DOM.locationInput = document.getElementById('location');
    DOM.contextInput = document.getElementById('context');
    DOM.generateBtn = document.getElementById('generateBtn');

    // Results
    DOM.resultsSection = document.getElementById('resultsSection');
    DOM.generatedCaption = document.getElementById('generatedCaption');
    DOM.hashtagsContainer = document.getElementById('hashtagsContainer');
    DOM.suggestionsList = document.getElementById('suggestionsList');
    DOM.copyAllBtn = document.getElementById('copyAllBtn');
    DOM.copyCaptionBtn = document.getElementById('copyCaptionBtn');
    DOM.copyHashtagsBtn = document.getElementById('copyHashtagsBtn');
    DOM.rewriteBtn = document.getElementById('rewriteBtn');
    DOM.newPostBtn = document.getElementById('newPostBtn');

    // Désactiver le bouton de génération au départ
    if (DOM.generateBtn) {
        DOM.generateBtn.disabled = true;
    }
}

function setupListeners() {
    // Auth
    DOM.googleLoginBtn?.addEventListener('click', handleLogin);
    DOM.logoutBtn?.addEventListener('click', handleLogout);

    // Upload
    DOM.imageInput?.addEventListener('change', handleImageSelect);
    DOM.uploadArea?.addEventListener('click', () => DOM.imageInput?.click());
    DOM.uploadArea?.addEventListener('dragover', handleDragOver);
    DOM.uploadArea?.addEventListener('drop', handleDrop);

    // Generate
    DOM.generateBtn?.addEventListener('click', handleGenerate);

    // Actions
    DOM.copyAllBtn?.addEventListener('click', () => copyToClipboard('all'));
    DOM.copyCaptionBtn?.addEventListener('click', () => copyToClipboard('caption'));
    DOM.copyHashtagsBtn?.addEventListener('click', () => copyToClipboard('hashtags'));
    DOM.rewriteBtn?.addEventListener('click', handleRewrite);
    DOM.newPostBtn?.addEventListener('click', handleReset);
}

// =============================================================================
// AUTHENTIFICATION
// =============================================================================

async function loadAuth() {
    try {
        const response = await chrome.runtime.sendMessage({ type: 'GET_AUTH' });

        if (response?.isAuthenticated) {
            State.auth = {
                isAuthenticated: true,
                token: response.token,
                user: response.user
            };
            API.setToken(response.token);
            console.log('✅ Authentifié:', response.user.email);
        }
    } catch (error) {
        console.error('❌ Erreur auth:', error);
    }
}

async function handleLogin() {
    try {
        setButtonLoading(DOM.googleLoginBtn, true, i18n.t('generating'));

        const response = await chrome.runtime.sendMessage({ type: 'LOGIN' });

        if (response?.success) {
            State.auth = {
                isAuthenticated: true,
                token: response.token,
                user: response.user
            };
            API.setToken(response.token);
            updateUI();
            showToast(i18n.t('toastConnected'), 'success');
            analytics.capture('extension_login', { plan: response.user?.plan }, response.user);
            console.log('✅ Connexion réussie !');
        } else {
            showToast(response.error || i18n.t('toastConnectionError'), 'error');
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        showToast(i18n.t('toastConnectionError'), 'error');
    } finally {
        setButtonLoading(DOM.googleLoginBtn, false, i18n.t('loginBtn'));
    }
}

async function handleLogout() {
    try {
        await chrome.runtime.sendMessage({ type: 'LOGOUT' });
        State.auth = { isAuthenticated: false, token: null, user: null };
        API.setToken(null);
        updateUI();
        showToast(i18n.t('toastDisconnected'), 'success');
    } catch (error) {
        console.error('❌ Logout error:', error);
    }
}

// =============================================================================
// UPLOAD D'IMAGE
// =============================================================================

function handleImageSelect(event) {
    const file = event.target.files?.[0];
    if (file) processImage(file);
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if (file && CONFIG.supportedFormats.includes(file.type)) {
        processImage(file);
    } else {
        showToast(i18n.t('toastUnsupportedFormat'), 'error');
    }
}

function processImage(file) {
    // Vérifier la taille
    if (file.size > CONFIG.maxImageSize) {
        showToast(i18n.t('toastImageTooBig'), 'error');
        return;
    }

    State.currentFile = file;

    // Afficher la prévisualisation
    const reader = new FileReader();
    reader.onload = (e) => {
        State.currentImage = e.target.result;

        if (DOM.previewImage) {
            DOM.previewImage.src = State.currentImage;
            DOM.previewImage.hidden = false;
        }

        // Activer le bouton
        if (DOM.generateBtn) {
            DOM.generateBtn.disabled = false;
        }

        console.log('✅ Image chargée:', file.name, (file.size / 1024).toFixed(0) + 'KB');
    };
    reader.readAsDataURL(file);
}

// =============================================================================
// GÉNÉRATION DE CONTENU
// =============================================================================

async function handleGenerate() {
    if (!State.currentFile) {
        showToast(i18n.t('toastSelectImage'), 'error');
        return;
    }

    // Guard anti double-clic
    if (State.isGenerating) return;
    State.isGenerating = true;

    // Vérification offline
    if (!navigator.onLine) {
        showToast(i18n.t('toastOffline'), 'error');
        State.isGenerating = false;
        return;
    }

    try {
        setButtonLoading(DOM.generateBtn, true, i18n.t('generating'));

        const options = {
            postType: DOM.postTypeSelect?.value || CONFIG.defaultOptions.postType,
            tone: DOM.toneSelect?.value || CONFIG.defaultOptions.tone,
            location: sanitize(DOM.locationInput?.value || '', 150),
            context: sanitize(DOM.contextInput?.value || '', 150),
            language: i18n.getCurrentLanguage()
        };

        console.log('🎨 Génération avec options:', options);

        // Appel API centralisé
        const result = await API.generatePost(State.currentFile, options);

        if (result.success) {
            State.result = result;
            displayResults(result);
            show(DOM.resultsSection);
            analytics.capture('extension_generate', {
                post_type: options.postType,
                tone: options.tone,
                language: options.language,
                has_location: !!options.location,
                has_context: !!options.context
            }, State.auth.user);
            console.log('✅ Généré:', result);
        } else {
            analytics.capture('extension_error', { action: 'generate', error: result.error }, State.auth.user);
            showToast(result.error || i18n.t('toastGenerationError'), 'error');
        }

    } catch (error) {
        console.error('❌ Generate error:', error);
        showToast(i18n.t('toastGenerationError') + ': ' + error.message, 'error');
    } finally {
        State.isGenerating = false;
        setButtonLoading(DOM.generateBtn, false, i18n.t('generateBtn'));
    }
}

function displayResults(result) {
    // Caption
    if (DOM.generatedCaption) {
        DOM.generatedCaption.value = result.caption || '';
    }

    // Hashtags
    if (DOM.hashtagsContainer && result.hashtags) {
        DOM.hashtagsContainer.innerHTML = '';
        result.hashtags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'hashtag';
            span.textContent = tag.startsWith('#') ? tag : '#' + tag;
            DOM.hashtagsContainer.appendChild(span);
        });
    }

    // Suggestions
    if (DOM.suggestionsList && result.suggestions) {
        DOM.suggestionsList.innerHTML = '';
        result.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            DOM.suggestionsList.appendChild(li);
        });
    }
}

// =============================================================================
// ACTIONS
// =============================================================================

async function handleRewrite() {
    if (!State.result?.caption) {
        showToast(i18n.t('toastNoCaption'), 'error');
        return;
    }

    try {
        setButtonLoading(DOM.rewriteBtn, true, i18n.t('rewriting'));

        const tone = DOM.toneSelect?.value || 'casual';
        const result = await API.rewriteCaption(State.result.caption, tone, i18n.getCurrentLanguage());

        if (result.success && result.caption) {
            State.result.caption = result.caption;
            if (DOM.generatedCaption) {
                DOM.generatedCaption.value = result.caption;
            }
            analytics.capture('extension_rewrite', { tone }, State.auth.user);
            showToast(i18n.t('toastCaptionRewritten'), 'success');
        } else {
            showToast(i18n.t('toastGenerationError'), 'error');
        }

    } catch (error) {
        console.error('❌ Rewrite error:', error);
        showToast(i18n.t('toastGenerationError') + ': ' + error.message, 'error');
    } finally {
        setButtonLoading(DOM.rewriteBtn, false, i18n.t('rewrite'));
    }
}

function handleReset() {
    State.currentImage = null;
    State.currentFile = null;
    State.result = null;

    if (DOM.imageInput) DOM.imageInput.value = '';
    if (DOM.previewImage) {
        DOM.previewImage.hidden = true;
        DOM.previewImage.src = '';
    }
    if (DOM.generateBtn) DOM.generateBtn.disabled = true;

    hide(DOM.resultsSection);
    console.log('🔄 Reset');
}

// =============================================================================
// COPIE VERS PRESSE-PAPIER
// =============================================================================

function copyToClipboard(type) {
    let text = '';

    switch (type) {
        case 'caption':
            text = DOM.generatedCaption?.value || '';
            break;

        case 'hashtags':
            const hashtags = Array.from(DOM.hashtagsContainer?.children || [])
                .map(el => el.textContent)
                .join(' ');
            text = hashtags;
            break;

        case 'all':
            const caption = DOM.generatedCaption?.value || '';
            const tags = Array.from(DOM.hashtagsContainer?.children || [])
                .map(el => el.textContent)
                .join(' ');
            text = `${caption}\n\n${tags}`;
            break;
    }

    if (!text) {
        showToast(i18n.t('toastNothingToCopy'), 'error');
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            analytics.capture('extension_copy', { type }, State.auth.user);
            showToast(i18n.t('toastCopied'), 'success');
        })
        .catch(err => {
            console.error('Copy error:', err);
            showToast(i18n.t('toastGenerationError'), 'error');
        });
}

// =============================================================================
// UI HELPERS
// =============================================================================

function updateUI() {
    const isAuth = State.auth.isAuthenticated;

    // Toggle sections
    toggle(DOM.authSection, !isAuth);
    toggle(DOM.uploadArea, isAuth);
    toggle(DOM.configSection, isAuth);
    toggle(DOM.userBar, isAuth);

    // Update user info
    if (isAuth && State.auth.user) {
        if (DOM.userEmail) {
            DOM.userEmail.textContent = State.auth.user.email;
        }
        if (DOM.userPlan) {
            DOM.userPlan.textContent = i18n.t(State.auth.user.plan === 'pro' ? 'planPro' : 'planFree');
        }
    }

    console.log('🎨 UI mise à jour');
}

function sanitize(str, maxLen = 150) {
    return str.trim().substring(0, maxLen).replace(/[<>"'`]/g, '');
}

function setButtonLoading(button, isLoading, text) {
    if (!button) return;
    button.disabled = isLoading;
    button.textContent = text;
}

function show(element) {
    if (element) element.hidden = false;
}

function hide(element) {
    if (element) element.hidden = true;
}

function toggle(element, visible) {
    if (element) element.hidden = !visible;
}

function showToast(message, type = 'info') {
    console.log(`[${type.toUpperCase()}]`, message);

    // Retirer tout toast existant
    const existing = document.getElementById('pip-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'pip-toast';
    toast.className = `pip-toast pip-toast--${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animation entrée
    requestAnimationFrame(() => toast.classList.add('pip-toast--visible'));

    // Disparition auto
    const duration = type === 'error' ? 4000 : 2500;
    setTimeout(() => {
        toast.classList.remove('pip-toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

console.log('📦 popup-v2.js chargé');
