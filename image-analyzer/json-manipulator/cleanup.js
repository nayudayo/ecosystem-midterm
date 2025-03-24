import { readdirSync, unlinkSync, renameSync } from 'fs';
import { join } from 'path';

const cleanupDirectory = (dirPath) => {
    try {
        // Get all files in the directory
        const files = readdirSync(dirPath);
        
        // First, remove all .json files that don't have .backup extension
        files.filter(file => file.endsWith('.json') && !file.endsWith('.json.backup'))
            .forEach(file => {
                const filePath = join(dirPath, file);
                try {
                    unlinkSync(filePath);
                    console.log(`Removed: ${filePath}`);
                } catch (error) {
                    console.error(`Error removing ${filePath}:`, error.message);
                }
            });
        
        // Then rename all .json.backup files to .json
        files.filter(file => file.endsWith('.json.backup'))
            .forEach(file => {
                const oldPath = join(dirPath, file);
                const newPath = join(dirPath, file.replace('.backup', ''));
                try {
                    renameSync(oldPath, newPath);
                    console.log(`Renamed: ${oldPath} -> ${newPath}`);
                } catch (error) {
                    console.error(`Error renaming ${oldPath}:`, error.message);
                }
            });
    } catch (error) {
        console.error(`Error processing directory ${dirPath}:`, error.message);
    }
};

// Main function
const main = async () => {
    // Process each chapter's data directory
    const chapters = ['chapter-1'];
    
    for (const chapter of chapters) {
        const dataDir = join('..', chapter, 'data');
        console.log(`\nProcessing ${dataDir}...`);
        cleanupDirectory(dataDir);
    }
};

// Run the script
main(); 