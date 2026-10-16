document.addEventListener('DOMContentLoaded', () => {
    const pageUrl = 'https://mubirueltonfelix.com/workshop/';
    const toast = document.createElement('div');
    toast.className = 'workshop-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('is-visible');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
    };

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard');
        } catch (error) {
            const helper = document.createElement('textarea');
            helper.value = text;
            helper.style.position = 'fixed';
            helper.style.opacity = '0';
            document.body.appendChild(helper);
            helper.select();
            document.execCommand('copy');
            helper.remove();
            showToast('Copied to clipboard');
        }
    };

    document.querySelectorAll('[data-copy]').forEach((button) => {
        button.addEventListener('click', () => copyText(button.dataset.copy));
    });
    document.querySelectorAll('[data-copy-link]').forEach((button) => {
        button.addEventListener('click', () => copyText(pageUrl));
    });

    document.querySelectorAll('[data-page-url]').forEach((node) => {
        node.textContent = pageUrl.replace('https://', '');
    });

    const search = document.querySelector('#command-search');
    const commandCards = [...document.querySelectorAll('.command-card')];
    const commandRows = [...document.querySelectorAll('.command-table > div')];
    const noResults = document.querySelector('.no-results');
    search?.addEventListener('input', () => {
        const query = search.value.trim().toLowerCase();
        let matches = 0;
        [...commandCards, ...commandRows].forEach((item) => {
            const visible = !query || item.textContent.toLowerCase().includes(query);
            item.hidden = !visible;
            if (visible) matches += 1;
        });
        if (noResults) noResults.hidden = matches > 0;
    });

    const tabs = [...document.querySelectorAll('.contribution-tab')];
    const panels = [...document.querySelectorAll('.contribution-panel')];
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach((item) => {
                const active = item === tab;
                item.classList.toggle('is-active', active);
                item.setAttribute('aria-selected', String(active));
            });
            panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.panel === target));
        });
    });

    const tocLinks = [...document.querySelectorAll('.toc a')];
    const sections = tocLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const updateToc = () => {
        const current = sections.reduce((active, section) => {
            if (section.getBoundingClientRect().top <= 150) return section.id;
            return active;
        }, sections[0]?.id);
        tocLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`));
    };
    window.addEventListener('scroll', updateToc, { passive: true });
    updateToc();
});
