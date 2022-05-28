const dotsizeCanvas = document.createElement("canvas");
dotsizeCanvas.width = WIDTH;
dotsizeCanvas.height = HEIGHT;
dotsizeCanvas.style.width = `${WIDTH}px`;
dotsizeCanvas.style.height = `${HEIGHT}px`;
attach(dotsizeCanvas);
const dotsizeCtx = dotsizeCanvas.getContext("2d");

halftone(
  0,
  PIXELS_PER_DOT / 2,
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
  attach(dotsizeLabel);
  attach(dotsizeSlider);

  const [resolutionSlider, resolutionSliderLabel] = createSlider(
    1,
    10,
    5,
    (v) => `${v} pixels between dots`
  );
  attach(resolutionSliderLabel);
  attach(resolutionSlider);

  const redraw = () => {
    const dotsize = parseInt(dotsizeSlider.value, 10);
    const resolution = parseInt(resolutionSlider.value, 10);
    halftone(0, dotsize / 2, resolution, dotsizeCtx, sourceCtx, WIDTH, HEIGHT);
  };

  dotsizeSlider.addEventListener("input", () => {
    redraw();
  });
  resolutionSlider.addEventListener("input", () => {
    redraw();
  });
})();
