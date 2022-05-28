const customColorCanvas = createCanvas(1, 1);
attach(customColorCanvas);

const pickerOne = document.createElement("input");
pickerOne.type = "color";
pickerOne.value = "gray";
attach(pickerOne);

const pickerTwo = document.createElement("input");
pickerTwo.type = "color";
pickerOne.value = "black";
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
    customColorCtx.clearRect(0, 0, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    halftone(
      0,
      3,
      3,
      customColorCtx,
      stillLifeCtx,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT,
      colorOne,
      true
    );
    halftone(
      duotoneAngleSlider.value,
      3,
      3,
      customColorCtx,
      stillLifeCtx,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT,
      colorTwo,
      true
    );
  };
  drawCustomDuotone();
});
