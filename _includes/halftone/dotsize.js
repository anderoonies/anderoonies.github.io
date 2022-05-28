const dotsizeCanvas = document.createElement("canvas");
dotsizeCanvas.width = WIDTH;
dotsizeCanvas.height = HEIGHT;
dotsizeCanvas.style.width = `${WIDTH}px`;
dotsizeCanvas.style.height = `${HEIGHT}px`;
attach(dotsizeCanvas);
const dotsizeCtx = dotsizeCanvas.getContext("2d");

(() => {
  const [dotsizeSlider, dotsizeLabel] = createSlider(
    1,
    20,
    PIXELS_PER_DOT,
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
    halftone({
      angle: 0,
      dotSize: dotsize,
      dotResolution: resolution,
      targetCtx: dotsizeCtx,
      sourceCtx: sourceCtx,
      width: WIDTH,
      height: HEIGHT,
    });
  };

  dotsizeSlider.addEventListener("input", () => {
    redraw();
  });
  resolutionSlider.addEventListener("input", () => {
    redraw();
  });

  redraw();
})();
