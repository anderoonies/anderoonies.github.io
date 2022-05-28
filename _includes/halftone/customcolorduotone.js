const customColorCanvas = createCanvas(1, 1);
attach(customColorCanvas);

const pickerOne = document.createElement("input");
pickerOne.type = "color";
pickerOne.value = "gray";
const pickerOneLabel = document.createElement("label");
pickerOneLabel.innerHTML = "Color one";
attach(pickerOneLabel);
attach(pickerOne);

const pickerTwo = document.createElement("input");
pickerTwo.type = "color";
pickerOne.value = "black";
const pickerTwoLabel = document.createElement("label");
pickerTwoLabel.innerHTML = "Color two";
attach(pickerTwoLabel);
attach(pickerTwo);

stillLifeReady.then(() => {
  resize(customColorCanvas, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
  const customColorCtx = customColorCanvas.getContext("2d");

  let colorOne = "gray";
  let colorTwo = "black";
  pickerOne.addEventListener("input", () => {
    colorOne = pickerOne.value;
    drawCustomDuotone();
  });
  pickerTwo.addEventListener("input", () => {
    colorTwo = pickerTwo.value;
    drawCustomDuotone();
  });

  const drawCustomDuotone = () => {
    halftone({
      angle: 0,
      dotSize: 5,
      dotResolution: 3,
      targetCtx: customColorCtx,
      sourceCtx: stillLifeLayerOneCtx,
      width: STILL_LIFE_WIDTH,
      height: STILL_LIFE_HEIGHT,
      color: colorOne,
    });
    halftone({
      angle: duotoneAngleSlider.value,
      dotSize: 5,
      dotResolution: 3,
      targetCtx: customColorCtx,
      sourceCtx: stillLifeLayerTwoCtx,
      width: STILL_LIFE_WIDTH,
      height: STILL_LIFE_HEIGHT,
      color: colorTwo,
      layer: true,
    });
  };
  drawCustomDuotone();

  duotoneAngleSlider.addEventListener("input", () => {
    drawCustomDuotone();
  });
});
