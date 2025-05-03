import argparse
import json
from pathlib import Path
from .creative_resume_parser import CreativeResumeParser
from .resume_converter import ResumeConverter

def main():
    parser = argparse.ArgumentParser(description="Parse and convert resume text to template format")
    parser.add_argument("input_file", type=str, help="Path to the input text file containing resume content")
    parser.add_argument("--output", "-o", type=str, help="Path to save the output JSON", default="resume_data.json")
    parser.add_argument("--format", "-f", type=str, choices=["creative", "professional", "technical", "academic"],
                      help="Force a specific template format", default=None)
    
    args = parser.parse_args()
    
    # Read input file
    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"Error: Input file {args.input_file} does not exist")
        return 1
        
    try:
        # Parse resume text
        resume_text = input_path.read_text(encoding='utf-8')
        resume = CreativeResumeParser.parse_from_image(resume_text)
        
        # Convert to template format
        converter = ResumeConverter()
        template_data = converter.to_template_context(resume)
        
        # Override template format if specified
        if args.format:
            template_data["profession_type"] = args.format
        
        # Add CSS variables
        template_data["css_variables"] = converter.generate_css_variables(resume)
        
        # Save output
        output_path = Path(args.output)
        output_path.write_text(json.dumps(template_data, indent=2), encoding='utf-8')
        
        print(f"Successfully parsed resume and saved template data to {args.output}")
        return 0
        
    except Exception as e:
        print(f"Error processing resume: {str(e)}")
        return 1

if __name__ == "__main__":
    exit(main()) 