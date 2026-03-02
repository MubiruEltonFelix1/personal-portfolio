(function () {
    const root = document.body.dataset.root || '';
    const navTarget = document.getElementById('site-nav');
    const footerTarget = document.getElementById('site-footer');

    const links = [
        { href: `${root}index.html`, label: 'Home', key: 'home' },
        { href: `${root}about/`, label: 'About', key: 'about' },
        { href: `${root}projects/`, label: 'Projects', key: 'projects' },
        { href: `${root}gallery/`, label: 'Gallery', key: 'gallery' },
        { href: `${root}contact/`, label: 'Contact', key: 'contact' }
    ];

    if (navTarget) {
        navTarget.innerHTML = `
            <nav class="site-nav">
                <div class="nav-inner">
                    <a class="brand" href="${root}index.html">
                        <img src="${root}assets/images/logo.png" alt="Logo">
                        <span>Mubiru Elton Felix</span>
                    </a>
                    <button class="menu-toggle" aria-label="Toggle Menu" id="menuToggle">Menu</button>
                    <ul class="nav-links" id="mainNavLinks">
                        ${links.map(link => `<li><a class="nav-link" data-key="${link.key}" href="${link.href}">${link.label}</a></li>`).join('')}
                    </ul>
                </div>
            </nav>
        `;
    }

    if (footerTarget) {
        footerTarget.innerHTML = `
            <footer class="site-footer">
                <div class="container">
                    <p>© 2026 Mubiru Elton Felix · Data Engineering & Software Engineering Portfolio</p>
                </div>
            </footer>
        `;
    }
})();