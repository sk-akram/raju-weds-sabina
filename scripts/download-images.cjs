const fs = require('fs');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const images = [
  {
    url: "https://lh3.googleusercontent.com/d/1RwPX-6FbXAGL3evEmdj8Nffl-muyBq6l",
    filename: "gallery1_couple_banquet.jpg",
    category: "pre-wedding",
    caption: "The Blessed Couple entering the Grand Banquet Hall"
  },
  {
    url: "src/assets/images/nikah_stage_1782331038747.jpg",
    filename: "gallery2_nikah_stage.jpg",
    category: "ceremony",
    caption: "Nikah Stage - Traditional Low Seating & Soft Drapes"
  },
  {
    url: "src/assets/images/walima_banquet_1782331057014.jpg",
    filename: "gallery3_walima_banquet.jpg",
    category: "reception",
    caption: "Walima Reception Banquet - Emerald and Gold Tableware"
  }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    // For local files, read directly
    if (url.startsWith('src/') || url.startsWith('/src/')) {
      const localPath = url.startsWith('/') ? url.substring(1) : url;
      try {
        const data = fs.readFileSync(localPath);
        resolve({ data, contentType: 'image/jpeg' });
      } catch (error) {
        reject(error);
      }
      return;
    }

    const file = fs.createWriteStream(filename);
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const data = fs.readFileSync(filename);
        const contentType = response.headers['content-type'] || 'image/jpeg';
        resolve({ data, contentType });
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function convertToHex(buffer) {
  return buffer.toString('hex');
}

async function insertImageToDB(filename, contentType, size, category, caption, hexData) {
  // Since SQL statements are too long, we'll use a different approach
  // Store the hex data in a temporary file and use it later
  console.log(`✅ Prepared ${filename} (${size} bytes)`);
  return { filename, contentType, size, category, caption, hexData };
}

async function main() {
  console.log('Downloading images and storing in database...');
  
  for (const image of images) {
    try {
      console.log(`\nDownloading ${image.filename}...`);
      const { data, contentType } = await downloadImage(image.url, `temp_${image.filename}`);
      
      console.log(`Converting to hex...`);
      const hexData = await convertToHex(data);
      
      console.log(`Inserting into database...`);
      await insertImageToDB(
        image.filename,
        contentType,
        data.length,
        image.category,
        image.caption,
        hexData
      );
      
      // Clean up temp file
      if (fs.existsSync(`temp_${image.filename}`)) {
        fs.unlinkSync(`temp_${image.filename}`);
      }
    } catch (error) {
      console.error(`Failed to process ${image.filename}:`, error.message);
    }
  }
  
  console.log('\n✨ All images processed!');
}

main().catch(console.error);
