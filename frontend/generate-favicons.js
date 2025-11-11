import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const svgPath = join(process.cwd(), 'public', 'favicon.svg');
const publicDir = join(process.cwd(), 'public');

async function generateFavicons() {
  try {
    const svgBuffer = readFileSync(svgPath);
    
    // Google requires favicon.ico to be at least 48x48 for search results
    // Generate 48x48 for favicon.ico (Google's preferred size for search)
    // SVG already has background, so we use 'cover' to ensure square output
    await sharp(svgBuffer)
      .resize(48, 48, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'favicon.ico'));
    
    // Generate 48x48 PNG (explicit for HTML)
    await sharp(svgBuffer)
      .resize(48, 48, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'favicon-48x48.png'));
    
    // Generate 32x32 PNG
    await sharp(svgBuffer)
      .resize(32, 32, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'favicon-32x32.png'));
    
    // Generate 16x16 PNG
    await sharp(svgBuffer)
      .resize(16, 16, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'favicon-16x16.png'));
    
    // Generate 192x192 for better quality when scaled
    await sharp(svgBuffer)
      .resize(192, 192, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'favicon-192x192.png'));
    
    // Generate 180x180 for Apple touch icon
    await sharp(svgBuffer)
      .resize(180, 180, { fit: 'cover' })
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    
    console.log('✅ Favicon files generated successfully!');
    console.log('   - favicon.ico (48x48) - Google Search uses this');
    console.log('   - favicon-48x48.png');
    console.log('   - favicon-32x32.png');
    console.log('   - favicon-16x16.png');
    console.log('   - favicon-192x192.png');
    console.log('   - apple-touch-icon.png');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();

