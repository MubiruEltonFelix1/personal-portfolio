// About Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Scroll animations
    initScrollAnimations();
    
    // Floating icons animation
    initFloatingIcons();
    
    // Timeline animations
    initTimelineAnimations();
    
    // Counter animations
    initCounterAnimations();
    
    // Social card hover effects
    initSocialCardEffects();
    
    // Particle background
    initParticleBackground();
});

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .story-section,
        .values-section,
        .value-card,
        .timeline-item,
        .fact-card,
        .social-card
    `);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Floating Icons Animation
function initFloatingIcons() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random movement
        const animateIcon = () => {
            const randomX = Math.random() * 10 - 5;
            const randomY = Math.random() * 10 - 5;
            const randomRotation = Math.random() * 20 - 10;
            
            icon.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
            
            setTimeout(() => {
                icon.style.transform = 'translate(0px, 0px) rotate(0deg)';
            }, 2000);
        };
        
        // Start animation with delay
        setTimeout(() => {
            animateIcon();
            setInterval(animateIcon, 4000 + index * 1000);
        }, index * 500);
    });
}

// Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-timeline');
                
                // Animate the icon
                const icon = entry.target.querySelector('.timeline-icon');
                if (icon) {
                    setTimeout(() => {
                        icon.style.animation = 'bounceIn 0.6s ease-out';
                    }, 300);
                }
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
    
    // Add CSS for timeline animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
        }
        
        .animate-timeline .timeline-content {
            animation: slideInContent 0.8s ease-out;
        }
        
        @keyframes slideInContent {
            0% { 
                opacity: 0;
                transform: translateX(-30px);
            }
            100% { 
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.fact-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const suffix = element.textContent.replace(/[\d]/g, '');
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 20);
}

// Social Card Effects
function initSocialCardEffects() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 20px 60px rgba(0, 212, 255, 0.3)';
            
            // Animate icon
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
            
            // Animate arrow
            const arrow = this.querySelector('.social-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(10px) rotate(45deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            
            const icon = this.querySelector('.social-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            const arrow = this.querySelector('.social-arrow');
            if (arrow) {
                arrow.style.transform = 'translateX(0) rotate(0deg)';
            }
        });
    });
}

// Particle Background
function initParticleBackground() {
    const heroSection = document.querySelector('.about-hero');
    if (!heroSection) return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.1';
    canvas.style.zIndex = '1';
    
    heroSection.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 3 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#00d4ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particle.x - particles[j].x;
                const dy = particle.y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.save();
                    ctx.globalAlpha = (100 - distance) / 100 * 0.1;
                    ctx.strokeStyle = '#00d4ff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate elements on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .social-links-hero');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});

// Add CSS for loading states
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .hero-title,
    .hero-subtitle,
    .social-links-hero {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    body.loaded .hero-title,
    body.loaded .hero-subtitle,
    body.loaded .social-links-hero {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(loadingStyles);
