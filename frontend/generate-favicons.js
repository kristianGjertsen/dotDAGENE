import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import pngToIco from 'png-to-ico';

const svgPath = join(process.cwd(), 'public', 'favicon.svg');
const publicDir = join(process.cwd(), 'public');

async function generateFavicons() {
  try {
    const svgBuffer = readFileSync(svgPath);
    
    const favicon48Path = join(publicDir, 'favicon-48x48.png');
    const favicon32Path = join(publicDir, 'favicon-32x32.png');
    const favicon16Path = join(publicDir, 'favicon-16x16.png');
    
    // Generate 48x48 PNG (explicit for HTML + source for favicon.ico)
    await sharp(svgBuffer)
      .resize(48, 48, { fit: 'cover' })
      .png()
      .toFile(favicon48Path);
    
    // Generate 32x32 PNG
    await sharp(svgBuffer)
      .resize(32, 32, { fit: 'cover' })
      .png()
      .toFile(favicon32Path);
    
    // Generate 16x16 PNG
    await sharp(svgBuffer)
      .resize(16, 16, { fit: 'cover' })
      .png()
      .toFile(favicon16Path);

    // Generate a real .ico file (Google Search expects ICO format)
    const icoBuffer = await pngToIco([favicon16Path, favicon32Path, favicon48Path]);
    writeFileSync(join(publicDir, 'favicon.ico'), icoBuffer);
    
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
    console.log('   - favicon.ico (ICO with 16/32/48 sizes) - Google Search uses this');
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
