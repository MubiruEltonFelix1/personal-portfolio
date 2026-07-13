(function() {
        const root = document.body.dataset.root || '';
        const navTarget = document.getElementById('site-nav');
        const footerTarget = document.getElementById('site-footer');

        const links = [
            { href: `${root}index.html`, label: 'Home', key: 'home' },
            { href: `${root}gallery/index.html`, label: 'Events', key: 'events' },
            { href: `${root}projects/index.html`, label: 'Projects', key: 'projects' },
            { href: `${root}blog/index.html`, label: 'Blog', key: 'blog' },
            { href: `${root}tools/index.html`, label: 'Tools', key: 'tools' },
            { href: `${root}about/index.html`, label: 'About', key: 'about' },
            { href: `${root}contact/index.html`, label: 'Contact', key: 'contact' }
        ];

        if (navTarget) {
            navTarget.innerHTML = `
            <nav class="site-nav">
                <div class="nav-inner">
                    <a class="brand nav-brand" href="${root}index.html">
                        <img src="${root}assets/images/logo.png" alt="MEF" class="logo-icon" />
                        <span class="brand-text">MEF</span>
                    </a>
                    <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </button>
                    <ul class="nav-links" id="nav-links">
                        ${links.map(link => `<li><a class="nav-link" data-key="${link.key}" href="${link.href}">${link.label}</a></li>`).join('')}
                    </ul>
                </div>
            </nav>
        `;
        }

        if (footerTarget) {
            footerTarget.innerHTML = `
            <footer class="site-footer">
                <div class="footer-content">
                    <div class="footer-section footer-brand-sec">
                        <a class="footer-brand" href="${root}index.html">
                            <span class="brand-text" style="font-family:var(--font-display);color:var(--color-yellow);font-size:20px;">MEF</span>
                        </a>
                        <p class="footer-tagline">Crafting scalable systems & data solutions</p>
                    </div>
                    <div class="footer-section footer-nav-sec">
                        <h4 class="footer-heading">Quick Links</h4>
                        <ul class="footer-links">
                            <li><a href="${root}about/index.html">About</a></li>
                            <li><a href="${root}tools/index.html">Tools</a></li>
                            <li><a href="${root}projects/index.html">Projects</a></li>
                            <li><a href="${root}contact/index.html">Contact</a></li>
                            <li><a href="${root}blog/index.html">Blog</a></li>
                        </ul>
                    </div>
                    <div class="footer-section footer-social-sec">
                        <h4 class="footer-heading">Connect</h4>
                        <div class="social-links">
                            <a href="https://github.com/MubiruEltonFelix1" target="_blank" rel="noopener noreferrer" title="GitHub">GitHub</a>
                            <a href="https://www.linkedin.com/in/mubiru-elton-felix-9ab50a1b0/" target="_blank" rel="noopener noreferrer" title="LinkedIn">LinkedIn</a>
                            <a href="https://www.tiktok.com/@mubirueltonfelix1" target="_blank" rel="noopener noreferrer" title="TikTok">TikTok</a>
                        </div>
                    </div>
                </div>
                <div class="footer-divider"></div>
                <div class="footer-bottom">
                    <span class="footer-text">Tech Community Lead · MUST</span>
                    <span class="footer-copyright">© 2026 Mubiru Elton Felix. All rights reserved.</span>
                </div>
            </footer>
        `;
        }
})();