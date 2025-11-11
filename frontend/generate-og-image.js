import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, 'public');
const svgPath = join(__dirname, 'public', 'favicon.svg');
const logoPath = join(__dirname, 'src', 'assets', 'dotDAGENEhovedlogo.svg');

async function generateOGImage() {
  try {
    // Prøv å bruke hovedlogo først, hvis den finnes
    let svgBuffer;
    let usingLogo = false;
    
    if (existsSync(logoPath)) {
      svgBuffer = readFileSync(logoPath);
      usingLogo = true;
      console.log('✅ Using hovedlogo.svg');
    } else if (existsSync(svgPath)) {
      svgBuffer = readFileSync(svgPath);
      console.log('✅ Using favicon.svg');
    } else {
      throw new Error('No SVG file found');
    }

    // Resize SVG til passende størrelse
    const logoResized = await sharp(svgBuffer)
      .resize(usingLogo ? 900 : 600, usingLogo ? 300 : 300, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer();

    // Generer Open Graph bilde: 1200x630px (anbefalt størrelse for Google)
    // Bakgrunnsfarge: dotDAGENE grønn (#677b4c)
    const ogImagePath = join(publicDir, 'og-image.png');
    
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 103, g: 123, b: 76, alpha: 1 } // #677b4c
      }
    })
      .composite([
        {
          input: logoResized,
          top: usingLogo ? 165 : 165,
          left: usingLogo ? 150 : 300
        }
      ])
      .png()
      .toFile(ogImagePath);

    console.log('✅ Open Graph image generated successfully!');
    console.log(`   - og-image.png (1200x630px) at ${ogImagePath}`);
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    // Fallback: lag et enkelt farget bilde
    try {
      const ogImagePath = join(publicDir, 'og-image.png');
      await sharp({
        create: {
          width: 1200,
          height: 630,
          channels: 4,
          background: { r: 103, g: 123, b: 76, alpha: 1 }
        }
      })
        .png()
        .toFile(ogImagePath);
      console.log('✅ Generated fallback OG image (solid color)');
    } catch (fallbackError) {
      console.error('❌ Error generating fallback:', fallbackError.message);
      console.error('⚠️  You may need to create og-image.png manually (1200x630px)');
      process.exit(1);
    }
  }
}

generateOGImage();

