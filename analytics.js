// =============================================================================
// ANALYTICS MODULE - PostHog via REST API (fire & forget)
// Projet JudgeMyJPEG, source: chrome_extension
// =============================================================================

const POSTHOG_KEY = 'phc_ThskfpDhWbLXBWURegiu8mwbgXlC5We71mmzcC80hFX';
const POSTHOG_HOST = 'https://eu.i.posthog.com';

class Analytics {
    constructor() {
        this._distinctId = null;
    }

    async getDistinctId(user = null) {
        if (user?.email) return user.email;
        if (this._distinctId) return this._distinctId;

        // Générer et persister un ID anonyme
        const stored = await chrome.storage.local.get('_analytics_id');
        if (stored._analytics_id) {
            this._distinctId = stored._analytics_id;
        } else {
            this._distinctId = 'ext_' + Math.random().toString(36).substring(2, 15);
            await chrome.storage.local.set({ _analytics_id: this._distinctId });
        }
        return this._distinctId;
    }

    capture(event, properties = {}, user = null) {
        this.getDistinctId(user).then(distinctId => {
            fetch(`${POSTHOG_HOST}/capture/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: POSTHOG_KEY,
                    event,
                    distinct_id: distinctId,
                    properties: {
                        source: 'chrome_extension',
                        ...properties
                    },
                    timestamp: new Date().toISOString()
                })
            }).catch(() => {}); // Silencieux
        }).catch(() => {});
    }
}

export const analytics = new Analytics();

console.log('📊 analytics.js chargé');
