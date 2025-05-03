from typing import Dict, Any
from .resume_parser import Resume

class ResumeConverter:
    @staticmethod
    def to_template_context(resume: Resume) -> Dict[str, Any]:
        """Convert Resume object to template context dictionary."""
        return {
            "meta": {
                "title": f"{resume.name} - {resume.title}",
                "description": resume.profile,
                "keywords": resume.expertise + resume.software
            },
            "fonts": ["Roboto", "Open Sans"],  # Default fonts, can be customized
            "profession_type": "creative",  # Can be determined based on resume content
            "personal_info": {
                "name": resume.name,
                "title": resume.title,
                "email": resume.contact.get("email", ""),
                "phone": resume.contact.get("phone", ""),
                "location": resume.contact.get("location", ""),
                "website": resume.contact.get("website", ""),
                "summary": resume.profile
            },
            "sections": {
                "about": resume.profile,
                "experience": [
                    {
                        "title": exp.title,
                        "company": exp.company,
                        "location": exp.location,
                        "dates": f"{exp.start_date} - {exp.end_date}",
                        "description": exp.description
                    }
                    for exp in resume.experience
                ],
                "education": [
                    {
                        "degree": edu.degree,
                        "institution": edu.institution,
                        "year": edu.graduation_year
                    }
                    for edu in resume.education
                ],
                "projects": [
                    {
                        "title": proj.name,
                        "year": proj.year,
                        "description": proj.description,
                        "image": "",  # Placeholder for project image
                        "link": ""    # Placeholder for project link
                    }
                    for proj in resume.freelance_projects
                ],
                "recognition": [
                    {
                        "title": rec.title,
                        "year": rec.year,
                        "description": rec.description
                    }
                    for rec in resume.recognition
                ]
            },
            "skills": resume.expertise,
            "software": resume.software,
            "social_links": {},  # Can be extracted from contact info if available
            "contact_message": "I'm always interested in hearing about new projects and opportunities."
        }

    @staticmethod
    def generate_css_variables(resume: Resume) -> Dict[str, str]:
        """Generate CSS variables based on resume content."""
        # This could be customized based on the resume's industry/profession
        return {
            "creative-primary": "#FF6B6B",      # Warm red for creative professionals
            "creative-secondary": "#4ECDC4",     # Teal for balance
            "creative-accent": "#FFE66D",        # Yellow for emphasis
            "creative-dark": "#2C3E50",         # Navy for text
            "creative-light": "#F7F7F7"         # Light gray for backgrounds
        }

    @staticmethod
    def get_template_name(resume: Resume) -> str:
        """Determine the best template based on resume content."""
        # This could be more sophisticated, analyzing the content
        # to determine the most appropriate template
        if any(kw in resume.title.lower() for kw in ["designer", "artist", "creative", "photographer"]):
            return "creative"
        elif any(kw in resume.title.lower() for kw in ["developer", "engineer", "programmer"]):
            return "technical"
        elif any(kw in resume.title.lower() for kw in ["professor", "researcher", "phd"]):
            return "academic"
        else:
            return "professional" 