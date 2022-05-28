const grayHalftone = createCanvas(1, 1);
const grayHalftoneCtx = grayHalftone.getContext("2d");
const blackHalftone = createCanvas(1, 1);
const blackHalftoneCtx = blackHalftone.getContext("2d");
attach(grayHalftone);
attach(blackHalftone);
stillLifeReady.then(() => {
  resize(grayHalftone, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
  resize(blackHalftone, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);

  const halftoneGrayAndBlack = () => {
    halftone({
      angle: 0,
      dotSize:2,
      dotResolution: 3,
      grayHalftoneCtx,
      stillLifeCtx,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT,
      "black"
  });
    halftone(
      0,
      2,
      3,
      blackHalftoneCtx,
      stillLifeCtx,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT,
      "black"
    );
  };
  halftoneGrayAndBlack();
});
