import OpenAI from 'openai';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize OpenAI client with API key from .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Analyze a single image
const analyzeImage = async (imagePath) => {
    try {
        // Read and convert image to base64
        const imageBuffer = readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const response = await openai.responses.create({
            model: "gpt-4o-mini",
            input: [{
                role: "user",
                content: [
                    { 
                        type: "input_text", 
                        text: `You are a text extractor from images. Please extract all the content shown in this image and output it in this specific json format. For example images in the images, extract them as alt text.

{
    "section": {
        "title": "string",  // The section title (e.g., "2.1 Introduction")
        "content": {
            "main_concept": {
                "term": "string",      // The main term being defined (e.g., "MATLAB")
                "definition": "string" // The complete definition
            },
            "key_points": [
                {
                    "topic": "string",     // Topic name (e.g., "toolboxes", "command", etc.)
                    "description": "string" // Detailed explanation
                }
            ],
            "examples": {
                "commands": [
                    {
                        "code": "string",    // The actual command
                        "explanation": "string" // Optional explanation if provided
                    }
                ],
                "images": [
                    {
                        "alt_text": "string",    // Description of any example images shown
                        "context": "string"      // Where/how the image is used in the content
                    }
                ]
            },
            "data_types": [
                {
                    "name": "string",      // Name of the data type
                    "description": "string" // Description/explanation
                }
            ]
        }
    }
}

Extract all text content and format it according to this structure. Preserve exact code snippets and technical terms as they appear in the image. If there are any example images shown in the content, describe them in the examples.images array.`
                    },
                    {
                        type: "input_image",
                        image_url: `data:image/png;base64,${base64Image}`
                    }
                ]
            }]
        });

        return {
            filename: basename(imagePath),
            description: response.output_text,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Error processing ${imagePath}:`, error.message);
        return {
            filename: basename(imagePath),
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
};

// Process all images in a directory
const processDirectory = async (inputDir, outputDir) => {
    // Validate input directory
    if (!existsSync(inputDir)) {
        throw new Error(`Input directory '${inputDir}' does not exist`);
    }

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    // Get all PNG files
    const imageFiles = readdirSync(inputDir)
        .filter(file => file.toLowerCase().endsWith('.png'))
        .sort();

    if (imageFiles.length === 0) {
        console.log(`No PNG images found in ${inputDir}`);
        return;
    }

    console.log(`Found ${imageFiles.length} PNG images to process`);

    // Process each image
    for (const imageFile of imageFiles) {
        console.log(`Processing ${imageFile}...`);
        
        const imagePath = join(inputDir, imageFile);
        const result = await analyzeImage(imagePath);

        // Save result to JSON
        const outputFile = join(outputDir, `${basename(imageFile, '.png')}.json`);
        writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf8');
        
        console.log(`Saved analysis to ${outputFile}`);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

// Main function
const main = async () => {
    const inputDir = process.argv[2] || "../images/Chapter 1 - Intro_editedversion_freeElective_report";
    const outputDir = process.argv[3] || "../chapter-1/data";

    try {
        await processDirectory(inputDir, outputDir);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

// Run the script
main(); 