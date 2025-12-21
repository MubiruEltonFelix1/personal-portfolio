// Environment variable loader for frontend
// This script loads configuration from .env file for development
// In production, falls back to emailjs-config.js

(function() {
    // Check if we're in development (file:// protocol or localhost)
    const isDevelopment = window.location.protocol === 'file:' || 
                         window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';

    console.log(`🌍 Environment: ${isDevelopment ? 'Development' : 'Production'}`);

    if (isDevelopment) {
        console.log('🔧 Loading configuration from .env file...');
        // For development, load from .env file
        fetch('.env')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const lines = data.split('\n');
                const config = {};
                
                lines.forEach(line => {
                    line = line.trim();
                    if (line && !line.startsWith('#')) {
                        const [key, value] = line.split('=');
                        if (key && value) {
                            config[key.trim()] = value.trim();
                        }
                    }
                });

                // Set up EmailJS configuration
                window.EMAILJS_CONFIG = {
                    publicKey: config.EMAILJS_PUBLIC_KEY,
                    serviceId: config.EMAILJS_SERVICE_ID,
                    templateId: config.EMAILJS_TEMPLATE_ID
                };

                console.log('✅ Environment variables loaded from .env file');
                initializeEmailJS();
            })
            .catch(error => {
                console.warn('⚠️ Failed to load .env file:', error);
                console.log('🔄 Falling back to emailjs-config.js');
                loadFallbackConfig();
            });
    } else {
        // For production, use fallback to emailjs-config.js
        console.log('🚀 Production mode - loading emailjs-config.js');
        loadFallbackConfig();
    }

    function loadFallbackConfig() {
        // Load the emailjs-config.js file
        const script = document.createElement('script');
        script.src = 'emailjs-config.js';
        script.onload = function() {
            console.log('✅ Fallback configuration loaded');
            initializeEmailJS();
        };
        script.onerror = function() {
            console.error('❌ Failed to load emailjs-config.js');
            console.error('� Make sure emailjs-config.js exists or set up environment variables');
        };
        document.head.appendChild(script);
    }

    function initializeEmailJS() {
        // Wait a moment for EmailJS library to be available
        setTimeout(() => {
            if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.publicKey) {
                try {
                    emailjs.init({
                        publicKey: window.EMAILJS_CONFIG.publicKey
                    });
                    console.log('✅ EmailJS initialized successfully');
                    console.log('📧 Service ID:', window.EMAILJS_CONFIG.serviceId);
                    console.log('📧 Template ID:', window.EMAILJS_CONFIG.templateId);
                } catch (error) {
                    console.error('❌ EmailJS initialization failed:', error);
                }
            } else {
                console.error('❌ EmailJS configuration incomplete:', {
                    emailjsAvailable: typeof emailjs !== 'undefined',
                    configAvailable: !!window.EMAILJS_CONFIG,
                    publicKeyAvailable: !!(window.EMAILJS_CONFIG && window.EMAILJS_CONFIG.publicKey)
                });
            }
        }, 100);
    }
})();
