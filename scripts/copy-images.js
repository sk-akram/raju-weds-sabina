import fs from 'fs';
import path from 'path';

const sourceDir = path.join(process.cwd(), 'public', 'images');
const targetDir = path.join(process.cwd(), 'dist', 'images');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all .jpg and .png files
const files = fs.readdirSync(sourceDir);
files.forEach(file => {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file}`);
  }
});

console.log('Images copied successfully');
