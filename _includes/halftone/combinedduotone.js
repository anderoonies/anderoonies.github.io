const duotone = createCanvas(1, 1);
attach(duotone);
const duotoneCtx = duotone.getContext("2d");

const [duotoneAngleSlider, duotoneAngleSliderLabel] = createSlider(
  0,
  89,
  45,
  (v) => `${v} degree offset`
);
attach(duotoneAngleSliderLabel);
attach(duotoneAngleSlider);

stillLifeReady.then(() => {
  resize(duotone, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
  duotoneCtx.globalAlpha = 0.8;

  const drawDuotone = () => {
    halftone({
      angle: duotoneAngleSlider.value,
      dotSize: 5,
      dotResolution: 3,
      targetCtx: duotoneCtx,
      sourceCtx: stillLifeLayerOneCtx,
      width: STILL_LIFE_WIDTH,
      height: STILL_LIFE_HEIGHT,
      color: "brown",
      layer: true,
    });
    halftone({
      angle: 0,
      dotSize: 5,
      dotResolution: 3,
      targetCtx: duotoneCtx,
      sourceCtx: stillLifeLayerTwoCtx,
      width: STILL_LIFE_WIDTH,
      height: STILL_LIFE_HEIGHT,
      color: "black",
      layer: true,
    });
  };
  duotoneAngleSlider.addEventListener("input", () => {
    duotoneCtx.clearRect(0, 0, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    drawDuotone();
  });
  drawDuotone();
});
