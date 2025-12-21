// Environment variable loader for frontend
// This script loads configuration from .env file for development
// In production, you should use environment variables or a build process

(function() {
    // Check if we're in development (file:// protocol or localhost)
    const isDevelopment = window.location.protocol === 'file:' || 
                         window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';

    if (isDevelopment) {
        // For development, load from .env file
        fetch('.env')
            .then(response => response.text())
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
                
                // Initialize EmailJS if available
                if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG.publicKey) {
                    emailjs.init({
                        publicKey: window.EMAILJS_CONFIG.publicKey
                    });
                    console.log('✅ EmailJS initialized from .env configuration');
                }
            })
            .catch(error => {
                console.error('❌ Failed to load .env file:', error);
                console.log('Falling back to emailjs-config.js');
                
                // Fallback to existing config file
                const script = document.createElement('script');
                script.src = 'emailjs-config.js';
                document.head.appendChild(script);
            });
    } else {
        // For production, use environment variables or build-time configuration
        console.log('🚀 Production mode - using build-time configuration');
        
        // You can set these during your build process
        window.EMAILJS_CONFIG = {
            publicKey: process.env.EMAILJS_PUBLIC_KEY || 'Rx8jjg8cEZaG7P8V2',
            serviceId: process.env.EMAILJS_SERVICE_ID || 'service_7zp044t',
            templateId: process.env.EMAILJS_TEMPLATE_ID || 'template_vzqz49g'
        };

        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init({
                publicKey: window.EMAILJS_CONFIG.publicKey
            });
            console.log('✅ EmailJS initialized from environment variables');
        }
    }
})();
