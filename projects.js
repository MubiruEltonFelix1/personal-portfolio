// Projects Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const loadMoreBtn = document.querySelector('.load-more-btn');

    // Initial setup
    let visibleProjects = 6;
    showProjects(visibleProjects);

    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects with animation
            filterProjects(filterValue);
        });
    });

    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleProjects += 3;
            showProjects(visibleProjects);
            
            // Hide load more button if all projects are visible
            if (visibleProjects >= projectCards.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // Filter projects function
    function filterProjects(filter) {
        projectCards.forEach((card, index) => {
            const categories = card.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                // Show project with delay for stagger effect
                setTimeout(() => {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                }, index * 100);
            } else {
                // Hide project
                card.classList.add('hidden');
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Reset load more functionality
        visibleProjects = 6;
        setTimeout(() => {
            showProjects(visibleProjects);
        }, 500);
    }

    // Show projects function
    function showProjects(count) {
        let visibleCount = 0;
        
        projectCards.forEach((card, index) => {
            if (card.style.display !== 'none') {
                if (visibleCount < count) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            }
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            const totalVisible = Array.from(projectCards).filter(card => 
                card.style.display !== 'none' || !card.classList.contains('hidden')
            ).length;
            
            if (visibleCount >= totalVisible) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
    }

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
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

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.tech-category, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Project card hover effects
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add subtle animation to other cards
            projectCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.7';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            // Reset all cards
            projectCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
            });
        });
    });

    // Add loading states for external links
    const externalLinks = document.querySelectorAll('.project-link[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add loading state
            const originalContent = link.innerHTML;
            link.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Reset after short delay (for demo purposes)
            setTimeout(() => {
                link.innerHTML = originalContent;
            }, 1000);
        });
    });

    // Keyboard navigation for filter buttons
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', (e) => {
            let nextIndex;
            
            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    nextIndex = (index + 1) % filterButtons.length;
                    filterButtons[nextIndex].focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    nextIndex = index === 0 ? filterButtons.length - 1 : index - 1;
                    filterButtons[nextIndex].focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    button.click();
                    break;
            }
        });
    });

    // Add search functionality (basic)
    function addSearchFunctionality() {
        // Create search input
        const searchHTML = `
            <div class="search-container" style="margin-bottom: 2rem; text-align: center;">
                <input type="text" id="project-search" placeholder="Search projects..." 
                       style="padding: 0.8rem 1.5rem; border-radius: 25px; border: 1px solid rgba(255,255,255,0.1); 
                              background: var(--card-bg); color: var(--text-primary); width: 300px; max-width: 100%;">
            </div>
        `;
        
        const filterContainer = document.querySelector('.filter-container');
        if (filterContainer) {
            filterContainer.insertAdjacentHTML('afterbegin', searchHTML);
            
            const searchInput = document.getElementById('project-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    
                    projectCards.forEach(card => {
                        const title = card.querySelector('.project-title').textContent.toLowerCase();
                        const description = card.querySelector('.project-description').textContent.toLowerCase();
                        const techTags = Array.from(card.querySelectorAll('.tech-tag'))
                                            .map(tag => tag.textContent.toLowerCase());
                        
                        const matchesSearch = title.includes(searchTerm) || 
                                            description.includes(searchTerm) ||
                                            techTags.some(tech => tech.includes(searchTerm));
                        
                        if (matchesSearch) {
                            card.style.display = 'block';
                            card.classList.remove('hidden');
                        } else {
                            card.style.display = 'none';
                            card.classList.add('hidden');
                        }
                    });
                });
            }
        }
    }

    // Initialize search functionality
    addSearchFunctionality();
});

// Utility function for smooth animations
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue + (element.textContent.includes('+') ? '+' : '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate hero stats when they come into view
const heroStats = document.querySelectorAll('.stat-number');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            const finalValue = parseInt(statNumber.textContent);
            animateValue(statNumber, 0, finalValue, 2000);
            heroObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

heroStats.forEach(stat => heroObserver.observe(stat));
