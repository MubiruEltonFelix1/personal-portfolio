# 🔐 Security Configuration

## EmailJS Setup

**⚠️ IMPORTANT: Never commit your actual EmailJS credentials to Git!**

### Setup Instructions:

1. **Copy the sample config:**

   ```bash
   cp emailjs-config.sample.js emailjs-config.js
   ```

2. **Update emailjs-config.js with your credentials:**

   ```javascript
   const EMAILJS_CONFIG = {
     publicKey: 'YOUR_ACTUAL_PUBLIC_KEY',
     serviceId: 'YOUR_ACTUAL_SERVICE_ID',
     templateId: 'YOUR_ACTUAL_TEMPLATE_ID',
   };
   ```

3. **The .gitignore file excludes:**
   - `emailjs-config.js` (your actual config)
   - `.env` (environment variables)

### Files in Repository:

- ✅ `emailjs-config.sample.js` - Safe template (committed)
- ❌ `emailjs-config.js` - Your actual credentials (gitignored)
- ❌ `.env` - Environment variables (gitignored)

### Deployment:

For production deployment, you'll need to:

1. Create `emailjs-config.js` on your server
2. Add your actual EmailJS credentials
3. Never expose these in your public repository

## 📧 EmailJS Credentials Location:

- **Public Key**: Found in EmailJS dashboard > Account > API Keys
- **Service ID**: EmailJS dashboard > Email Services > Your Service
- **Template ID**: EmailJS dashboard > Email Templates > Your Template

---

**Remember: Keep your credentials secure! 🔒**
