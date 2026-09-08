import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSvgImageLoader } from '../src/components/PageSections/Footer/svgImageLoader';

test('loads before applying, keeps only the latest pending frame, and discards canceled loads', async () => {
  const original = globalThis.Image;
  const images: FakeImage[] = [];
  class FakeImage {
    src = '';
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor() {
      images.push(this);
    }
    decode() {
      return Promise.resolve();
    }
  }
  globalThis.Image = FakeImage as unknown as typeof Image;
  try {
    const applied: string[] = [];
    const loader = createSvgImageLoader((url) => applied.push(url));
    loader.update('first');
    loader.update('skipped');
    loader.update('latest');
    assert.deepEqual(applied, []);
    assert.equal(images.length, 1);
    images[0].onload?.();
    await Promise.resolve();
    assert.deepEqual(applied, ['first']);
    assert.equal(images[1].src, 'latest');
    images[1].onload?.();
    loader.reset();
    await Promise.resolve();
    assert.deepEqual(applied, ['first']);
    loader.update('failed');
    images[2].onerror?.();
    loader.update('reentered');
    images[3].onload?.();
    await Promise.resolve();
    assert.deepEqual(applied, ['first', 'reentered']);
  } finally {
    globalThis.Image = original;
  }
});
