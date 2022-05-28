const stillLifeHalftoneCanvas = createCanvas(1, 1);
attach(stillLifeHalftoneCanvas);

stillLifeReady.then(() => {
  resize(stillLifeHalftoneCanvas, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
  const halftoneCtx = stillLifeHalftoneCanvas.getContext("2d");

  halftone({
    angle: 0,
    dotSize: 5,
    dotResolution: 3,
    targetCtx: halftoneCtx,
    sourceCtx: stillLifeCtx,
    width: STILL_LIFE_WIDTH,
    height: STILL_LIFE_HEIGHT,
    color: "black",
  });
});
