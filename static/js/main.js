document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.body.setAttribute('data-theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isAct = navLinks.classList.contains('active');
            hamburger.innerHTML = isAct ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible'); // Show again when coming back
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .project-card, .skill-group, .research-card, .social-link-card, .timeline-item').forEach(el => {
        observer.observe(el);
    });

    // --- GitHub API Fetch ---
    const githubSection = document.getElementById('github-repos');
    if (githubSection) {
        const username = githubSection.getAttribute('data-username');
        const container = document.getElementById('repo-container');
        
        if (username && username !== 'None') {
            fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.json();
                })
                .then(repos => {
                    container.innerHTML = '';
                    if (repos.length === 0) {
                        container.innerHTML = '<p>No repositories found.</p>';
                        return;
                    }
                    
                    repos.forEach(repo => {
                        // Skip forks if desired, or just show all
                        if (!repo.fork) {
                            const card = document.createElement('div');
                            card.className = 'repo-card glassmorphism';
                            card.innerHTML = `
                                <h4 style="margin-bottom:0.5rem"><a href="${repo.html_url}" target="_blank" style="color:var(--primary-color)">${repo.name}</a></h4>
                                <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem">${repo.description || 'No description provided.'}</p>
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted)">
                                    <span><i class="fas fa-star" style="color:gold"></i> ${repo.stargazers_count}</span>
                                    <span>${repo.language || 'Unknown'}</span>
                                </div>
                            `;
                            container.appendChild(card);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching GitHub repos:', error);
                    container.innerHTML = '<p>Failed to load repositories. Please check the username or try again later.</p>';
                });
        } else {
            githubSection.style.display = 'none'; // Hide if no username
        }
    }

    // --- Hacker Text Effect ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const hackerLines = document.querySelectorAll(".hacker-line");

    hackerLines.forEach(line => {
        let originalText = line.dataset.value;
        if (!originalText) return;

        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

        const colorize = (text) => {
            return text
                .replace(/\b(document|window|localStorage|const|if|new|function|return|fetch|then|forEach)\b/g, '<span class="code-keyword">$1</span>')
                .replace(/('.*?'|".*?")/g, '<span class="code-string">$1</span>');
        };

        setInterval(() => {
            const scrambled = originalText
                .split("")
                .map((letter, index) => {
                    if (letter === " " || letter === "_" || letter === "." || letter === "(" || letter === ")" || letter === "{" || letter === "}" || Math.random() > 0.05) {
                        return letter;
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join("");
            
            line.innerHTML = colorize(scrambled);
        }, 150);
    });
});
