// =============================================================================
// API MODULE - Centralisation de tous les appels backend (JudgeMyJPEG)
// =============================================================================

const API_BASE_URL = 'https://www.judgemyjpeg.fr';
const API_TIMEOUT_MS = 30000; // 30 secondes

class APIClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    getHeaders(includeContentType = true) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        if (includeContentType) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
    }

    /**
     * Fetch avec timeout via AbortController
     */
    async fetchWithTimeout(url, options = {}) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timer);
            return response;
        } catch (error) {
            clearTimeout(timer);
            if (error.name === 'AbortError') {
                throw new Error('timeout');
            }
            throw error;
        }
    }

    /**
     * Générer un post Instagram à partir d'une image
     */
    async generatePost(imageFile, options = {}) {
        try {
            console.log('📡 API.generatePost:', options);

            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('postType', options.postType || 'lifestyle');
            formData.append('tone', options.tone || 'casual');
            formData.append('language', options.language || 'en');
            if (options.location) formData.append('location', options.location);
            if (options.context) formData.append('context', options.context);

            const response = await this.fetchWithTimeout(`${this.baseUrl}/api/instagram/generate`, {
                method: 'POST',
                headers: this.getHeaders(false),
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                caption: String(result.caption || '').substring(0, 3000),
                hashtags: Array.isArray(result.hashtags)
                    ? result.hashtags.slice(0, 30).map(h => String(h).substring(0, 60))
                    : [],
                suggestions: Array.isArray(result.suggestions)
                    ? result.suggestions.slice(0, 5).map(s => String(s).substring(0, 300))
                    : []
            };

        } catch (error) {
            console.error('❌ API.generatePost error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Réécrire une légende existante
     */
    async rewriteCaption(caption, style = 'casual', language = 'en') {
        try {
            console.log('📡 API.rewriteCaption:', style, language);

            const response = await this.fetchWithTimeout(`${this.baseUrl}/api/instagram/rewrite`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ caption, style, language })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }

            const result = await response.json();
            return {
                success: true,
                caption: String(result.caption || caption).substring(0, 3000)
            };

        } catch (error) {
            console.error('❌ API.rewriteCaption error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Récupérer les informations utilisateur
     */
    async getUserInfo() {
        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/api/users/me`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            return { success: true, user: result.user };

        } catch (error) {
            console.error('❌ API.getUserInfo error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Singleton
export const API = new APIClient();

console.log('📦 api.js chargé — backend: JudgeMyJPEG');
