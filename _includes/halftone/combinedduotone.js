const duotone = createCanvas(1, 1);
attach(duotone);
const duotoneCtx = duotone.getContext("2d");

const duotoneAngleSlider = document.createElement("input");
duotoneAngleSlider.type = "range";
duotoneAngleSlider.value = 45;
duotoneAngleSlider.min = 0;
duotoneAngleSlider.max = 89;
const duotoneAngleSliderLabel = document.createElement("span");
duotoneAngleSliderLabel.innerHTML = `${duotoneAngleSlider.value} degrees`;
attach(duotoneAngleSliderLabel);
attach(duotoneAngleSlider);

stillLifeReady.then(() => {
  resize(duotone, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);

  const drawDuotone = () => {
    halftone(
      duotoneAngleSlider.value,
      3,
      3,
      duotoneCtx,
      stillLifeCtx,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT,
      "crimson",
      true
    );
    halftone(
      0,
      2,
      3,
      duotoneCtx,
      stillLifeCtx,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT,
      "black",
      true
    );
  };
  duotoneAngleSlider.addEventListener("input", () => {
    duotoneCtx.clearRect(0, 0, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    drawDuotone();
    duotoneAngleSliderLabel.innerHTML = `${duotoneAngleSlider.value} degrees`;
  });
  drawDuotone();
});
