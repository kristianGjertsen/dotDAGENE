import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const svgPath = join(process.cwd(), 'public', 'favicon.svg');
const publicDir = join(process.cwd(), 'public');

async function generateFavicons() {
  try {
    const svgBuffer = readFileSync(svgPath);
    
    // Generate 16x16 PNG
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(join(publicDir, 'favicon-16x16.png'));
    
    // Generate 32x32 PNG
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(join(publicDir, 'favicon-32x32.png'));
    
    // Generate 180x180 for Apple touch icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(join(publicDir, 'apple-touch-icon.png'));
    
    // Generate ICO file (32x32)
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(join(publicDir, 'favicon.ico'));
    
    console.log('✅ Favicon files generated successfully!');
    console.log('   - favicon-16x16.png');
    console.log('   - favicon-32x32.png');
    console.log('   - apple-touch-icon.png');
    console.log('   - favicon.ico');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();

