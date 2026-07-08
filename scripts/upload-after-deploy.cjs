const fs = require('fs');
const FormData = require('form-data');
const https = require('https');

const images = [
  {
    filename: "gallery1_couple_banquet.jpg",
    category: "pre-wedding",
    caption: "The Blessed Couple entering the Grand Banquet Hall"
  },
  {
    filename: "gallery2_nikah_stage.jpg",
    category: "ceremony",
    caption: "Nikah Stage - Traditional Low Seating & Soft Drapes"
  },
  {
    filename: "gallery3_walima_banquet.jpg",
    category: "reception",
    caption: "Walima Reception Banquet - Emerald and Gold Tableware"
  }
];

async function uploadImage(workerUrl, filename, category, caption) {
  const imagePath = `uploads/${filename}`;
  if (!fs.existsSync(imagePath)) {
    console.log(`❌ File not found: ${imagePath}`);
    return;
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(imagePath), {
    filename: filename,
    contentType: 'image/jpeg'
  });
  formData.append('category', category);
  formData.append('caption', caption);

  return new Promise((resolve, reject) => {
    const req = https.request(`${workerUrl}/api/upload`, {
      method: 'POST',
      headers: formData.getHeaders()
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            console.log(`✅ Uploaded ${filename} (ID: ${result.id})`);
            resolve(result);
          } else {
            console.error(`❌ Failed to upload ${filename}:`, result.error);
            reject(new Error(result.error));
          }
        } catch (error) {
          console.error(`❌ Failed to parse response for ${filename}:`, error.message);
          reject(error);
        }
      });
    });

    req.on('error', reject);
    formData.pipe(req);
  });
}

async function main() {
  const workerUrl = process.argv[2];
  
  if (!workerUrl) {
    console.error('Usage: node upload-after-deploy.cjs <worker-url>');
    console.error('Example: node upload-after-deploy.cjs https://your-worker.pages.dev');
    process.exit(1);
  }

  console.log(`Uploading images to ${workerUrl}...`);
  
  for (const image of images) {
    try {
      await uploadImage(workerUrl, image.filename, image.category, image.caption);
    } catch (error) {
      console.error(`Failed to upload ${image.filename}:`, error.message);
    }
  }
  
  console.log('\n✨ Upload complete!');
}

main().catch(console.error);
