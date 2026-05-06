(function() {
        const root = document.body.dataset.root || '';
        const navTarget = document.getElementById('site-nav');
        const footerTarget = document.getElementById('site-footer');

        const links = [
            { href: `${root}index.html`, label: 'Home', key: 'home' },
            { href: `${root}about/index.html`, label: 'About', key: 'about' },
            { href: `${root}projects/index.html`, label: 'Projects', key: 'projects' },
            { href: `${root}gallery/index.html`, label: 'Gallery', key: 'gallery' },
            { href: `${root}contact/index.html`, label: 'Contact', key: 'contact' }
        ];

        if (navTarget) {
            navTarget.innerHTML = `
            <nav class="site-nav">
                <div class="nav-inner">
                    <a class="brand" href="${root}index.html">
                        <span class="pulse-dot"></span>
                        <span class="brand-text">MEF</span>
                    </a>
                    <button class="menu-toggle" aria-label="Toggle Menu" id="menuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-links" id="mainNavLinks">
                        ${links.map(link => `<li><a class="nav-link" data-key="${link.key}" href="${link.href}">${link.label}</a></li>`).join('')}
                    </ul>
                </div>
            </nav>
        `;
            
            // Add click handler for menu toggle
            const menuToggle = navTarget.querySelector('#menuToggle');
            const navLinks = navTarget.querySelector('.nav-links');
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    menuToggle.classList.toggle('active');
                    navLinks.classList.toggle('active');
                    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
                });
                
                // Close menu on link click
                navTarget.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', function() {
                        menuToggle.classList.remove('active');
                        navLinks.classList.remove('active');
                        document.body.style.overflow = '';
                    });
                });
            }
        }

        if (footerTarget) {
            footerTarget.innerHTML = `
            <footer class="site-footer">
                <div class="footer-inner">
                    <a class="footer-brand" href="${root}index.html">
                        <span class="brand-text" style="font-family:var(--font-display);color:var(--color-yellow)">MEF</span>
                    </a>
                    <span class="footer-text">Tech Community · MUST</span>
                    <span class="footer-copyright">© 2026 Mubiru Elton Felix</span>
                </div>
            </footer>
        `;
        }
})();