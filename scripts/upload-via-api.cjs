const fs = require('fs');
const https = require('https');
const http = require('http');

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

async function uploadViaAPI(filename, contentType, category, caption, imageData) {
  // This will work after the worker is deployed
  // For now, we'll save the data for later upload
  const formData = new FormData();
  const blob = new Blob([imageData], { type: contentType });
  formData.append('file', blob, filename);
  formData.append('category', category);
  formData.append('caption', caption);

  try {
    const response = await fetch('http://localhost:8787/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      console.log(`✅ Uploaded ${filename} via API (ID: ${result.id})`);
    } else {
      console.error(`❌ Failed to upload ${filename}:`, result.error);
    }
  } catch (error) {
    console.error(`❌ API not available for ${filename}:`, error.message);
    // Save to file for later upload
    fs.writeFileSync(`uploads/${filename}`, imageData);
    console.log(`💾 Saved ${filename} to uploads/ directory for manual upload`);
  }
}

async function main() {
  console.log('Preparing images for upload...');
  
  // Create uploads directory
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
  
  for (const image of images) {
    try {
      console.log(`\nDownloading ${image.filename}...`);
      const { data, contentType } = await downloadImage(image.url, `temp_${image.filename}`);
      
      console.log(`Saving to uploads directory...`);
      fs.writeFileSync(`uploads/${image.filename}`, data);
      console.log(`✅ Saved ${image.filename} to uploads/`);
      
      // Clean up temp file
      if (fs.existsSync(`temp_${image.filename}`)) {
        fs.unlinkSync(`temp_${image.filename}`);
      }
    } catch (error) {
      console.error(`Failed to process ${image.filename}:`, error.message);
    }
  }
  
  console.log('\n✨ Images saved to uploads/ directory!');
  console.log('After deploying the worker, you can upload these images via the API or manually.');
}

main().catch(console.error);
