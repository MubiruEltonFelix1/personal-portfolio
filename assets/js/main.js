document.addEventListener('DOMContentLoaded', () => {
    setupActiveNav();
    setupMobileNav();
    setupReveal();
    setupGalleryModal();
    setupQuickMessage();
    setupContactForm();
    initializeCommunityCarousel();
});

const CONTACT_WHATSAPP = '256780204995';
const CONTACT_EMAIL = 'mubirufelixelton@gmail.com';

function setupActiveNav() {
    const path = window.location.pathname.toLowerCase();
    let key = 'home';

    if (path.includes('/about/')) key = 'about';
    else if (path.includes('/projects/')) key = 'projects';
    else if (path.includes('/gallery/')) key = 'gallery';
    else if (path.includes('/contact/')) key = 'contact';

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.key === key);
    });
}

function initializeCommunityCarousel() {
    const carousel = document.querySelector('[data-carousel="community-roles"]');

    if (!carousel) {
        return;
    }

    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const intervalMs = 4000;

    if (!track || !slides.length) {
        return;
    }

    let activeIndex = 0;
    let intervalId = null;

    const render = () => {
        track.style.transform = `translateX(-${activeIndex * 100}%)`;

        slides.forEach((slide, index) => {
            slide.classList.toggle('is-active', index === activeIndex);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('is-active', index === activeIndex);
            dot.setAttribute('aria-pressed', index === activeIndex ? 'true' : 'false');
        });
    };

    const goToSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;
        render();
    };

    const nextSlide = () => goToSlide(activeIndex + 1);
    const prevSlide = () => goToSlide(activeIndex - 1);

    const startAutoplay = () => {
        stopAutoplay();
        intervalId = window.setInterval(nextSlide, intervalMs);
    };

    const stopAutoplay = () => {
        if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = null;
        }
    };

    if (prevButton) {
        prevButton.addEventListener('click', prevSlide);
    }

    if (nextButton) {
        nextButton.addEventListener('click', nextSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    render();
    startAutoplay();
}
});
}

function setupMobileNav() {
    const button = document.getElementById('menuToggle');
    const menu = document.getElementById('mainNavLinks');
    if (!button || !menu) return;

    button.addEventListener('click', () => {
        menu.classList.toggle('open');
    });
}

function setupReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }
    );

    revealElements.forEach(element => observer.observe(element));
}

function setupGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('galleryModalImage');
    if (!modal || !modalImage) return;

    document.querySelectorAll('.gallery-item img').forEach(image => {
        image.addEventListener('click', () => {
            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modal.classList.add('open');
        });
    });

    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => modal.classList.remove('open'));
    }

    modal.addEventListener('click', event => {
        if (event.target === modal) modal.classList.remove('open');
    });
}

function openWhatsAppOrFallbackToEmail({ name = '', email = '', message = '', subject = 'Portfolio Message' }) {
    const composedMessage = [
            name ? `Name: ${name}` : '',
            email ? `Email: ${email}` : '',
            '',
            message || 'Hello Mubiru, I would like to connect.'
        ]
        .filter(Boolean)
        .join('\n');

    const whatsappUrl = `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(composedMessage)}`;
    const popup = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    if (!popup) {
        const mailSubject = encodeURIComponent(subject);
        const mailBody = encodeURIComponent(composedMessage);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${mailSubject}&body=${mailBody}`;
    }
}

function setupQuickMessage() {
    const quickMessageLink = document.getElementById('quickMessageLink');
    if (!quickMessageLink) return;

    quickMessageLink.addEventListener('click', event => {
        event.preventDefault();
        openWhatsAppOrFallbackToEmail({
            subject: 'Portfolio Quick Message',
            message: 'Hello Mubiru, I would like to discuss a collaboration opportunity.'
        });
    });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name || !email || !message) return;

        openWhatsAppOrFallbackToEmail({
            name,
            email,
            message,
            subject: `Portfolio inquiry from ${name}`
        });
    });
}