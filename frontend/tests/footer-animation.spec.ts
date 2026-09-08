import { expect, test, type Page } from '@playwright/test';
import sharp from 'sharp';

async function changedPixels(before: Buffer, after: Buffer) {
  const [a, b] = await Promise.all(
    [before, after].map((png) => sharp(png).removeAlpha().raw().toBuffer()),
  );
  expect(a.length).toBe(b.length);
  let changed = 0;
  for (let i = 0; i < a.length; i += 3) {
    if (
      Math.abs(a[i] - b[i]) +
        Math.abs(a[i + 1] - b[i + 1]) +
        Math.abs(a[i + 2] - b[i + 2]) >
      12
    )
      changed++;
  }
  return changed;
}

async function openFooter(page: Page) {
  await page.addInitScript(() => {
    Math.random = () => 0.4;
  });
  await page.goto('/');
  const footer = page.locator('footer');
  await footer.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(footer).toBeVisible();
  const box = await footer.boundingBox();
  if (!box) throw new Error('Footer has no bounds');
  return { footer, box };
}

test('light renders while moving, fades and clears on leave', async ({
  page,
}) => {
  const { footer, box } = await openFooter(page);
  await page.addStyleTag({
    content: '.footer-pattern__background { filter: none !important; }',
  });
  const baseline = await footer.screenshot();
  await page.mouse.move(box.width * 0.2, box.y + box.height * 0.55);
  for (let i = 0; i < 20; i++) {
    await page.mouse.move(
      box.width * (0.2 + i * 0.02),
      box.y + box.height * 0.55,
    );
    await page.waitForTimeout(16);
  }
  await expect(footer.locator('.footer-pattern__draw-surface svg')).toHaveCSS(
    'visibility',
    'visible',
  );
  const moving = await footer.screenshot();
  expect(await changedPixels(baseline, moving)).toBeGreaterThan(1000);
  await page.waitForTimeout(1400);
  const settled = await footer.screenshot();
  expect(await changedPixels(baseline, settled)).toBeGreaterThan(1000);
  expect(await changedPixels(moving, settled)).toBeGreaterThan(100);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(100);
  expect(await changedPixels(baseline, await footer.screenshot())).toBeLessThan(
    20,
  );
});

test('warp displaces the pattern independently of the light', async ({
  page,
}) => {
  const { footer, box } = await openFooter(page);
  await page.addStyleTag({
    content: '.footer-pattern__effect--draw { display: none !important; }',
  });
  const baseline = await footer.screenshot();
  await page.mouse.move(box.width * 0.2, box.y + box.height * 0.55);
  await page.waitForTimeout(80);
  await page.mouse.move(box.width * 0.5, box.y + box.height * 0.55);
  await page.waitForTimeout(200);
  const changed = await changedPixels(baseline, await footer.screenshot());
  const { width = 0, height = 0 } = await sharp(baseline).metadata();
  expect(changed).toBeGreaterThan(1000);
  // Displacement is local: hiding/moving the entire pattern is not a pass.
  expect(changed).toBeLessThan(width * height * 0.25);
});

test('small screens and touch do not activate the effect', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 900 });
  const { footer, box } = await openFooter(page);
  await page.mouse.move(300, box.y + 100);
  await page.waitForTimeout(100);
  await expect(page.locator('feImage')).not.toHaveAttribute('href');
  await expect(page.locator('feDisplacementMap')).toHaveAttribute('scale', '0');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await footer.dispatchEvent('pointermove', {
    pointerType: 'touch',
    clientX: 300,
    clientY: 600,
  });
  await page.waitForTimeout(100);
  await expect(page.locator('feDisplacementMap')).toHaveAttribute('scale', '0');
});

test('resizing during animation clears pending images', async ({ page }) => {
  const { footer, box } = await openFooter(page);
  await page.mouse.move(box.width * 0.3, box.y + 100);
  await page.setViewportSize({ width: 600, height: 900 });
  await page.waitForTimeout(150);
  await expect(page.locator('feDisplacementMap')).toHaveAttribute('scale', '0');
  await expect(footer.locator('.footer-pattern__effect--draw')).toHaveCSS(
    'display',
    'none',
  );
});

test('reduced motion disables warp and the trailing path', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { footer, box } = await openFooter(page);
  await page.mouse.move(box.width * 0.3, box.y + 100);
  await page.waitForTimeout(80);
  await page.mouse.move(box.width * 0.5, box.y + 100);
  await expect(footer.locator('.footer-pattern__draw-surface svg')).toHaveCSS(
    'visibility',
    'visible',
  );
  await expect(footer.locator('mask path')).toHaveCount(0);
  await expect(footer.locator('.footer-pattern__background')).toHaveCSS(
    'filter',
    'none',
  );
});
