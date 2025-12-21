// Global backup newsletter handler - Define immediately (not waiting for DOMContentLoaded)
window.handleNewsletterSubmit = function(event) {
    console.log('🔥 Backup newsletter handler triggered');
    
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const emailInput = document.querySelector('#newsletterForm input[type="email"]') || document.querySelector('.newsletter-form input[type="email"]');
    const subscribeBtn = document.querySelector('.subscribe-btn');
    
    if (!emailInput || !subscribeBtn) {
        console.error('❌ Newsletter elements not found in backup handler');
        alert('Error: Newsletter form not found. Please refresh the page and try again.');
        return false;
    }
    
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        emailInput.focus();
        return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        emailInput.focus();
        return false;
    }
    
    console.log('✅ Processing subscription for:', email);
    
    // Update UI
    const originalText = subscribeBtn.innerHTML;
    subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    subscribeBtn.disabled = true;
    emailInput.disabled = true;
    
    // Process subscription
    setTimeout(() => {
        try {
            // Hide form and show success
            const form = emailInput.closest('form');
            const successDiv = document.querySelector('.newsletter-success');
            
            if (form) {
                form.style.display = 'none';
            }
            if (successDiv) {
                successDiv.style.display = 'block';
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Download subscriber info
            downloadSubscriberInfoSimple(email);
            
            // Store locally
            storeSubscriberSimple(email);
            
            // Success feedback
            alert(`🎉 Thank you for subscribing!\n\nEmail: ${email}\n\nSubscriber details have been downloaded to your computer.`);
            
            console.log('✅ Subscription completed successfully via backup handler');
            
        } catch (error) {
            console.error('❌ Error in subscription process:', error);
            
            // Reset UI on error
            const form = emailInput.closest('form');
            const successDiv = document.querySelector('.newsletter-success');
            
            if (form) form.style.display = 'block';
            if (successDiv) successDiv.style.display = 'none';
            
            subscribeBtn.innerHTML = originalText;
            subscribeBtn.disabled = false;
            emailInput.disabled = false;
            
            alert('Something went wrong. Please try again.');
        }
    }, 2000);
    
    return false;
};

// Simple helper functions - also define immediately
function downloadSubscriberInfoSimple(email) {
    const subscriberText = `🎉 NEW BLOG SUBSCRIBER
    
Email: ${email}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Subscriber is interested in:
- Tech tips and tutorials
- University life insights  
- Career growth advice
- Programming projects

Next steps:
1. Add this email to your newsletter list
2. Send a welcome email
3. Plan engaging content

---
Generated: ${new Date().toISOString()}
Source: Blog Newsletter Signup`;

    try {
        const blob = new Blob([subscriberText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `subscriber-${email.replace('@', '-')}-${new Date().toISOString().split('T')[0]}.txt`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('📄 Subscriber file downloaded successfully');
    } catch (error) {
        console.warn('📄 Download failed:', error);
        
        // Fallback: copy to clipboard
        try {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(subscriberText);
                console.log('📋 Subscriber info copied to clipboard as fallback');
            }
        } catch (clipError) {
            console.warn('📋 Clipboard fallback also failed:', clipError);
        }
    }
}

function storeSubscriberSimple(email) {
    try {
        let subscribers = JSON.parse(localStorage.getItem('blogSubscribers') || '[]');
        
        // Check if already exists
        const exists = subscribers.some(sub => sub.email === email);
        if (!exists) {
            subscribers.push({
                email: email,
                date: new Date().toISOString(),
                source: 'blog-newsletter'
            });
            localStorage.setItem('blogSubscribers', JSON.stringify(subscribers));
            console.log('💾 Subscriber stored locally:', email);
        }
    } catch (error) {
        console.warn('💾 Local storage failed:', error);
    }
}

// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog features
    initializeCategories();
    initializeAnimations();
    initializeNewsletter();
    initializeParticles();
    initializeBlogModal();
    initializeNotifyButton();
    
    // Set active navigation
    setActiveNavigation();
});

// Category filtering functionality
function initializeCategories() {
    const categoryCards = document.querySelectorAll('.category-card');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            
            // Update active category
            categoryCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Filter posts
            filterPosts(category);
        });
    });
    
    // Set "All" as active by default
    if (categoryCards.length > 0) {
        categoryCards[0].classList.add('active');
    }
}

function filterPosts(category) {
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        const postCategory = post.dataset.category;
        
        if (category === 'all' || postCategory === category) {
            post.classList.remove('hidden');
            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, 50);
        } else {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            setTimeout(() => {
                post.classList.add('hidden');
            }, 300);
        }
    });
}

// Animation initialization
function initializeAnimations() {
    // Animate blog hero on load
    const heroContent = document.querySelector('.blog-hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
    
    // Animate blog posts
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach((post, index) => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            post.style.transition = 'all 0.8s ease-out';
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, 600 + (index * 150));
    });
    
    // Setup scroll animations
    setupScrollAnimations();
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe newsletter section
    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
        newsletter.style.opacity = '0';
        newsletter.style.transform = 'translateY(30px)';
        newsletter.style.transition = 'all 1s ease-out';
        
        // Create a custom observer for the newsletter
        const newsletterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    newsletterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        newsletterObserver.observe(newsletter);
    }
}

// Newsletter functionality
function initializeNewsletter() {
    console.log('🔍 Initializing newsletter...');
    
    // Try multiple ways to find the form
    const newsletterForm = document.getElementById('newsletterForm') || document.querySelector('.newsletter-form');
    const emailInput = document.querySelector('#newsletterForm input[type="email"]') || document.querySelector('.newsletter-form input[type="email"]');
    const subscribeBtn = document.querySelector('.subscribe-btn');
    const successDiv = document.querySelector('.newsletter-success');
    
    console.log('📋 Newsletter elements found:', {
        form: !!newsletterForm,
        input: !!emailInput,
        button: !!subscribeBtn,
        success: !!successDiv
    });
    
    if (!newsletterForm) {
        console.error('❌ Newsletter form not found!');
        return;
    }
    
    // Add form submission handler
    newsletterForm.addEventListener('submit', function(e) {
        console.log('📝 Form submit event triggered');
        e.preventDefault();
        e.stopPropagation();
        
        handleSubscription();
        return false;
    });
    
    // Add button click handler as backup
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            console.log('🔘 Subscribe button clicked');
            
            // If it's not disabled, handle the subscription
            if (!subscribeBtn.disabled) {
                e.preventDefault();
                e.stopPropagation();
                handleSubscription();
                return false;
            }
        });
    }
    
    function handleSubscription() {
        console.log('🚀 Handling subscription...');
        
        const email = emailInput ? emailInput.value.trim() : '';
        console.log('📧 Email value:', email);
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        console.log('✅ Email valid, processing subscription for:', email);
        
        // Update button state immediately
        const originalText = subscribeBtn.innerHTML;
        subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        subscribeBtn.disabled = true;
        emailInput.disabled = true;
        
        // Show immediate feedback
        showNotification('Processing subscription...', 'info');
        
        // Process subscription
        setTimeout(() => {
            console.log('🎉 Showing success state...');
            
            try {
                // Hide form and show success
                if (newsletterForm) {
                    newsletterForm.style.display = 'none';
                }
                if (successDiv) {
                    successDiv.style.display = 'block';
                    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                
                // Send notification
                sendSubscriptionNotification(email);
                
                // Store subscriber
                storeSubscriber(email);
                
                // Show success notification
                setTimeout(() => {
                    showNotification('🎉 Subscription successful! Check your downloads.', 'success');
                }, 500);
                
                console.log('✅ Subscription completed successfully');
                
            } catch (error) {
                console.error('❌ Error in subscription process:', error);
                
                // Reset form on error
                newsletterForm.style.display = 'block';
                if (successDiv) {
                    successDiv.style.display = 'none';
                }
                subscribeBtn.innerHTML = originalText;
                subscribeBtn.disabled = false;
                emailInput.disabled = false;
                
                showNotification('Something went wrong. Please try again.', 'error');
            }
        }, 2000);
    }
}

function sendSubscriptionNotification(email) {
    // Create subscriber information
    const subscriberData = {
        email: email,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString()
    };
    
    const subscriberText = `🎉 NEW BLOG SUBSCRIBER
    
Email: ${subscriberData.email}
Date: ${subscriberData.date}
Time: ${subscriberData.time}

Subscriber is interested in:
- Tech tips and tutorials
- University life insights  
- Career growth advice
- Programming projects

Next steps:
1. Add this email to your newsletter list
2. Send a welcome email
3. Plan engaging content for your subscribers

---
Generated: ${subscriberData.timestamp}
Source: Blog Newsletter Signup`;

    // Method 1: Download as text file
    try {
        const blob = new Blob([subscriberText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `subscriber-${email.replace('@', '-')}-${new Date().toISOString().split('T')[0]}.txt`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('� Subscriber file downloaded successfully');
    } catch (error) {
        console.warn('Download failed, trying clipboard:', error);
    }
    
    // Method 2: Copy to clipboard
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(subscriberText).then(() => {
                console.log('📋 Subscriber info copied to clipboard');
                setTimeout(() => {
                    showNotification('� Subscriber details copied to clipboard!', 'info');
                }, 2000);
            }).catch(() => {
                fallbackCopyMethod(subscriberText);
            });
        } else {
            fallbackCopyMethod(subscriberText);
        }
    } catch (error) {
        console.warn('Clipboard copy failed:', error);
    }
    
    // Method 3: Open email client with pre-filled content
    setTimeout(() => {
        try {
            const subject = encodeURIComponent('🎉 New Blog Newsletter Subscription!');
            const body = encodeURIComponent(subscriberText);
            const mailtoLink = `mailto:mubirueltonfelix@gmail.com?subject=${subject}&body=${body}`;
            
            // Only open mailto if URL isn't too long (some email clients have limits)
            if (mailtoLink.length < 2000) {
                window.open(mailtoLink, '_blank');
                console.log('📧 Email client opened');
                
                setTimeout(() => {
                    showNotification('� Email client opened with subscriber details!', 'info');
                }, 3000);
            }
        } catch (error) {
            console.warn('Email client opening failed:', error);
        }
    }, 1000);
}

function fallbackCopyMethod(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        console.log('📋 Fallback clipboard copy successful');
        setTimeout(() => {
            showNotification('📋 Subscriber info copied to clipboard!', 'info');
        }, 2000);
    } catch (error) {
        console.warn('All copy methods failed:', error);
    }
}

function storeSubscriber(email) {
    try {
        let subscribers = JSON.parse(localStorage.getItem('blogSubscribers') || '[]');
        
        // Check if already subscribed
        const alreadySubscribed = subscribers.some(sub => sub.email === email);
        if (!alreadySubscribed) {
            subscribers.push({
                email: email,
                date: new Date().toISOString(),
                source: 'blog-newsletter'
            });
            localStorage.setItem('blogSubscribers', JSON.stringify(subscribers));
            console.log('📧 New subscriber stored:', email);
            console.log('📊 Total subscribers:', subscribers.length);
        }
    } catch (error) {
        console.log('Storage not available, but subscription sent successfully');
    }
}

// Developer function to view subscribers
function showSubscribers() {
    try {
        const subscribers = JSON.parse(localStorage.getItem('blogSubscribers') || '[]');
        
        if (subscribers.length === 0) {
            alert('📧 No subscribers yet!\n\nTry subscribing to test the system.');
            return;
        }
        
        let message = `📊 Blog Subscribers (${subscribers.length}):\n\n`;
        subscribers.forEach((sub, index) => {
            const date = new Date(sub.date).toLocaleDateString();
            message += `${index + 1}. ${sub.email}\n   Subscribed: ${date}\n\n`;
        });
        
        message += '\nNote: These are stored locally in your browser.\nFor production, use a proper email service like MailChimp.';
        
        alert(message);
        
        // Also log to console for easy copying
        console.log('📧 Blog Subscribers:', subscribers);
        
    } catch (error) {
        alert('❌ Error accessing subscriber data');
    }
}

// Make function globally available
window.showSubscribers = showSubscribers;

// "Notify Me" button functionality
function initializeNotifyButton() {
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to newsletter section
            const newsletterSection = document.querySelector('.newsletter');
            if (newsletterSection) {
                newsletterSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Highlight the email input after scrolling
                setTimeout(() => {
                    const emailInput = document.querySelector('.newsletter-form input[type="email"]');
                    if (emailInput) {
                        emailInput.focus();
                        emailInput.style.borderColor = 'var(--accent-color)';
                        emailInput.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.2)';
                        
                        // Remove highlight after 3 seconds
                        setTimeout(() => {
                            emailInput.style.borderColor = '';
                            emailInput.style.boxShadow = '';
                        }, 3000);
                    }
                }, 800);
                
                showNotification('📧 Subscribe to my newsletter below to get notified!', 'info');
            } else {
                // Fallback - redirect to contact page
                window.location.href = 'index.html#contact';
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#DC2626' : '#0EA5E9'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Particle effect for blog hero
function initializeParticles() {
    const canvas = document.querySelector('.blog-hero-background canvas');
    if (!canvas) {
        // Create canvas for particles
        const heroBackground = document.querySelector('.blog-hero-background');
        if (heroBackground) {
            const newCanvas = document.createElement('canvas');
            newCanvas.style.width = '100%';
            newCanvas.style.height = '100%';
            heroBackground.appendChild(newCanvas);
            createParticleEffect(newCanvas);
        }
    } else {
        createParticleEffect(canvas);
    }
}

function createParticleEffect(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 10000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            ctx.fill();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }
    
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Set active navigation
function setActiveNavigation() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if ((currentPage.includes('blog.html') && link.textContent.trim() === 'Blog') ||
            (currentPage.includes('index.html') && link.textContent.trim() === 'Home') ||
            (currentPage === '/' && link.textContent.trim() === 'Home')) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Enhanced read more button interactions
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'translateX(5px)';
        }
    });
    
    btn.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'translateX(0)';
        }
    });
});

// Blog Modal Functionality
function initializeBlogModal() {
    console.log('🔧 Initializing blog modal...');
    
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const modal = document.getElementById('blogModal');
    const closeBtn = document.querySelector('.close-modal');
    const backBtn = document.querySelector('.back-to-blog');
    
    console.log('📊 Found elements:', {
        readMoreBtns: readMoreBtns.length,
        modal: !!modal,
        closeBtn: !!closeBtn,
        backBtn: !!backBtn
    });
    
    // Add click handlers to read more buttons
    readMoreBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            console.log(`🖱️ Read more button ${index + 1} clicked`);
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            openBlogModal(this);
            return false;
        });
    });
    
    // Close modal handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBlogModal);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', closeBlogModal);
    }
    
    // Close on background click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBlogModal();
            }
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeBlogModal();
        }
    });
}

function openBlogModal(button) {
    console.log('🔓 Opening blog modal...');
    
    const modal = document.getElementById('blogModal');
    const postCard = button.closest('.blog-post');
    
    console.log('📋 Modal elements:', {
        modal: !!modal,
        postCard: !!postCard,
        modalId: modal ? modal.id : 'not found'
    });
    
    if (!postCard || !modal) {
        console.error('❌ Missing elements for modal');
        return;
    }
    
    // Extract post data
    const title = postCard.querySelector('.post-title').textContent;
    const category = postCard.querySelector('.post-category').textContent;
    const date = postCard.querySelector('.post-date').textContent;
    const excerpt = postCard.querySelector('.post-excerpt').textContent;
    const tags = Array.from(postCard.querySelectorAll('.tag')).map(tag => tag.textContent);
    
    console.log('📝 Post data:', { title, category, date });
    
    // Get full content based on title/category
    const fullContent = getBlogPostContent(title, category, excerpt);
    
    // Populate modal
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-category').textContent = category;
    modal.querySelector('.modal-date').textContent = date;
    
    // Add tags
    const modalTags = modal.querySelector('.modal-tags');
    modalTags.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // Add content
    modal.querySelector('.modal-content-text').innerHTML = fullContent;
    
    // Show modal
    console.log('✨ Showing modal...');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    console.log('🎉 Modal should now be visible!');
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    }
}

function getBlogPostContent(title, category, excerpt) {
    console.log('📖 Getting content for:', title);
    
    // This function returns full blog post content based on the title
    // You can add your own blog posts here or load them from external files
    
    const blogPosts = {
        "How to Excel in Software Engineering at University: A Student's Guide": {
            content: `
                <p>Standing out as a Software Engineering student requires more than just good grades. Here are five proven strategies that have helped me differentiate myself in a competitive field:</p>
                
                <h2>1. Build Real Projects That Solve Actual Problems</h2>
                <p>Don't just build tutorial projects. Identify real problems around you and create solutions. My Premier League salary analysis project came from my genuine curiosity about sports economics, and it's generated more interest than any classroom assignment ever did.</p>
                <blockquote>"The best projects come from personal curiosity, not assignment requirements."</blockquote>
                
                <h2>2. Document Everything</h2>
                <p>Create detailed README files, write about your development process, and maintain clean, commented code. Employers love developers who can communicate their thinking clearly.</p>
                <ul>
                    <li>Use Git commits that tell a story</li>
                    <li>Write documentation as you code, not after</li>
                    <li>Create demo videos or screenshots</li>
                    <li>Explain your technology choices</li>
                </ul>
                
                <h2>3. Contribute to Open Source</h2>
                <p>Find beginner-friendly projects on GitHub and start contributing. Even small contributions like fixing typos or improving documentation can lead to meaningful connections and learning opportunities.</p>
                
                <h2>4. Network Authentically</h2>
                <p>Attend tech meetups, join online communities, and engage with content from professionals you admire. Don't just ask for help—offer value by sharing what you're learning.</p>
                
                <h2>5. Learn Beyond the Curriculum</h2>
                <p>University courses provide a foundation, but technology moves fast. Stay current with industry trends, learn popular frameworks, and understand the tools actually used in production environments.</p>
                
                <p>Remember, standing out isn't about being the smartest person in the room—it's about being the most curious, persistent, and helpful one.</p>
            `
        },
        "Building Your First Data Visualization Project": {
            content: `
                <p>Data visualization is one of the most rewarding skills you can develop as a computer science student. Here's how I approached my first major project and what I learned along the way.</p>
                
                <h2>Choosing the Right Dataset</h2>
                <p>The key to a successful data visualization project is picking data you're genuinely interested in. I chose Premier League player salaries because:</p>
                <ul>
                    <li>I'm passionate about football</li>
                    <li>The data tells an interesting story</li>
                    <li>It's publicly available and well-structured</li>
                    <li>There are multiple variables to explore</li>
                </ul>
                
                <h2>Tools and Technologies</h2>
                <p>For my project, I used Python with these key libraries:</p>
                <ul>
                    <li><code>pandas</code> - Data manipulation and cleaning</li>
                    <li><code>matplotlib</code> - Basic plotting capabilities</li>
                    <li><code>seaborn</code> - Beautiful statistical visualizations</li>
                    <li><code>numpy</code> - Numerical computations</li>
                </ul>
                
                <h2>The Analysis Process</h2>
                <h3>1. Data Collection and Cleaning</h3>
                <p>This is often 80% of the work. I spent considerable time ensuring data quality and handling missing values appropriately.</p>
                
                <h3>2. Exploratory Data Analysis (EDA)</h3>
                <p>Before creating any visualizations, I explored the data to understand patterns, outliers, and relationships between variables.</p>
                
                <h3>3. Creating Meaningful Visualizations</h3>
                <p>I focused on charts that told a story rather than just displaying data. Each visualization answered a specific question about player compensation in professional football.</p>
                
                <h2>Key Insights Discovered</h2>
                <blockquote>"The most expensive players aren't always the oldest, and experience doesn't guarantee the highest salary."</blockquote>
                
                <p>Through this project, I discovered fascinating patterns in how football clubs value talent, experience, and market positioning.</p>
                
                <h2>Lessons Learned</h2>
                <ul>
                    <li>Start with questions, not with tools</li>
                    <li>Clean data is crucial for accurate insights</li>
                    <li>Simple visualizations are often more effective than complex ones</li>
                    <li>Always validate your findings</li>
                </ul>
                
                <p>This project opened doors to internship opportunities and helped me understand the power of data storytelling. Your first project doesn't need to be perfect—it just needs to be complete and well-documented.</p>
            `
        },
        "Standing Out as a Student Developer": {
            content: `
                <p>In a sea of Computer Science graduates, how do you make yourself memorable to employers? Here are the unconventional strategies that work.</p>
                
                <h2>1. Solve Real Problems, Not Tutorial Problems</h2>
                <p>Stop building another todo app. Find a problem in your daily life or community and solve it. Real problems have messy data, unclear requirements, and unexpected challenges—exactly what employers want you to handle.</p>
                
                <h2>2. Document Your Journey</h2>
                <p>Share your failures and learning process, not just your successes. Employers love developers who can reflect on their work and communicate challenges clearly.</p>
                <blockquote>"Your debugging process is more impressive than your final code."</blockquote>
                
                <h2>3. Contribute to Open Source</h2>
                <p>Start small—fix typos, improve documentation, or add simple features. Open source contributions show you can work with existing codebases and collaborate with others.</p>
                
                <h2>4. Build Your Personal Brand</h2>
                <p>Create content about what you're learning. Write blog posts, make videos, or give talks at local meetups. Teaching others solidifies your own knowledge.</p>
                
                <h2>5. Network Authentically</h2>
                <p>Don't just ask for jobs—offer value. Share interesting articles, comment thoughtfully on LinkedIn posts, and help others in online communities.</p>
                
                <p>Remember: Standing out isn't about being the smartest—it's about being the most curious, helpful, and authentic version of yourself.</p>
            `
        },
        "Balancing Academics and Side Projects": {
            content: `
                <p>How I manage to maintain good grades while working on personal projects that build my portfolio and attract potential employers.</p>
                
                <h2>The 70-30 Rule</h2>
                <p>I dedicate 70% of my study time to coursework and 30% to personal projects. This ensures academic success while continuously building my portfolio.</p>
                
                <h2>Smart Project Selection</h2>
                <p>Choose projects that complement your coursework. If you're studying algorithms, build a sorting visualizer. Learning databases? Create a personal finance tracker.</p>
                <blockquote>"The best projects solve two problems: your assignment requirements and a real-world need."</blockquote>
                
                <h2>Time Management Strategies</h2>
                <ul>
                    <li>Use university breaks for bigger projects</li>
                    <li>Work on projects during lighter course loads</li>
                    <li>Set realistic deadlines and stick to them</li>
                    <li>Document everything for future reference</li>
                </ul>
                
                <h2>Making Projects Count</h2>
                <p>Every project should teach you something new and be portfolio-worthy. Deploy your work, write good documentation, and be ready to explain your technical choices.</p>
                
                <p>The key is consistency over intensity. Small, regular progress beats sporadic bursts of activity.</p>
            `
        },
        "Essential Tools Every CS Student Should Know": {
            content: `
                <p>A curated list of tools, frameworks, and resources that have significantly improved my productivity and learning efficiency as a Software Engineering student.</p>
                
                <h2>Development Environment</h2>
                <h3>Visual Studio Code + Extensions</h3>
                <p>The most versatile code editor with an ecosystem of extensions for every language and framework.</p>
                
                <h2>Version Control</h2>
                <h3>Git & GitHub</h3>
                <p>Essential for any developer. Learn it early, use it for everything, even personal assignments.</p>
                <blockquote>"If it's not in Git, it doesn't exist."</blockquote>
                
                <h2>Productivity Tools</h2>
                <ul>
                    <li><strong>Notion:</strong> Note-taking and project planning</li>
                    <li><strong>Postman:</strong> API testing and development</li>
                    <li><strong>Docker:</strong> Consistent development environments</li>
                    <li><strong>Figma:</strong> UI/UX design and prototyping</li>
                </ul>
                
                <h2>Cloud Services</h2>
                <h3>Deployment Platforms</h3>
                <p>Netlify, Vercel, or GitHub Pages for static sites. Heroku or Railway for full-stack applications.</p>
                
                <h2>Learning Resources</h2>
                <ul>
                    <li>MDN Web Docs for web development</li>
                    <li>Stack Overflow for problem-solving</li>
                    <li>YouTube for visual learners</li>
                    <li>Official documentation (always start here)</li>
                </ul>
                
                <p>Focus on mastering a few tools rather than trying everything. Quality over quantity always wins.</p>
            `
        },
        "From Idea to GitHub: My Project Development Process": {
            content: `
                <p>Behind the scenes look at how I approach personal projects, from initial concept to deployment and documentation. Includes my mistakes and lessons learned.</p>
                
                <h2>Phase 1: Ideation</h2>
                <p>Ideas come from personal frustrations or genuine curiosity. I keep a running list and revisit it when starting new projects.</p>
                
                <h2>Phase 2: Planning</h2>
                <h3>Key Questions:</h3>
                <ul>
                    <li>Does this already exist?</li>
                    <li>What will I learn building this?</li>
                    <li>What's the minimal viable version?</li>
                    <li>How will I measure success?</li>
                </ul>
                
                <h2>Phase 3: Development</h2>
                <p>I use feature branches, write descriptive commit messages, and deploy early and often. Code reviews with peers help catch issues early.</p>
                <blockquote>"Ship early, iterate based on feedback."</blockquote>
                
                <h2>Phase 4: Documentation</h2>
                <p>Every project gets a comprehensive README with setup instructions, usage examples, and technology explanations.</p>
                
                <h2>Phase 5: Reflection</h2>
                <p>I document what I learned, what I'd do differently, and ideas for future improvements. This reflection is as valuable as the code itself.</p>
                
                <h2>Common Mistakes</h2>
                <ul>
                    <li>Scope creep—adding features before finishing core functionality</li>
                    <li>Perfect code syndrome—endless refactoring instead of shipping</li>
                    <li>Poor documentation—forgetting how my own code works</li>
                </ul>
                
                <p>Remember: Done is better than perfect. Your first version teaches you what to build in your second version.</p>
            `
        },
        "5 Essential VS Code Extensions for Computer Science Students": {
            content: `
                <p>As a Computer Science student, your development environment can make or break your productivity. Here are five VS Code extensions that have transformed how I write code and manage projects:</p>
                
                <h2>1. Prettier - Code Formatter</h2>
                <p>Stop worrying about code formatting and let Prettier handle it automatically. This extension ensures consistent code style across all your projects.</p>
                <ul>
                    <li>Automatically formats on save</li>
                    <li>Supports multiple languages</li>
                    <li>Integrates with team coding standards</li>
                    <li>Saves time during code reviews</li>
                </ul>
                
                <h2>2. GitLens — Git Supercharged</h2>
                <p>GitLens transforms VS Code's Git capabilities by providing rich visualizations and insights into your repository's history.</p>
                <blockquote>"Understanding your code's history is as important as understanding your code's future."</blockquote>
                
                <h3>Key Features:</h3>
                <ul>
                    <li>Blame annotations directly in your editor</li>
                    <li>Repository and file history explorer</li>
                    <li>Compare changes between branches</li>
                    <li>Commit graph and timeline</li>
                </ul>
                
                <h2>3. Live Server</h2>
                <p>Essential for web development projects. Live Server launches a local server with live reload capability for static and dynamic pages.</p>
                
                <h2>4. Python Extension Pack</h2>
                <p>If you're working with Python (which you probably are as a CS student), this extension pack includes everything you need:</p>
                <ul>
                    <li>IntelliSense and autocomplete</li>
                    <li>Integrated debugging</li>
                    <li>Jupyter notebook support</li>
                    <li>Linting and error detection</li>
                </ul>
                
                <h2>5. Thunder Client</h2>
                <p>A lightweight REST API client that runs directly in VS Code. Perfect for testing APIs without leaving your development environment.</p>
                
                <h3>Why Thunder Client beats Postman for students:</h3>
                <ul>
                    <li>No separate application needed</li>
                    <li>Lightweight and fast</li>
                    <li>Perfect for quick API testing</li>
                    <li>Integrates with your workspace</li>
                </ul>
                
                <h2>Bonus Tips for Extension Management</h2>
                <p>Don't install too many extensions at once. Start with these five essentials and add others as you identify specific needs. Too many extensions can slow down VS Code and create conflicts.</p>
                
                <h3>Pro Tip: Create Extension Packs</h3>
                <p>Once you've identified your essential extensions, create custom extension packs for different types of projects (web development, Python data science, etc.).</p>
                
                <p>These extensions have saved me countless hours and made coding much more enjoyable. Install them one at a time and take time to learn their features—you'll be amazed at how much more productive you become!</p>
            `
        },
        // Add more blog posts as needed
        "default": {
            content: `
                <p>${excerpt}</p>
                
                <h2>Full Article Coming Soon</h2>
                <p>This blog post is currently being written and will be available soon. The excerpt above gives you a preview of what to expect.</p>
                
                <p>In the meantime, feel free to:</p>
                <ul>
                    <li>Check out my other blog posts</li>
                    <li>Explore my project portfolio</li>
                    <li>Connect with me on LinkedIn or GitHub</li>
                    <li>Subscribe to my newsletter for updates</li>
                </ul>
                
                <blockquote>"Great content takes time to create. Thank you for your patience!"</blockquote>
                
                <p>If you have specific questions about this topic or suggestions for what you'd like me to cover, please reach out through the contact form on my main portfolio page.</p>
            `
        }
    };
    
    const content = blogPosts[title] ? blogPosts[title].content : blogPosts["default"].content;
    console.log('📄 Content found:', !!content);
    return content;
}
