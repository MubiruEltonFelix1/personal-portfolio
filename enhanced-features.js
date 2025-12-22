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
            'titanic-analysis': {
                title: 'Titanic Survival Prediction Analysis',
                content: this.generateTitanicDemo()
            },
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
                                <div class="point" style="left: 25%; bottom: 35%" title="Age 22: £2.5M"></div>
                                <div class="point" style="left: 35%; bottom: 45%" title="Age 24: £4.2M"></div>
                                <div class="point" style="left: 45%; bottom: 75%" title="Age 27: £8.1M"></div>
                                <div class="point" style="left: 55%; bottom: 85%" title="Age 29: £9.8M"></div>
                                <div class="point" style="left: 65%; bottom: 70%" title="Age 31: £7.5M"></div>
                                <div class="point" style="left: 75%; bottom: 50%" title="Age 33: £4.8M"></div>
                                <div class="point" style="left: 85%; bottom: 30%" title="Age 35: £2.1M"></div>
                            </div>
                            <div class="axis-label bottom">Age (Years)</div>
                        </div>
                    </div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color"></div>
                            <span>Player Salary Distribution</span>
                        </div>
                    </div>
                    <p style="text-align: center; margin-top: 1rem; color: rgba(255,255,255,0.6); font-size: 0.9rem;">
                        <em>Interactive scatter plot showing the relationship between player age and salary in the Premier League</em>
                    </p>
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

    generateTitanicDemo() {
        return `
            <div class="demo-container">
                <h4>Machine Learning Survival Prediction Demo</h4>
                <p>This project analyzes the famous Titanic dataset to predict passenger survival using advanced machine learning techniques.</p>
                
                <div class="demo-section">
                    <h5>🚢 Dataset Overview</h5>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <span class="stat-number">891</span>
                            <span class="stat-label">Total Passengers</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">342</span>
                            <span class="stat-label">Survived</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">84.5%</span>
                            <span class="stat-label">Model Accuracy</span>
                        </div>
                    </div>
                </div>
                
                <div class="demo-section">
                    <h5>📊 Survival Analysis by Features</h5>
                    <div class="feature-analysis">
                        <div class="feature-chart">
                            <h6>Survival by Gender</h6>
                            <div class="chart-container">
                                <div class="bar-chart">
                                    <div class="bar female" style="height: 74%">
                                        <span class="bar-label">Female: 74%</span>
                                    </div>
                                    <div class="bar male" style="height: 19%">
                                        <span class="bar-label">Male: 19%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="feature-chart">
                            <h6>Survival by Class</h6>
                            <div class="chart-container">
                                <div class="bar-chart">
                                    <div class="bar first-class" style="height: 63%">
                                        <span class="bar-label">1st: 63%</span>
                                    </div>
                                    <div class="bar second-class" style="height: 47%">
                                        <span class="bar-label">2nd: 47%</span>
                                    </div>
                                    <div class="bar third-class" style="height: 24%">
                                        <span class="bar-label">3rd: 24%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="demo-section">
                    <h5>🤖 Machine Learning Pipeline</h5>
                    <div class="code-snippet">
                        <pre><code>from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import pandas as pd

# Feature engineering
def engineer_features(df):
    df['FamilySize'] = df['SibSp'] + df['Parch'] + 1
    df['IsAlone'] = (df['FamilySize'] == 1).astype(int)
    df['Title'] = df['Name'].str.extract(' ([A-Za-z]+)\\.', expand=False)
    return df

# Model training
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
cv_scores = cross_val_score(rf_model, X_train, y_train, cv=5)
print(f"Cross-validation accuracy: {cv_scores.mean():.3f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)
</code></pre>
                    </div>
                </div>

                <div class="demo-section">
                    <h5>🎯 Key Insights & Model Performance</h5>
                    <ul>
                        <li><strong>Gender Impact:</strong> Being female increased survival probability by 55%</li>
                        <li><strong>Social Class:</strong> First-class passengers had 2.6x higher survival rate than third-class</li>
                        <li><strong>Age Factor:</strong> Children under 16 had significantly higher survival rates</li>
                        <li><strong>Family Size:</strong> Optimal family size of 2-4 members showed best survival rates</li>
                        <li><strong>Port of Embarkation:</strong> Cherbourg passengers had higher survival (55% vs 34%)</li>
                    </ul>
                </div>
                
                <div class="demo-actions">
                    <a href="https://github.com/MubiruEltonFelix1/titanic-data-analysis" 
                       target="_blank" class="btn btn-primary">
                        <i class="fab fa-github"></i> View Full Project
                    </a>
                    <button class="btn btn-secondary" onclick="alert('Interactive prediction tool coming soon!')">
                        <i class="fas fa-calculator"></i> Try Prediction Tool
                    </button>
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

// Project Action Functions
function showTechStack(projectId) {
    const techStacks = {
        'titanic-analysis': {
            title: 'Titanic Analysis Technologies',
            technologies: [
                { name: 'Python', description: 'Primary programming language for data analysis', icon: 'fab fa-python', color: '#3776ab' },
                { name: 'Pandas', description: 'Data manipulation and analysis library', icon: 'fas fa-table', color: '#150458' },
                { name: 'Scikit-learn', description: 'Machine learning algorithms and tools', icon: 'fas fa-brain', color: '#f7931e' },
                { name: 'Matplotlib', description: 'Data visualization and plotting', icon: 'fas fa-chart-line', color: '#11557c' },
                { name: 'Seaborn', description: 'Statistical data visualization', icon: 'fas fa-chart-bar', color: '#444444' },
                { name: 'Jupyter', description: 'Interactive development environment', icon: 'fas fa-book-open', color: '#f37626' }
            ]
        },
        'premier-league': {
            title: 'Premier League Analysis Technologies',
            technologies: [
                { name: 'Python', description: 'Data processing and analysis', icon: 'fab fa-python', color: '#3776ab' },
                { name: 'Pandas', description: 'Data manipulation framework', icon: 'fas fa-table', color: '#150458' },
                { name: 'Matplotlib', description: 'Creating statistical visualizations', icon: 'fas fa-chart-line', color: '#11557c' },
                { name: 'Seaborn', description: 'Advanced statistical plots', icon: 'fas fa-chart-bar', color: '#444444' },
                { name: 'NumPy', description: 'Numerical computing library', icon: 'fas fa-calculator', color: '#013243' },
                { name: 'Statistics', description: 'Statistical analysis methods', icon: 'fas fa-square-root-alt', color: '#dc3545' }
            ]
        },
        'coming-soon': {
            title: 'Upcoming Project Technologies',
            technologies: [
                { name: 'Python', description: 'Core language for ML and data science', icon: 'fab fa-python', color: '#3776ab' },
                { name: 'TensorFlow', description: 'Deep learning and neural networks', icon: 'fas fa-brain', color: '#ff6f00' },
                { name: 'React', description: 'Frontend framework for interactive UIs', icon: 'fab fa-react', color: '#61dafb' },
                { name: 'Node.js', description: 'Backend runtime environment', icon: 'fab fa-node-js', color: '#339933' },
                { name: 'PostgreSQL', description: 'Advanced database management', icon: 'fas fa-database', color: '#336791' },
                { name: 'Docker', description: 'Containerization and deployment', icon: 'fab fa-docker', color: '#2496ed' }
            ]
        }
    };

    const techData = techStacks[projectId];
    if (!techData) return;

    const modal = createTechModal(techData);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function createTechModal(techData) {
    const modal = document.createElement('div');
    modal.className = 'tech-modal';
    modal.innerHTML = `
        <div class="tech-modal-content">
            <div class="tech-modal-header">
                <h3>${techData.title}</h3>
                <button class="close-tech-modal" onclick="this.closest('.tech-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="tech-modal-body">
                <div class="tech-grid">
                    ${techData.technologies.map(tech => `
                        <div class="tech-item">
                            <div class="tech-icon" style="color: ${tech.color}">
                                <i class="${tech.icon}"></i>
                            </div>
                            <div class="tech-info">
                                <h4>${tech.name}</h4>
                                <p>${tech.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    return modal;
}

function showQuickPreview(projectId) {
    const previews = {
        'titanic-analysis': {
            title: 'Titanic Survival Prediction',
            image: 'https://via.placeholder.com/600x300/1e293b/64748b?text=Titanic+Analysis+Preview',
            description: 'Machine learning model achieving 84.5% accuracy in predicting passenger survival',
            stats: ['891 Passengers Analyzed', '84.5% Model Accuracy', '6 Key Features Used']
        },
        'premier-league': {
            title: 'Premier League Age vs Salary',
            image: 'https://via.placeholder.com/600x300/1e293b/64748b?text=Premier+League+Analysis+Preview',
            description: 'Statistical analysis revealing peak salary age and career trajectory insights',
            stats: ['Real-world Player Data', 'Peak Age: 27-29 Years', 'Interactive Visualizations']
        },
        'coming-soon': {
            title: 'Upcoming AI/ML Projects',
            image: 'https://via.placeholder.com/600x300/1e293b/64748b?text=Coming+Soon+Projects',
            description: 'Innovative AI and machine learning projects currently in development',
            stats: ['Advanced ML Models', 'Real-time AI Applications', 'Interactive Dashboards']
        }
    };

    const previewData = previews[projectId];
    if (!previewData) return;

    const modal = createPreviewModal(previewData);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

// Coming Soon Specific Functions
function showComingSoonPreview() {
    const modal = document.createElement('div');
    modal.className = 'coming-soon-preview-modal';
    modal.innerHTML = `
        <div class="coming-soon-preview-content">
            <div class="coming-soon-preview-header">
                <h3>🚀 Exciting Projects in Development</h3>
                <button class="close-coming-soon-preview" onclick="this.closest('.coming-soon-preview-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="coming-soon-preview-body">
                <div class="development-timeline">
                    <div class="timeline-item active">
                        <div class="timeline-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>ML Prediction Models</h4>
                            <p>Advanced machine learning algorithms for real-world prediction problems</p>
                            <span class="timeline-date">Q1 2025</span>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>AI-Powered Web Apps</h4>
                            <p>Interactive web applications leveraging artificial intelligence</p>
                            <span class="timeline-date">Q2 2025</span>
                        </div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>Analytics Dashboards</h4>
                            <p>Real-time data visualization and business intelligence tools</p>
                            <span class="timeline-date">Q3 2025</span>
                        </div>
                    </div>
                </div>
                <div class="preview-footer">
                    <p>🔔 <strong>Stay tuned!</strong> Follow my GitHub for the latest updates and releases.</p>
                    <a href="https://github.com/MubiruEltonFelix1" target="_blank" class="btn btn-primary">
                        <i class="fab fa-github"></i> Follow on GitHub
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

function createPreviewModal(previewData) {
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-modal-header">
                <h3>${previewData.title}</h3>
                <button class="close-preview-modal" onclick="this.closest('.preview-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="preview-modal-body">
                <div class="preview-image">
                    <img src="${previewData.image}" alt="${previewData.title}" />
                </div>
                <div class="preview-info">
                    <p class="preview-description">${previewData.description}</p>
                    <div class="preview-stats">
                        ${previewData.stats.map(stat => `
                            <div class="stat-item">
                                <i class="fas fa-check-circle"></i>
                                <span>${stat}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function shareProject(projectId) {
    const projects = {
        'titanic-analysis': {
            title: 'Titanic Survival Prediction Analysis',
            description: 'Machine learning analysis achieving 84.5% accuracy in predicting passenger survival',
            url: window.location.href + '#titanic-project'
        },
        'premier-league': {
            title: 'Premier League Age vs Salary Analysis',
            description: 'Statistical analysis revealing peak salary age and career trajectory insights',
            url: window.location.href + '#premier-league-project'
        },
        'coming-soon': {
            title: 'Upcoming AI/ML Projects',
            description: 'Exciting artificial intelligence and machine learning projects in development',
            url: window.location.href + '#coming-soon-projects'
        }
    };

    const project = projects[projectId];
    if (!project) return;

    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: project.title,
            text: project.description,
            url: project.url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        const shareText = `${project.title}\n${project.description}\n${project.url}`;
        navigator.clipboard.writeText(shareText).then(() => {
            // Show temporary notification
            showShareNotification('Project link copied to clipboard!');
        }).catch(() => {
            // Ultimate fallback
            prompt('Copy this link to share:', project.url);
        });
    }
}

function showShareNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize AI Assistant when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI Assistant
    window.portfolioAssistant = new PortfolioAssistant();
});
