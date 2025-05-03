from typing import Dict, Any, List
from pathlib import Path
import json
from datetime import datetime

class TemplateStyle:
    def __init__(self, style_type: str):
        self.style_type = style_type
        self.colors = self._get_color_scheme()
        self.typography = self._get_typography()
        self.layout = self._get_layout()

    def _get_color_scheme(self) -> Dict[str, str]:
        schemes = {
            "developer": {
                "primary": "#2D3E50",    # Dark blue
                "secondary": "#3498DB",   # Light blue
                "accent": "#E74C3C",      # Red
                "background": "#F5F7FA",  # Light gray
                "text": "#2C3E50"         # Dark gray
            },
            "entrepreneur": {
                "primary": "#34495E",     # Navy
                "secondary": "#2ECC71",    # Green
                "accent": "#F1C40F",      # Yellow
                "background": "#FFFFFF",   # White
                "text": "#2C3E50"         # Dark gray
            },
            "artist": {
                "primary": "#8E44AD",     # Purple
                "secondary": "#E67E22",    # Orange
                "accent": "#F1C40F",      # Yellow
                "background": "#FDF6F6",   # Soft pink
                "text": "#2C3E50"         # Dark gray
            },
            "musician": {
                "primary": "#6C3483",     # Deep purple
                "secondary": "#D35400",    # Burnt orange
                "accent": "#F4D03F",      # Gold
                "background": "#FAF3F3",   # Soft beige
                "text": "#2C3E50"         # Dark gray
            }
        }
        return schemes.get(self.style_type, schemes["developer"])

    def _get_typography(self) -> Dict[str, str]:
        typography = {
            "developer": {
                "heading": "Inter",
                "body": "Roboto",
                "accent": "Fira Code"
            },
            "entrepreneur": {
                "heading": "Montserrat",
                "body": "Open Sans",
                "accent": "Playfair Display"
            },
            "artist": {
                "heading": "Playfair Display",
                "body": "Lato",
                "accent": "Dancing Script"
            },
            "musician": {
                "heading": "Cormorant Garamond",
                "body": "Lora",
                "accent": "Playfair Display"
            }
        }
        return typography.get(self.style_type, typography["developer"])

    def _get_layout(self) -> Dict[str, Any]:
        layouts = {
            "developer": {
                "header_style": "minimal",
                "sections_style": "cards",
                "image_position": "right",
                "use_icons": True
            },
            "entrepreneur": {
                "header_style": "bold",
                "sections_style": "clean",
                "image_position": "right",
                "use_icons": True
            },
            "artist": {
                "header_style": "creative",
                "sections_style": "flowing",
                "image_position": "background",
                "use_icons": False
            },
            "musician": {
                "header_style": "elegant",
                "sections_style": "classic",
                "image_position": "right",
                "use_icons": False
            }
        }
        return layouts.get(self.style_type, layouts["developer"])

class TemplateGenerator:
    def __init__(self):
        self.templates_path = Path("templates")
        self.static_path = Path("static")

    def generate_template(self, profile_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a new template based on profile type and data."""
        style = TemplateStyle(profile_type)
        
        template = {
            "template": {
                "name": f"{profile_type}_template",
                "style": style.style_type,
                "colors": style.colors,
                "typography": style.typography,
                "layout": style.layout
            },
            "content": self._generate_content_structure(data, style),
            "assets": self._generate_asset_list(style)
        }
        
        return template

    def _generate_content_structure(self, data: Dict[str, Any], style: TemplateStyle) -> Dict[str, Any]:
        """Generate content structure based on profile type."""
        sections = {
            "developer": [
                "hero",
                "about",
                "skills",
                "projects",
                "experience",
                "education",
                "contact"
            ],
            "entrepreneur": [
                "hero",
                "about",
                "ventures",
                "achievements",
                "expertise",
                "contact"
            ],
            "artist": [
                "hero",
                "about",
                "portfolio",
                "exhibitions",
                "statement",
                "contact"
            ],
            "musician": [
                "hero",
                "about",
                "performances",
                "repertoire",
                "media",
                "contact"
            ]
        }

        return {
            "sections": sections.get(style.style_type, sections["developer"]),
            "data": data
        }

    def _generate_asset_list(self, style: TemplateStyle) -> Dict[str, List[str]]:
        """Generate list of required assets."""
        common_assets = {
            "fonts": [
                style.typography["heading"],
                style.typography["body"],
                style.typography["accent"]
            ],
            "icons": [
                "email",
                "phone",
                "location",
                "linkedin",
                "github",
                "website"
            ] if style.layout["use_icons"] else []
        }
        
        return common_assets

    def generate_html(self, template_data: Dict[str, Any]) -> str:
        """Generate HTML template from template data."""
        style = template_data["template"]
        content = template_data["content"]
        
        sections_html = self._generate_sections_html(content["sections"], style)
        
        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{content['data'].get('name', 'Professional Resume')}</title>
    
    <!-- Fonts -->
    {self._generate_font_links(template_data['assets']['fonts'])}
    
    <!-- Styles -->
    <link rel="stylesheet" href="style.css">
</head>
<body class="template-{style['style']}">
    <nav class="main-nav">
        <div class="container">
            <div class="nav-content">
                {self._generate_nav_links(content['sections'])}
            </div>
        </div>
    </nav>

    <main>
        {sections_html}
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="social-links">
                    {self._generate_social_links(content['data'].get('social_links', {}))}
                </div>
                <p class="copyright">&copy; {content['data'].get('name', '')} {datetime.now().year}</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="script.js"></script>
</body>
</html>"""

    def generate_css(self, template_data: Dict[str, Any]) -> str:
        """Generate CSS styles from template data."""
        style = template_data["template"]
        colors = style["colors"]
        typography = style["typography"]
        
        return f"""/* Variables */
:root {{
    --primary: {colors['primary']};
    --secondary: {colors['secondary']};
    --accent: {colors['accent']};
    --background: {colors['background']};
    --text: {colors['text']};
    
    --font-heading: "{typography['heading']}", sans-serif;
    --font-body: "{typography['body']}", sans-serif;
    --font-accent: "{typography['accent']}", sans-serif;
}}

/* Base Styles */
body {{
    margin: 0;
    padding: 0;
    font-family: var(--font-body);
    color: var(--text);
    background: var(--background);
    line-height: 1.6;
}}

.container {{
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}}

/* Navigation */
.main-nav {{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}}

/* Typography */
h1, h2, h3, h4, h5, h6 {{
    font-family: var(--font-heading);
    color: var(--primary);
}}

/* Sections */
section {{
    padding: 6rem 0;
}}

/* Hero Section */
.hero {{
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
}}

{self._generate_section_styles(template_data)}

/* Animations */
@keyframes fadeIn {{
    from {{ opacity: 0; transform: translateY(20px); }}
    to {{ opacity: 1; transform: translateY(0); }}
}}

.animate {{
    opacity: 0;
    animation: fadeIn 0.6s ease forwards;
}}

/* Responsive Design */
@media (max-width: 768px) {{
    .container {{
        padding: 0 1rem;
    }}
    
    section {{
        padding: 4rem 0;
    }}
}}"""

    def generate_js(self, template_data: Dict[str, Any]) -> str:
        """Generate JavaScript for template interactivity."""
        return """// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

// Create observer for scroll animations
const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Smooth scroll for navigation
const handleSmoothScroll = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set up animations
    document.querySelectorAll('.animate').forEach(element => {
        observer.observe(element);
    });

    // Set up smooth scrolling
    document.addEventListener('click', handleSmoothScroll);

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});"""

    def _generate_sections_html(self, sections: List[str], style: Dict[str, Any]) -> str:
        """Generate HTML for all sections."""
        html_parts = []
        
        for section in sections:
            html_parts.append(self._generate_section_html(section, style))
            
        return "\n".join(html_parts)

    def _generate_section_html(self, section: str, style: Dict[str, Any]) -> str:
        """Generate HTML for a single section."""
        section_templates = {
            "hero": self._hero_section_template,
            "about": self._about_section_template,
            "skills": self._skills_section_template,
            "projects": self._projects_section_template,
            "experience": self._experience_section_template,
            "education": self._education_section_template,
            "contact": self._contact_section_template,
            "performances": self._performances_section_template,
            "ventures": self._ventures_section_template,
            "portfolio": self._portfolio_section_template
        }
        
        template_func = section_templates.get(section, lambda s: f"<section id='{section}'></section>")
        return template_func(style)

    def _hero_section_template(self, style: Dict[str, Any]) -> str:
        """Generate hero section HTML."""
        layout = style["layout"]
        return f"""
<section id="hero" class="hero {layout['header_style']}">
    <div class="container">
        <div class="hero-content animate">
            <h1>{{{{ name }}}}</h1>
            <h2>{{{{ title }}}}</h2>
            <div class="hero-description">
                {{{{ summary }}}}
            </div>
        </div>
    </div>
</section>"""

    def _generate_font_links(self, fonts: List[str]) -> str:
        """Generate Google Fonts links."""
        fonts_formatted = [font.replace(" ", "+") for font in fonts]
        return "\n".join([
            f'<link href="https://fonts.googleapis.com/css2?family={font}:wght@300;400;500;700&display=swap" rel="stylesheet">'
            for font in fonts_formatted
        ])

    def _generate_nav_links(self, sections: List[str]) -> str:
        """Generate navigation links."""
        return "\n".join([
            f'<a href="#{section}" class="nav-link">{section.title()}</a>'
            for section in sections
        ])

    def _generate_social_links(self, social_links: Dict[str, str]) -> str:
        """Generate social media links."""
        return "\n".join([
            f'<a href="{url}" class="social-link {platform}" target="_blank" rel="noopener noreferrer">{platform.title()}</a>'
            for platform, url in social_links.items()
        ])

    def _generate_section_styles(self, template_data: Dict[str, Any]) -> str:
        """Generate specific styles for each section based on template type."""
        style = template_data["template"]
        layout = style["layout"]
        
        if layout["sections_style"] == "cards":
            return """
.section-content {
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    margin-bottom: 2rem;
}"""
        elif layout["sections_style"] == "flowing":
            return """
.section-content {
    position: relative;
    overflow: hidden;
    padding: 2rem;
}

.section-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--accent);
    opacity: 0.05;
    transform: skewY(-5deg);
}"""
        else:
            return """
.section-content {
    padding: 2rem 0;
}"""

    def _about_section_template(self, style: Dict[str, Any]) -> str:
        """Generate about section HTML."""
        return """
<section id="about" class="about">
    <div class="container">
        <div class="section-content animate">
            <h2>About Me</h2>
            <div class="about-grid">
                <div class="about-text">
                    {{ about }}
                </div>
                {% if profile_image %}
                <div class="about-image">
                    <img src="{{ profile_image }}" alt="{{ name }}">
                </div>
                {% endif %}
            </div>
        </div>
    </div>
</section>"""

    def _skills_section_template(self, style: Dict[str, Any]) -> str:
        """Generate skills section HTML."""
        return """
<section id="skills" class="skills">
    <div class="container">
        <div class="section-content animate">
            <h2>Skills & Expertise</h2>
            <div class="skills-grid">
                {% for category, skills in skills.items() %}
                <div class="skill-category">
                    <h3>{{ category }}</h3>
                    <ul class="skill-list">
                        {% for skill in skills %}
                        <li class="skill-item">{{ skill }}</li>
                        {% endfor %}
                    </ul>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>"""

    def _projects_section_template(self, style: Dict[str, Any]) -> str:
        """Generate projects section HTML."""
        return """
<section id="projects" class="projects">
    <div class="container">
        <div class="section-content animate">
            <h2>Featured Projects</h2>
            <div class="projects-grid">
                {% for project in projects %}
                <div class="project-card">
                    {% if project.image %}
                    <div class="project-image">
                        <img src="{{ project.image }}" alt="{{ project.title }}">
                    </div>
                    {% endif %}
                    <div class="project-info">
                        <h3>{{ project.title }}</h3>
                        <p class="project-description">{{ project.description }}</p>
                        {% if project.technologies %}
                        <div class="project-tech">
                            {% for tech in project.technologies %}
                            <span class="tech-tag">{{ tech }}</span>
                            {% endfor %}
                        </div>
                        {% endif %}
                        {% if project.link %}
                        <a href="{{ project.link }}" class="project-link" target="_blank">View Project</a>
                        {% endif %}
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>"""

    def _experience_section_template(self, style: Dict[str, Any]) -> str:
        """Generate experience section HTML."""
        return """
<section id="experience" class="experience">
    <div class="container">
        <div class="section-content animate">
            <h2>Professional Experience</h2>
            <div class="timeline">
                {% for exp in experience %}
                <div class="timeline-item">
                    <div class="timeline-content">
                        <h3>{{ exp.title }}</h3>
                        <h4>{{ exp.company }}</h4>
                        <p class="timeline-date">{{ exp.dates }}</p>
                        <ul class="timeline-description">
                            {% for point in exp.description %}
                            <li>{{ point }}</li>
                            {% endfor %}
                        </ul>
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>"""

    def _education_section_template(self, style: Dict[str, Any]) -> str:
        """Generate education section HTML."""
        return """
<section id="education" class="education">
    <div class="container">
        <div class="section-content animate">
            <h2>Education</h2>
            <div class="education-grid">
                {% for edu in education %}
                <div class="education-item">
                    <h3>{{ edu.degree }}</h3>
                    <h4>{{ edu.institution }}</h4>
                    <p class="education-year">{{ edu.year }}</p>
                    {% if edu.details %}
                    <ul class="education-details">
                        {% for detail in edu.details %}
                        <li>{{ detail }}</li>
                        {% endfor %}
                    </ul>
                    {% endif %}
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>"""

    def _contact_section_template(self, style: Dict[str, Any]) -> str:
        """Generate contact section HTML."""
        return """
<section id="contact" class="contact">
    <div class="container">
        <div class="section-content animate">
            <h2>Get in Touch</h2>
            <div class="contact-grid">
                <div class="contact-info">
                    <h3>Contact Information</h3>
                    <ul class="contact-list">
                        {% if email %}
                        <li>
                            <i class="icon-email"></i>
                            <a href="mailto:{{ email }}">{{ email }}</a>
                        </li>
                        {% endif %}
                        {% if phone %}
                        <li>
                            <i class="icon-phone"></i>
                            <a href="tel:{{ phone }}">{{ phone }}</a>
                        </li>
                        {% endif %}
                        {% if location %}
                        <li>
                            <i class="icon-location"></i>
                            <span>{{ location }}</span>
                        </li>
                        {% endif %}
                    </ul>
                    {% if social_links %}
                    <div class="social-links">
                        {% for platform, url in social_links.items() %}
                        <a href="{{ url }}" class="social-link {{ platform }}" target="_blank">
                            <i class="icon-{{ platform }}"></i>
                        </a>
                        {% endfor %}
                    </div>
                    {% endif %}
                </div>
                <div class="contact-form">
                    <form id="contactForm" action="/submit-contact" method="POST">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>"""

    def _performances_section_template(self, style: Dict[str, Any]) -> str:
        """Generate performances section HTML for musicians."""
        return """
<section id="performances" class="performances">
    <div class="container">
        <div class="section-content animate">
            <h2>Performances</h2>
            <div class="performances-grid">
                {% for performance in performances %}
                <div class="performance-card">
                    {% if performance.image %}
                    <div class="performance-image">
                        <img src="{{ performance.image }}" alt="{{ performance.title }}">
                    </div>
                    {% endif %}
                    <div class="performance-info">
                        <h3>{{ performance.title }}</h3>
                        <p class="performance-venue">{{ performance.venue }}</p>
                        <p class="performance-date">{{ performance.date }}</p>
                        <p class="performance-description">{{ performance.description }}</p>
                        {% if performance.program %}
                        <div class="program-details">
                            <h4>Program</h4>
                            <ul>
                                {% for piece in performance.program %}
                                <li>{{ piece }}</li>
                                {% endfor %}
                            </ul>
                        </div>
                        {% endif %}
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>"""

    def _ventures_section_template(self, style: Dict[str, Any]) -> str:
        """Generate ventures section HTML for entrepreneurs."""
        return """
<section id="ventures" class="ventures">
    <div class="container">
        <div class="section-content animate">
            <h2>Ventures & Projects</h2>
            <div class="ventures-grid">
                {% for venture in ventures %}
                <div class="venture-card">
                    <div class="venture-header">
                        {% if venture.logo %}
                        <img src="{{ venture.logo }}" alt="{{ venture.name }} logo" class="venture-logo">
                        {% endif %}
                        <h3>{{ venture.name }}</h3>
                    </div>
                    <div class="venture-info">
                        <p class="venture-role">{{ venture.role }}</p>
                        <p class="venture-period">{{ venture.period }}</p>
                        <p class="venture-description">{{ venture.description }}</p>
                        {% if venture.achievements %}
                        <div class="venture-achievements">
                            <h4>Key Achievements</h4>
                            <ul>
                                {% for achievement in venture.achievements %}
                                <li>{{ achievement }}</li>
                                {% endfor %}
                            </ul>
                        </div>
                        {% endif %}
                        {% if venture.link %}
                        <a href="{{ venture.link }}" class="venture-link" target="_blank">Learn More</a>
                        {% endif %}
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>"""

    def _portfolio_section_template(self, style: Dict[str, Any]) -> str:
        """Generate portfolio section HTML for artists and creatives."""
        return """
<section id="portfolio" class="portfolio">
    <div class="container">
        <div class="section-content animate">
            <h2>Portfolio</h2>
            {% if categories %}
            <div class="portfolio-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                {% for category in categories %}
                <button class="filter-btn" data-filter="{{ category|lower }}">{{ category }}</button>
                {% endfor %}
            </div>
            {% endif %}
            <div class="portfolio-grid">
                {% for item in portfolio %}
                <div class="portfolio-item" data-category="{{ item.category|lower }}">
                    <div class="portfolio-image">
                        <img src="{{ item.image }}" alt="{{ item.title }}">
                        <div class="portfolio-overlay">
                            <h3>{{ item.title }}</h3>
                            <p>{{ item.description }}</p>
                            {% if item.link %}
                            <a href="{{ item.link }}" class="portfolio-link" target="_blank">View Details</a>
                            {% endif %}
                        </div>
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</section>"""

    def save_template(self, template_name: str, template_data: Dict[str, Any]) -> None:
        """Save generated template files."""
        template_dir = self.templates_path / template_name
        template_dir.mkdir(parents=True, exist_ok=True)
        
        # Save template configuration
        config_file = template_dir / "template.json"
        config_file.write_text(json.dumps(template_data, indent=2))
        
        # Generate and save template files
        html = self.generate_html(template_data)
        css = self.generate_css(template_data)
        js = self.generate_js(template_data)
        
        (template_dir / "index.html").write_text(html)
        (template_dir / "style.css").write_text(css)
        (template_dir / "script.js").write_text(js)

    def generate_preview(self, template_data: Dict[str, Any]) -> str:
        """Generate a preview image of the template."""
        # Implementation would go here - this would generate a preview image
        pass 