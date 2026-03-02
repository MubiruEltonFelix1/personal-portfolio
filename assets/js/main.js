document.addEventListener('DOMContentLoaded', () => {
    setupActiveNav();
    setupMobileNav();
    setupReveal();
    setupGalleryModal();
    setupContactForm();
});

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

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const name = form.querySelector('[name="name"]').value.trim();
        const email = form.querySelector('[name="email"]').value.trim();
        const message = form.querySelector('[name="message"]').value.trim();

        if (!name || !email || !message) return;

        const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:mubirufelixelton@gmail.com?subject=${subject}&body=${body}`;
    });
}