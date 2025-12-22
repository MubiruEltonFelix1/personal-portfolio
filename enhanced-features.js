// Enhanced Portfolio Features JavaScript

// GitHub Integration
class GitHubIntegration {
    constructor(username) {
        this.username = username;
        this.apiBase = 'https://api.github.com';
    }

    async fetchGitHubData() {
        try {
            const [userResponse, reposResponse] = await Promise.all([
                fetch(`${this.apiBase}/users/${this.username}`),
                fetch(`${this.apiBase}/users/${this.username}/repos?sort=updated&per_page=10`)
            ]);

            const userData = await userResponse.json();
            const reposData = await reposResponse.json();

            this.updateGitHubStats(userData, reposData);
            this.updateFeaturedRepos(reposData);
        } catch (error) {
            console.log('GitHub API rate limit reached or network error:', error);
            this.showFallbackData();
        }
    }

    updateGitHubStats(userData, reposData) {
        const reposElement = document.getElementById('github-repos');
        const commitsElement = document.getElementById('github-commits');
        const languagesElement = document.getElementById('github-languages');

        if (reposElement) reposElement.textContent = userData.public_repos || '5+';
        if (commitsElement) commitsElement.textContent = '200+';
        
        // Count unique languages
        const languages = new Set();
        reposData.forEach(repo => {
            if (repo.language) languages.add(repo.language);
        });
        if (languagesElement) languagesElement.textContent = languages.size || '5+';
    }

    updateFeaturedRepos(reposData) {
        const featuredReposElement = document.getElementById('featured-repos');
        if (!featuredReposElement) return;

        // Filter and sort repos by stars and recent activity
        const featuredRepos = reposData
            .filter(repo => !repo.fork)
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, 3);

        const repoHTML = featuredRepos.map(repo => `
            <div class="repo-item">
                <h4 class="repo-name">${repo.name}</h4>
                <p class="repo-description">${repo.description || 'No description available'}</p>
                <div class="repo-stats">
                    <span class="repo-language">${repo.language || 'Mixed'}</span>
                    <span class="repo-stars">⭐ ${repo.stargazers_count || 0}</span>
                </div>
            </div>
        `).join('');

        featuredReposElement.innerHTML = repoHTML;
    }

    showFallbackData() {
        // Show default data when API is unavailable
        const reposElement = document.getElementById('github-repos');
        const commitsElement = document.getElementById('github-commits');
        const languagesElement = document.getElementById('github-languages');

        if (reposElement) reposElement.textContent = '5+';
        if (commitsElement) commitsElement.textContent = '200+';
        if (languagesElement) languagesElement.textContent = '5+';
    }
}

// Project Demo System
class ProjectDemoSystem {
    constructor() {
        this.demos = {
            'premier-league': {
                title: 'Premier League Age vs Salary Analysis',
                content: this.generatePremierLeagueDemo()
            }
        };
    }

    generatePremierLeagueDemo() {
        return `
            <div class="demo-container">
                <h4>Interactive Data Visualization Demo</h4>
                <p>This project analyzes the relationship between Premier League players' ages and salaries using real-world data.</p>
                
                <div class="demo-section">
                    <h5>📊 Key Findings</h5>
                    <ul>
                        <li>Peak salary age: 27-29 years</li>
                        <li>Significant variation within age groups</li>
                        <li>Strategic investment opportunities identified</li>
                    </ul>
                </div>
                
                <div class="demo-section">
                    <h5>🔧 Technical Implementation</h5>
                    <div class="code-snippet">
                        <pre><code>import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load and clean the data
df = pd.read_csv('premier_league_data.csv')
df_clean = df.dropna()

# Create correlation analysis
correlation = df_clean['age'].corr(df_clean['salary'])
print(f"Age-Salary Correlation: {correlation:.3f}")

# Generate visualization
plt.figure(figsize=(12, 8))
sns.scatterplot(data=df_clean, x='age', y='salary', 
                hue='position', size='market_value')
plt.title('Premier League: Age vs Salary Analysis')
plt.show()</code></pre>
                    </div>
                </div>
                
                <div class="demo-section">
                    <h5>📈 Sample Visualization</h5>
                    <div class="chart-placeholder">
                        <div class="chart-mock">
                            <div class="axis-label">Salary (£M)</div>
                            <div class="data-points">
                                <div class="point" style="left: 20%; bottom: 30%"></div>
                                <div class="point" style="left: 40%; bottom: 60%"></div>
                                <div class="point" style="left: 60%; bottom: 80%"></div>
                                <div class="point" style="left: 80%; bottom: 50%"></div>
                            </div>
                            <div class="axis-label bottom">Age</div>
                        </div>
                    </div>
                </div>
                
                <div class="demo-actions">
                    <a href="https://github.com/MubiruEltonFelix1/premier-league-age-salary-visualization" 
                       target="_blank" class="btn btn-primary">
                        <i class="fab fa-github"></i> View Full Project
                    </a>
                </div>
            </div>
        `;
    }

    showDemo(projectId) {
        const modal = document.getElementById('project-demo-modal');
        const title = document.getElementById('demo-title');
        const body = document.getElementById('demo-body');

        if (this.demos[projectId]) {
            title.textContent = this.demos[projectId].title;
            body.innerHTML = this.demos[projectId].content;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeDemo() {
        const modal = document.getElementById('project-demo-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Social Media Integration
class SocialMediaIntegration {
    constructor() {
        this.platforms = {
            github: 'https://github.com/MubiruEltonFelix1',
            linkedin: 'https://www.linkedin.com/in/mubiru-elton-felix-9ab50a1b0/',
            youtube: 'https://www.youtube.com/c/EltonLyricalGenius',
            tiktok: 'https://www.tiktok.com/@mubirueltonfelix1'
        };
    }

    trackSocialClicks() {
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const platform = this.identifyPlatform(link.href);
                this.logSocialClick(platform);
            });
        });
    }

    identifyPlatform(url) {
        if (url.includes('github.com')) return 'github';
        if (url.includes('linkedin.com')) return 'linkedin';
        if (url.includes('youtube.com')) return 'youtube';
        if (url.includes('tiktok.com')) return 'tiktok';
        return 'other';
    }

    logSocialClick(platform) {
        console.log(`Social media click tracked: ${platform}`);
        // You can add analytics tracking here
    }
}

// Initialize all systems
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GitHub integration
    const github = new GitHubIntegration('MubiruEltonFelix1');
    github.fetchGitHubData();

    // Initialize project demo system
    const demoSystem = new ProjectDemoSystem();
    window.showProjectDemo = (projectId) => demoSystem.showDemo(projectId);
    window.closeProjectDemo = () => demoSystem.closeDemo();

    // Close modal when clicking outside
    document.getElementById('project-demo-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            demoSystem.closeDemo();
        }
    });

    // Initialize social media tracking
    const socialMedia = new SocialMediaIntegration();
    socialMedia.trackSocialClicks();

    // Animate GitHub stats on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const githubSection = document.getElementById('github-stats');
    if (githubSection) {
        statsObserver.observe(githubSection);
    }

    function animateStats() {
        const metrics = document.querySelectorAll('.metric-value');
        metrics.forEach(metric => {
            const finalValue = metric.textContent;
            if (!isNaN(finalValue)) {
                animateNumber(metric, 0, parseInt(finalValue), 2000);
            }
        });
    }

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
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
});

// AI Portfolio Assistant
class PortfolioAssistant {
    constructor() {
        this.isOpen = false;
        this.knowledgeBase = this.buildKnowledgeBase();
        this.bindEvents();
    }

    initializeElements() {
        this.toggle = document.getElementById('assistantToggle');
        this.chat = document.getElementById('assistantChat');
        this.closeBtn = document.getElementById('closeChat');
        this.messagesContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.quickQuestions = document.querySelectorAll('.quick-question');
        
        // Check if essential elements exist
        if (!this.toggle || !this.chat) {
            console.error('AI Assistant: Essential elements not found');
            return false;
        }
        return true;
    }

    bindEvents() {
        // Only bind events if elements exist
        if (!this.initializeElements()) {
            return;
        }
        
        this.toggle.addEventListener('click', () => this.toggleChat());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeChat());
        if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.sendMessage());
        if (this.input) {
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }

        this.quickQuestions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.sendMessage(e.target.textContent);
            });
        });
    }

    buildKnowledgeBase() {
        return {
            skills: {
                keywords: ['skills', 'technologies', 'programming', 'tech stack', 'languages', 'frameworks'],
                response: "I have expertise in multiple programming languages and frameworks including:\n\n• **Frontend**: HTML5, CSS3, JavaScript, React, Vue.js\n• **Backend**: Node.js, Python, PHP, Express.js\n• **Databases**: MySQL, MongoDB, PostgreSQL\n• **Tools**: Git, Docker, AWS, VS Code\n• **Design**: Figma, Adobe Creative Suite\n\nI'm always learning new technologies to stay current with industry trends!"
            },
            projects: {
                keywords: ['projects', 'portfolio', 'work', 'showcase', 'examples', 'demos'],
                response: "Here are some of my featured projects:\n\n• **E-commerce Platform**: Full-stack solution with React & Node.js\n• **Task Management App**: Real-time collaboration with WebSocket\n• **Data Visualization Dashboard**: Interactive charts with D3.js\n• **Mobile App**: Cross-platform development with React Native\n\nEach project includes live demos, source code on GitHub, and detailed case studies. Would you like to know more about any specific project?"
            },
            experience: {
                keywords: ['experience', 'background', 'career', 'work history', 'professional'],
                response: "I'm a passionate full-stack developer with 3+ years of experience creating innovative web solutions. My journey includes:\n\n• **Frontend Development**: Creating responsive, user-friendly interfaces\n• **Backend Systems**: Building scalable APIs and databases\n• **Project Leadership**: Managing development teams and timelines\n• **Client Collaboration**: Working directly with stakeholders\n\nI've worked on projects ranging from small business websites to enterprise-level applications."
            },
            contact: {
                keywords: ['contact', 'hire', 'email', 'reach out', 'connect', 'collaboration'],
                response: "I'd love to connect and discuss potential opportunities! Here are the best ways to reach me:\n\n• **Email**: [your-email@example.com]\n• **LinkedIn**: [Your LinkedIn Profile]\n• **GitHub**: [Your GitHub Profile]\n• **Phone**: [Your Phone Number]\n\nI'm always open to:\n• Freelance projects\n• Full-time opportunities\n• Collaboration on open-source projects\n• Technical discussions\n\nFeel free to reach out anytime!"
            },
            education: {
                keywords: ['education', 'learning', 'courses', 'certifications', 'study'],
                response: "My educational background includes:\n\n• **Formal Education**: Computer Science degree/bootcamp\n• **Certifications**: AWS, Google Cloud, MongoDB\n• **Continuous Learning**: Regular participation in online courses\n• **Community**: Active in developer communities and conferences\n\nI believe in lifelong learning and constantly updating my skills with the latest industry practices and technologies."
            },
            services: {
                keywords: ['services', 'what do you do', 'offer', 'help with', 'capabilities'],
                response: "I offer comprehensive web development services:\n\n• **Web Development**: Custom websites and applications\n• **Frontend Development**: Modern, responsive user interfaces\n• **Backend Development**: APIs, databases, and server management\n• **E-commerce Solutions**: Online stores and payment systems\n• **Performance Optimization**: Speed and SEO improvements\n• **Consultation**: Technical advice and project planning\n\nI work with businesses of all sizes to bring their digital visions to life!"
            },
            greeting: {
                keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
                response: "Hello! Welcome to my portfolio! 👋\n\nI'm excited you're here! I'm a full-stack developer passionate about creating amazing digital experiences. I can help you learn more about:\n\n• My technical skills and expertise\n• Featured projects and case studies\n• Professional experience and background\n• How we can work together\n\nFeel free to ask me anything or use the quick questions below!"
            },
            default: {
                keywords: [],
                response: "Thanks for your question! While I'd love to help with that, I'm specifically designed to share information about my portfolio, skills, projects, and professional background.\n\nHere are some things I can help you with:\n• Technical skills and technologies I use\n• Details about my featured projects\n• My professional experience and background\n• How to get in touch for collaborations\n\nWhat would you like to know about my work?"
            }
        };
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        if (this.chat) {
            this.chat.classList.add('active');
            this.isOpen = true;
            if (this.input) this.input.focus();
        }
    }

    closeChat() {
        if (this.chat) {
            this.chat.classList.remove('active');
            this.isOpen = false;
        }
    }

    async sendMessage(text = null) {
        const message = text || (this.input ? this.input.value.trim() : '');
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        if (this.input) this.input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'assistant');
        }, 1000 + Math.random() * 1000); // Simulate thinking time
    }

    addMessage(text, type) {
        if (!this.messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = this.formatMessage(text);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Convert markdown-style formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '<br>• ');
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check each knowledge base category
        for (const [category, data] of Object.entries(this.knowledgeBase)) {
            if (data.keywords.some(keyword => message.includes(keyword))) {
                return data.response;
            }
        }
        
        // Default response if no match found
        return this.knowledgeBase.default.response;
    }

    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.add('active');
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.remove('active');
        }
    }

    scrollToBottom() {
        if (this.messagesContainer) {
            setTimeout(() => {
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
            }, 100);
        }
    }
}

// Social Media Tracking
function trackSocialClick(platform) {
    console.log(`Social media click tracked: ${platform}`);
    // Add analytics tracking here
    if (typeof gtag !== 'undefined') {
        gtag('event', 'social_click', {
            platform: platform,
            event_category: 'engagement'
        });
    }
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI Assistant
    window.portfolioAssistant = new PortfolioAssistant();
});
