import os
import json
import argparse
from pathlib import Path
from openai import OpenAI
from typing import Dict, List
import base64
import datetime
import time
import sys

def check_api_key():
    """Check if OpenAI API key is set and valid."""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError(
            "OpenAI API key not found! Please set your OPENAI_API_KEY environment variable.\n"
            "You can do this by running:\n"
            "   set OPENAI_API_KEY=your-api-key-here    (on Windows)\n"
            "   export OPENAI_API_KEY=your-api-key-here  (on Unix/Linux)"
        )
    return api_key

def analyze_image(client: OpenAI, image_path: str) -> Dict:
    """Analyze a single image using OpenAI's Vision model."""
    try:
        with open(image_path, "rb") as image_file:
            # Convert image to base64
            base64_image = base64.b64encode(image_file.read()).decode('utf-8')
            
            response = client.responses.create(
                model="gpt-4o-mini",
                input=[{
                    "role": "user",
                    "content": [
                        {"type": "input_text", "text": "Please extract all mathematical and MATLAB content shown in this image. Include formulas, code snippets, and technical details exactly as they appear. For example images in the images, extract them as alt text."},
                        {
                            "type": "input_image",
                            "image_url": f"data:image/png;base64,{base64_image}"
                        }
                    ]
                }]
            )
            
            return {
                "filename": os.path.basename(image_path),
                "description": response.output_text,
                "timestamp": str(datetime.datetime.now())
            }
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
        return {
            "filename": os.path.basename(image_path),
            "error": str(e),
            "timestamp": str(datetime.datetime.now())
        }

def process_directory(input_dir: str, output_dir: str) -> None:
    """Process all images in the input directory and save results to output directory."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    # Validate input directory
    if not input_path.exists():
        raise ValueError(f"Input directory '{input_dir}' does not exist")
    if not input_path.is_dir():
        raise ValueError(f"'{input_dir}' is not a directory")
        
    # Create output directory if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Check API key first
    api_key = check_api_key()
    
    # Initialize OpenAI client with the API key
    client = OpenAI(api_key=api_key)
    
    # Process each image
    image_files = sorted(input_path.glob("*.png"))
    if not image_files:
        print(f"No PNG images found in {input_dir}")
        return
        
    print(f"Found {len(image_files)} PNG images to process")
    for image_file in image_files:
        print(f"Processing {image_file.name}...")
        
        # Analyze image
        result = analyze_image(client, str(image_file))
        
        # Save result to JSON
        output_file = output_path / f"{image_file.stem}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
        
        print(f"Saved analysis to {output_file}")
        # Add a small delay to avoid rate limiting
        time.sleep(1)

def main():
    parser = argparse.ArgumentParser(description='Analyze images using OpenAI Vision API')
    parser.add_argument('--input-dir', type=str, default="images/Chapter 2 - Basic Use of MatLab",
                      help='Directory containing images to analyze')
    parser.add_argument('--output-dir', type=str, default="chapter-1/data",
                      help='Directory to save JSON outputs')
    
    args = parser.parse_args()
    try:
        process_directory(args.input_dir, args.output_dir)
    except Exception as e:
        print(f"Error: {str(e)}")
        return 1
    return 0

if __name__ == "__main__":
    sys.exit(main()) 