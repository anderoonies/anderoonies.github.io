const dotsizeCanvas = document.createElement("canvas");
dotsizeCanvas.width = WIDTH;
dotsizeCanvas.height = HEIGHT;
dotsizeCanvas.style.width = `${WIDTH}px`;
dotsizeCanvas.style.height = `${HEIGHT}px`;
attach(dotsizeCanvas);
const dotsizeCtx = dotsizeCanvas.getContext("2d");

halftone(
  0,
  PIXELS_PER_DOT,
  PIXELS_PER_DOT,
  dotsizeCtx,
  sourceCtx,
  WIDTH,
  HEIGHT
);

(() => {
  const [dotsizeSlider, dotsizeLabel] = createSlider(
    1,
    20,
    10,
    (v) => `${v} pixels per dot`
  );
  attach(dotsizeSlider);
  attach(dotsizeLabel);
  dotsizeSlider.addEventListener("input", () => {
    const dotsize = parseInt(dotsizeSlider.value, 10);
    halftone(0, dotsize, dotsize, dotsizeCtx, sourceCtx, WIDTH, HEIGHT);
  });
})();
