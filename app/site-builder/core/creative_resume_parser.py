from .resume_parser import ResumeParser, Resume, Experience, Project, Education, Recognition
import re

class CreativeResumeParser(ResumeParser):
    @staticmethod
    def _split_into_sections(text: str) -> dict[str, str]:
        """Split creative resume format into sections."""
        sections = {}
        current_section = "header"
        current_content = []
        
        for line in text.split("\n"):
            line = line.strip()
            if not line:
                continue
                
            # Check for main section headers
            if line.upper() == line and len(line) > 3:  # Section headers are uppercase
                if current_content:
                    sections[current_section.lower()] = "\n".join(current_content)
                current_section = line.lower()
                current_content = []
            else:
                current_content.append(line)
        
        # Add the last section
        if current_content:
            sections[current_section.lower()] = "\n".join(current_content)
            
        return sections

    @staticmethod
    def _extract_name(header: str) -> str:
        """Extract name from header section."""
        lines = header.split("\n")
        return lines[0].strip()

    @staticmethod
    def _extract_title(header: str) -> str:
        """Extract professional title from header section."""
        lines = header.split("\n")
        return lines[1].strip() if len(lines) > 1 else ""

    @staticmethod
    def _extract_contact_info(contact_section: str) -> dict[str, str]:
        """Extract contact information from the creative format."""
        contact = {}
        lines = contact_section.split("\n")
        
        for line in lines:
            line = line.strip()
            if "@" in line:  # Email
                contact["email"] = line
            elif re.match(r'^\d{3}-\d{3}-\d{4}$', line):  # Phone
                contact["phone"] = line
            elif "," in line:  # Address
                contact["location"] = line
            elif line.endswith(".design"):  # Website
                contact["website"] = line
                
        return contact

    @staticmethod
    def _split_experiences(experience_section: str) -> list[str]:
        """Split experience section into individual experiences."""
        experiences = []
        current_exp = []
        
        for line in experience_section.split("\n"):
            if re.search(r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b', line):
                if current_exp:
                    experiences.append("\n".join(current_exp))
                current_exp = [line]
            elif line.strip():
                current_exp.append(line)
                
        if current_exp:
            experiences.append("\n".join(current_exp))
            
        return experiences

    @staticmethod
    def _split_education(education_section: str) -> list[str]:
        """Split education section into individual entries."""
        education = []
        current_edu = []
        
        for line in education_section.split("\n"):
            if "Graduated" in line:
                if current_edu:
                    education.append("\n".join(current_edu))
                current_edu = [line]
            elif line.strip():
                current_edu.append(line)
                
        if current_edu:
            education.append("\n".join(current_edu))
            
        return education

    @staticmethod
    def _parse_education(education_text: str) -> Education:
        """Parse education text into structured data."""
        lines = education_text.split("\n")
        degree = lines[0].strip()
        institution = lines[1].strip() if len(lines) > 1 else ""
        
        # Extract graduation year
        year_match = re.search(r'Graduated\s+(\d{4})', education_text)
        graduation_year = year_match.group(1) if year_match else ""
        
        return Education(
            degree=degree,
            institution=institution,
            graduation_year=graduation_year
        )

    @staticmethod
    def _split_projects(projects_section: str) -> list[str]:
        """Split projects section into individual projects."""
        projects = []
        current_project = []
        
        for line in projects_section.split("\n"):
            if re.search(r'\(\d{4}\)', line):  # New project starts with year in parentheses
                if current_project:
                    projects.append("\n".join(current_project))
                current_project = [line]
            elif line.strip():
                current_project.append(line)
                
        if current_project:
            projects.append("\n".join(current_project))
            
        return projects

    @staticmethod
    def _split_recognition(recognition_section: str) -> list[str]:
        """Split recognition section into individual entries."""
        recognitions = []
        for line in recognition_section.split("\n"):
            if line.strip():
                recognitions.append(line)
        return recognitions

    @classmethod
    def parse_from_image(cls, image_text: str) -> Resume:
        """Parse resume text extracted from an image."""
        return cls.parse_resume_text(image_text) 