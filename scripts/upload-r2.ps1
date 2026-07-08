# Upload images to R2 bucket
Write-Host "Uploading images to R2 bucket..."

./node_modules/.bin/wrangler r2 object put wedding-images/images/wedding_hero_backdrop_1782331025471.jpg --file=src/assets/images/wedding_hero_backdrop_1782331025471.jpg
./node_modules/.bin/wrangler r2 object put wedding-images/images/walima_banquet_1782331057014.jpg --file=src/assets/images/walima_banquet_1782331057014.jpg
./node_modules/.bin/wrangler r2 object put wedding-images/images/nikah_stage_1782331038747.jpg --file=src/assets/images/nikah_stage_1782331038747.jpg
./node_modules/.bin/wrangler r2 object put wedding-images/images/couple_illustration_1782328215470.jpg --file=src/assets/images/couple_illustration_1782328215470.jpg

Write-Host "Images uploaded to R2 successfully!"
