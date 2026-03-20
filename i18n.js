// =============================================================================
// INTERNATIONALIZATION (i18n) - FR/EN
// =============================================================================

const translations = {
    fr: {
        // Header
        appTitle: 'Perfect Insta Post',
        appSubtitle: 'Générez le post Instagram parfait avec l\'IA',
        logout: 'Se déconnecter',

        // Upload
        uploadPlaceholder: 'Cliquez ou glissez votre image ici',
        uploadHint: 'JPG, PNG, WebP - Max 10MB',

        // Configuration
        configTitle: '⚙️ Configuration',
        postTypeLabel: 'Type de post :',
        postTypes: {
            lifestyle: 'Lifestyle',
            food: 'Nourriture',
            travel: 'Voyage',
            fashion: 'Mode',
            business: 'Business',
            nature: 'Nature',
            art: 'Art'
        },
        toneLabel: 'Ton du message :',
        tones: {
            casual: 'Décontracté',
            professional: 'Professionnel',
            funny: 'Humoristique',
            inspirational: 'Inspirant',
            educational: 'Éducatif'
        },
        locationLabel: 'Lieu (optionnel) :',
        locationPlaceholder: 'Ex: Paris, Tour Eiffel',
        contextLabel: 'Contexte (optionnel) :',
        contextPlaceholder: 'Ex: Weekend en famille',
        generateBtn: '✨ Générer le post',
        generating: 'Génération...',

        // Results
        resultsTitle: '🎯 Votre post parfait',
        captionLabel: 'Légende :',
        hashtagsLabel: 'Hashtags :',
        suggestionsLabel: 'Suggestions d\'amélioration :',
        copyAll: '📋 Copier tout',
        copyCaption: '📝 Caption',
        copyHashtags: '#️⃣ Hashtags',
        rewrite: '✨ Réécrire',
        newPost: '🔄 Nouveau post',
        rewriting: 'Réécriture...',

        // Auth
        authTitle: '🔐 Connexion requise',
        authInfo: 'Connectez-vous avec Google pour utiliser Perfect Insta Post :',
        authBenefits: {
            generation: '✨ Génération de posts avec IA',
            hashtags: '🎯 Hashtags optimisés',
            tracking: '📊 Suivi de votre usage',
            free: '🚀 5 posts gratuits par mois'
        },
        loginBtn: 'Se connecter avec Google',
        securityNote: '🔒 Sécurisé et privé - Aucune donnée personnelle n\'est stockée',

        // Toast messages
        toastConnected: 'Connecté !',
        toastDisconnected: 'Déconnecté',
        toastCopied: 'Copié !',
        toastCaptionRewritten: 'Légende réécrite !',
        toastSelectImage: 'Sélectionnez une image',
        toastImageTooBig: 'Image trop volumineuse (max 10MB)',
        toastUnsupportedFormat: 'Format non supporté (JPG, PNG, WebP uniquement)',
        toastConnectionError: 'Erreur de connexion',
        toastGenerationError: 'Erreur de génération',
        toastNothingToCopy: 'Rien à copier',
        toastNoCaption: 'Aucune légende à réécrire',
        toastOffline: 'Pas de connexion internet',

        // User plan
        planFree: 'Free',
        planPro: 'Pro',

        // Notifications
        notificationConnectedTitle: 'Perfect Insta Post',
        notificationConnectedMessage: '✅ Connecté ! Cliquez sur l\'icône de l\'extension pour continuer.'
    },

    en: {
        // Header
        appTitle: 'Perfect Insta Post',
        appSubtitle: 'Generate the perfect Instagram post with AI',
        logout: 'Logout',

        // Upload
        uploadPlaceholder: 'Click or drag your image here',
        uploadHint: 'JPG, PNG, WebP - Max 10MB',

        // Configuration
        configTitle: '⚙️ Configuration',
        postTypeLabel: 'Post type:',
        postTypes: {
            lifestyle: 'Lifestyle',
            food: 'Food',
            travel: 'Travel',
            fashion: 'Fashion',
            business: 'Business',
            nature: 'Nature',
            art: 'Art'
        },
        toneLabel: 'Message tone:',
        tones: {
            casual: 'Casual',
            professional: 'Professional',
            funny: 'Funny',
            inspirational: 'Inspirational',
            educational: 'Educational'
        },
        locationLabel: 'Location (optional):',
        locationPlaceholder: 'E.g: Paris, Eiffel Tower',
        contextLabel: 'Context (optional):',
        contextPlaceholder: 'E.g: Family weekend',
        generateBtn: '✨ Generate post',
        generating: 'Generating...',

        // Results
        resultsTitle: '🎯 Your perfect post',
        captionLabel: 'Caption:',
        hashtagsLabel: 'Hashtags:',
        suggestionsLabel: 'Improvement suggestions:',
        copyAll: '📋 Copy all',
        copyCaption: '📝 Caption',
        copyHashtags: '#️⃣ Hashtags',
        rewrite: '✨ Rewrite',
        newPost: '🔄 New post',
        rewriting: 'Rewriting...',

        // Auth
        authTitle: '🔐 Login required',
        authInfo: 'Sign in with Google to use Perfect Insta Post:',
        authBenefits: {
            generation: '✨ AI-powered post generation',
            hashtags: '🎯 Optimized hashtags',
            tracking: '📊 Usage tracking',
            free: '🚀 5 free posts per month'
        },
        loginBtn: 'Sign in with Google',
        securityNote: '🔒 Secure and private - No personal data stored',

        // Toast messages
        toastConnected: 'Connected!',
        toastDisconnected: 'Disconnected',
        toastCopied: 'Copied!',
        toastCaptionRewritten: 'Caption rewritten!',
        toastSelectImage: 'Select an image',
        toastImageTooBig: 'Image too large (max 10MB)',
        toastUnsupportedFormat: 'Unsupported format (JPG, PNG, WebP only)',
        toastConnectionError: 'Connection error',
        toastGenerationError: 'Generation error',
        toastNothingToCopy: 'Nothing to copy',
        toastNoCaption: 'No caption to rewrite',
        toastOffline: 'No internet connection',

        // User plan
        planFree: 'Free',
        planPro: 'Pro',

        // Notifications
        notificationConnectedTitle: 'Perfect Insta Post',
        notificationConnectedMessage: '✅ Connected! Click the extension icon to continue.'
    }
};

// =============================================================================
// I18N CLASS
// =============================================================================

class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = translations;
    }

    /**
     * Détecter la langue du navigateur
     */
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        console.log('🌍 Browser language detected:', browserLang);

        // Si la langue commence par 'fr' (fr, fr-FR, fr-CA, etc.) → français
        if (browserLang.startsWith('fr')) {
            console.log('✅ Using French (fr)');
            return 'fr';
        }

        // Sinon → anglais par défaut
        console.log('✅ Using English (en) - default');
        return 'en';
    }

    /**
     * Obtenir une traduction
     */
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Translation missing: ${key} (${this.currentLang})`);
                return key;
            }
        }

        return value;
    }

    /**
     * Changer la langue manuellement
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.translatePage();
        }
    }

    /**
     * Traduire toute la page
     */
    translatePage() {
        // Traduire tous les éléments avec data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Traduire les placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Traduire les titres (title attribute)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }

    /**
     * Obtenir la langue courante
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
}

// Export singleton
const i18n = new I18n();

console.log(`🌍 i18n initialized - Language: ${i18n.getCurrentLanguage().toUpperCase()}`);
