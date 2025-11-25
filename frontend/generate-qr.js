import path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow overriding via env vars if you need different URLs or output sizes.
const targetUrl = process.env.QR_URL ?? 'https://dotdagene.no';
const outputRelative = process.env.QR_OUT ?? 'public/qr-dotdagene.png';
const size = Number(process.env.QR_SIZE ?? 512);

async function main() {
  try {
    const outputPath = path.resolve(__dirname, outputRelative);
    await QRCode.toFile(outputPath, targetUrl, {
      width: size,
      margin: 2,
    });
    console.log(`QR-kode generert for ${targetUrl}`);
    console.log(`Fil: ${outputPath} (størrelse: ${size}px)`);
  } catch (error) {
    console.error('Kunne ikke generere QR-kode:', error);
    process.exitCode = 1;
  }
}

main();
