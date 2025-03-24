import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const removeComments = (str) => {
    // Remove single line comments and their content
    str = str.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments and their content
    str = str.replace(/\/\*[\s\S]*?\*\//g, '');
    return str;
};

const cleanJsonString = (str) => {
    // Remove comments
    str = removeComments(str);
    
    // Normalize line endings and remove line breaks within strings
    str = str.replace(/\r\n/g, '\n')  // Normalize line endings
             .replace(/\n\s*/g, ' ')   // Replace line breaks and following whitespace with a single space
             .replace(/\s+/g, ' ');    // Normalize multiple spaces to single space
    
    // Fix unquoted property names
    str = str.replace(/(\w+):/g, '"$1":');
    
    // Remove trailing commas
    str = str.replace(/,(\s*[}\]])/g, '$1');
    
    return str;
};

const reformatJson = (filePath) => {
    try {
        // Read the original JSON file
        const rawContent = readFileSync(filePath, 'utf8');
        let fileContent;
        
        try {
            fileContent = JSON.parse(rawContent);
        } catch (parseError) {
            // Try cleaning the JSON first
            const cleanedJson = cleanJsonString(rawContent);
            try {
                fileContent = JSON.parse(cleanedJson);
            } catch (error) {
                console.error(`Failed to parse JSON even after cleaning in ${filePath}`);
                console.error('Original error:', error.message);
                return;
            }
        }
        
        // Extract the actual JSON content from the description string
        const descriptionContent = fileContent.description
            .replace(/```json\\n|```json\n|```/g, '')  // Remove all markdown markers
            .trim();
        
        // Clean and parse the inner JSON
        const cleanedDescription = cleanJsonString(descriptionContent);
        let extractedContent;
        try {
            extractedContent = JSON.parse(cleanedDescription);
        } catch (error) {
            console.error(`Error parsing description content in ${filePath}:`, error.message);
            // Create a backup before attempting any fixes
            const backupPath = filePath + '.backup';
            writeFileSync(backupPath, rawContent);
            console.log(`Created backup at: ${backupPath}`);
            return;
        }
        
        // Create the new format
        const reformattedJson = {
            filename: fileContent.filename,
            timestamp: fileContent.timestamp,
            ...extractedContent
        };
        
        // Write back to the same file with pretty formatting
        writeFileSync(filePath, JSON.stringify(reformattedJson, null, 2), 'utf8');
        console.log(`Reformatted: ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
};

const processDirectory = (dirPath) => {
    try {
        // Get all JSON files in the directory
        const jsonFiles = readdirSync(dirPath)
            .filter(file => file.toLowerCase().endsWith('.json'));
        
        if (jsonFiles.length === 0) {
            console.log(`No JSON files found in ${dirPath}`);
            return;
        }
        
        console.log(`Found ${jsonFiles.length} JSON files to process in ${dirPath}`);
        
        // Process each JSON file
        for (const jsonFile of jsonFiles) {
            const filePath = join(dirPath, jsonFile);
            reformatJson(filePath);
        }
    } catch (error) {
        console.error(`Error processing directory ${dirPath}:`, error.message);
    }
};

// Main function
const main = async () => {
    // Process each chapter's data directory
    const chapters = ['chapter-1'];
    
    for (const chapter of chapters) {
        const dataDir = join('..', '..', chapter, 'data');  // Added an extra '..' to go up one more directory level
        console.log(`\nProcessing ${dataDir}...`);
        processDirectory(dataDir);
    }
};

// Run the script
main(); 