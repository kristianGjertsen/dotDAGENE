# Footer browser tests

Run from `frontend`:

```sh
npx playwright install chromium firefox webkit
npm run test:footer
```

The suite builds the current code and serves it on port 4187. It compares actual
screenshots within each browser to verify the light and warp separately, then
checks fading, pointer leave, touch, viewport changes and reduced motion.
WebKit exercises Safari's engine; it is not a test of the installed Safari app.

`svgImageLoader.test.ts` checks pending image loads, dropped intermediate
frames, load failures and cancellation when leaving the footer.

## Compatibility change

The light uses a persistent SVG mask on an SVG image, with the original paths,
radial gradient and blur. Only the path/position attributes change each frame;
there is no CSS mask image URL to reload while the pointer moves.

The warp gradient is drawn directly on canvas and loaded as PNG before being
passed to `feImage`, removing the intermediate SVG encode/decode. The SVG owning
the filter has a nonzero viewport; both modern `href` and namespaced `xlink:href`
are set for image compatibility. Only the latest pending update is retained; a completed
load cannot reactivate the effect after pointer leave or a viewport change.

The tests intermittently captured an entirely invisible light layer with changing
CSS mask image URLs in Firefox and WebKit. Preloading alone did not reliably
resolve this; the persistent SVG mask removes that loading/rendering path.
The reported missing Safari warp was not reproduced in the isolated engines, so
it still needs confirmation in the affected Safari installation.
