import re
from typing import Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
import json

@dataclass
class Experience:
    title: str
    company: str
    location: str
    start_date: str
    end_date: str
    description: List[str]

@dataclass
class Project:
    name: str
    year: str
    description: str

@dataclass
class Education:
    degree: str
    institution: str
    graduation_year: str

@dataclass
class Recognition:
    title: str
    year: str
    description: str

@dataclass
class Resume:
    name: str
    title: str
    profile: str
    contact: Dict[str, str]
    expertise: List[str]
    software: List[str]
    experience: List[Experience]
    education: List[Education]
    freelance_projects: List[Project]
    recognition: List[Recognition]

class ResumeParser:
    @staticmethod
    def parse_date(date_str: str) -> str:
        """Convert various date formats to a standardized format."""
        if date_str.lower() == "present":
            return datetime.now().strftime("%b %Y")
        try:
            # Try to parse various date formats
            for fmt in ["%b %Y", "%B %Y", "%m/%Y", "%Y"]:
                try:
                    return datetime.strptime(date_str.strip(), fmt).strftime("%b %Y")
                except ValueError:
                    continue
            return date_str
        except Exception:
            return date_str

    @staticmethod
    def extract_date_range(date_range: str) -> tuple[str, str]:
        """Extract start and end dates from a date range string."""
        parts = date_range.split("-")
        start_date = ResumeParser.parse_date(parts[0].strip())
        end_date = ResumeParser.parse_date(parts[1].strip()) if len(parts) > 1 else "Present"
        return start_date, end_date

    @staticmethod
    def parse_experience(exp_text: str) -> Experience:
        """Parse experience section text into structured data."""
        lines = exp_text.strip().split("\n")
        title_line = lines[0].split("/")
        
        # Extract title and company
        title = title_line[0].strip()
        company_location = title_line[1].strip() if len(title_line) > 1 else ""
        company, location = [x.strip() for x in company_location.split("|")] if "|" in company_location else (company_location, "")
        
        # Extract dates
        date_line = next((line for line in lines if re.search(r'\b\d{4}\b', line)), "")
        start_date, end_date = ResumeParser.extract_date_range(date_line)
        
        # Extract description points
        description = [line.strip() for line in lines[1:] if line.strip() and not re.search(r'\b\d{4}\b', line)]
        
        return Experience(
            title=title,
            company=company,
            location=location,
            start_date=start_date,
            end_date=end_date,
            description=description
        )

    @staticmethod
    def parse_projects(project_text: str) -> Project:
        """Parse project section text into structured data."""
        lines = project_text.strip().split("\n")
        project_header = lines[0]
        year_match = re.search(r'\((\d{4})\)', project_header)
        year = year_match.group(1) if year_match else ""
        name = project_header.split("(")[0].strip()
        description = " ".join(lines[1:])
        
        return Project(
            name=name,
            year=year,
            description=description
        )

    @staticmethod
    def parse_recognition(recog_text: str) -> Recognition:
        """Parse recognition/award text into structured data."""
        parts = recog_text.split("-")
        title = parts[0].strip()
        year_match = re.search(r'\((\d{4})\)', title)
        year = year_match.group(1) if year_match else ""
        description = parts[1].strip() if len(parts) > 1 else ""
        
        return Recognition(
            title=title.split("(")[0].strip(),
            year=year,
            description=description
        )

    @classmethod
    def parse_resume_text(cls, text: str) -> Resume:
        """Parse full resume text into structured data."""
        sections = cls._split_into_sections(text)
        
        # Extract basic information
        name = cls._extract_name(sections.get("header", ""))
        title = cls._extract_title(sections.get("header", ""))
        profile = sections.get("profile", "").strip()
        
        # Extract contact information
        contact = cls._extract_contact_info(sections.get("contact", ""))
        
        # Extract lists
        expertise = cls._extract_list_items(sections.get("expertise", ""))
        software = cls._extract_list_items(sections.get("software", ""))
        
        # Parse complex sections
        experience = [cls.parse_experience(exp) for exp in cls._split_experiences(sections.get("experience", ""))]
        education = [cls._parse_education(edu) for edu in cls._split_education(sections.get("education", ""))]
        projects = [cls.parse_projects(proj) for proj in cls._split_projects(sections.get("projects", ""))]
        recognition = [cls.parse_recognition(rec) for rec in cls._split_recognition(sections.get("recognition", ""))]
        
        return Resume(
            name=name,
            title=title,
            profile=profile,
            contact=contact,
            expertise=expertise,
            software=software,
            experience=experience,
            education=education,
            freelance_projects=projects,
            recognition=recognition
        )

    @staticmethod
    def _split_into_sections(text: str) -> Dict[str, str]:
        """Split resume text into different sections."""
        # Implementation depends on the specific format being parsed
        # This would need to be customized based on the input format
        pass

    @staticmethod
    def _extract_name(header: str) -> str:
        """Extract name from header section."""
        # Implementation for specific format
        pass

    @staticmethod
    def _extract_title(header: str) -> str:
        """Extract professional title from header section."""
        # Implementation for specific format
        pass

    @staticmethod
    def _extract_contact_info(contact_section: str) -> Dict[str, str]:
        """Extract contact information into structured format."""
        # Implementation for specific format
        pass

    @staticmethod
    def _extract_list_items(section: str) -> List[str]:
        """Extract items from a list section."""
        return [item.strip() for item in section.split("\n") if item.strip()]

    @staticmethod
    def _split_experiences(experience_section: str) -> List[str]:
        """Split experience section into individual experiences."""
        # Implementation for specific format
        pass

    @staticmethod
    def _split_education(education_section: str) -> List[str]:
        """Split education section into individual entries."""
        # Implementation for specific format
        pass

    @staticmethod
    def _split_projects(projects_section: str) -> List[str]:
        """Split projects section into individual projects."""
        # Implementation for specific format
        pass

    @staticmethod
    def _split_recognition(recognition_section: str) -> List[str]:
        """Split recognition section into individual entries."""
        # Implementation for specific format
        pass

    @staticmethod
    def _parse_education(education_text: str) -> Education:
        """Parse education text into structured data."""
        # Implementation for specific format
        pass 