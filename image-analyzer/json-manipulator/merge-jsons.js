import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const mergeChapterFiles = (chapterPath) => {
    try {
        const dataDir = join(chapterPath, 'data');
        
        // Get all JSON files in the data directory
        const files = readdirSync(dataDir)
            .filter(file => file.endsWith('.json'))
            .sort(); // Sort to maintain consistent order
        
        if (files.length === 0) {
            console.log(`No JSON files found in ${dataDir}`);
            return;
        }

        console.log(`Found ${files.length} JSON files in ${dataDir}`);
        
        // Array to hold all the content
        const mergedContent = {
            chapter_content: []
        };

        // Process each JSON file
        files.forEach(file => {
            const filePath = join(dataDir, file);
            try {
                const content = JSON.parse(readFileSync(filePath, 'utf8'));
                mergedContent.chapter_content.push(content);
            } catch (error) {
                console.error(`Error reading ${filePath}:`, error.message);
            }
        });

        // Write merged content to a single file in the chapter root
        const outputFile = join(chapterPath, 'merged.json');
        writeFileSync(outputFile, JSON.stringify(mergedContent, null, 2), 'utf8');
        console.log(`Created merged file: ${outputFile}`);

    } catch (error) {
        console.error(`Error processing chapter ${chapterPath}:`, error.message);
    }
};

// Main function
const main = async () => {
    // Process each chapter
    const chapters = ['chapter-1'];
    
    for (const chapter of chapters) {
        const chapterPath = join('..', '..', chapter);  // Added an extra '..' to go up one more directory level
        console.log(`\nProcessing ${chapter}...`);
        mergeChapterFiles(chapterPath);
    }
};

// Run the script
main(); 