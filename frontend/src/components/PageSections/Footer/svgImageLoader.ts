// Load each image before replacing the displayed frame, retaining only the latest
// pending update. The caller supplies an already rasterized warp map.
export const createSvgImageLoader = (apply: (url: string) => void) => {
  let pending: string | null = null;
  let loading = false;
  let generation = 0;
  let activeImage: HTMLImageElement | null = null;

  const load = () => {
    if (loading || pending === null) return;
    const url = pending;
    const currentGeneration = generation;
    pending = null;
    loading = true;
    const image = new Image();
    activeImage = image;
    const finish = (success: boolean, resolvedUrl = url) => {
      if (currentGeneration !== generation) return;
      image.onload = null;
      image.onerror = null;
      activeImage = null;
      loading = false;
      if (success) apply(resolvedUrl);
      load();
    };
    image.onload = () => {
      void (async () => {
        await image.decode();
        if (currentGeneration !== generation) return;
        finish(true);
      })().catch(() => finish(false));
    };
    image.onerror = () => finish(false);
    image.src = url;
  };

  return {
    update(url: string) {
      pending = url;
      load();
    },
    reset() {
      generation += 1;
      pending = null;
      loading = false;
      if (activeImage) {
        activeImage.onload = null;
        activeImage.onerror = null;
        activeImage = null;
      }
    },
  };
};
