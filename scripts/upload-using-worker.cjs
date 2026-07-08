const fs = require('fs');
const { execSync } = require('child_process');

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

async function uploadImage(filename, category, caption) {
  const imagePath = `uploads/${filename}`;
  if (!fs.existsSync(imagePath)) {
    console.log(`❌ File not found: ${imagePath}`);
    return;
  }

  const data = fs.readFileSync(imagePath);
  const hexData = data.toString('hex');
  const size = data.length;

  // Create a temporary worker script to handle the upload
  const workerScript = `
export default {
  async fetch(request, env) {
    const sql = "INSERT INTO images (filename, content_type, size, category, caption, image_data) VALUES (?, ?, ?, ?, ?, x'${hexData}')";
    const result = await env.DB.prepare(sql)
      .bind('${filename}', 'image/jpeg', ${size}, '${category}', '${caption}')
      .run();
    return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }));
  }
};
`;

  fs.writeFileSync('temp-upload-worker.js', workerScript);

  try {
    // Deploy temporary worker and execute
    const command = `./node_modules/.bin/wrangler deploy --name temp-upload-worker --compatibility-date=2024-01-01 --var DB:binding=raju-weds-sabina`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Uploaded ${filename}`);
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
  } finally {
    // Clean up
    if (fs.existsSync('temp-upload-worker.js')) {
      fs.unlinkSync('temp-upload-worker.js');
    }
  }
}

async function main() {
  console.log('Uploading images using temporary worker...');
  
  for (const image of images) {
    await uploadImage(image.filename, image.category, image.caption);
  }
  
  console.log('\n✨ Upload complete!');
}

main().catch(console.error);
