const stillLifeLayerOne = createCanvas(1, 1);
attach(stillLifeLayerOne);
const stillLifeLayerOneCtx = stillLifeLayerOne.getContext("2d");

const stillLifeLayerTwo = createCanvas(1, 1);
attach(stillLifeLayerTwo);
const stillLifeLayerTwoCtx = stillLifeLayerTwo.getContext("2d");

stillLifeReady.then(() => {
  resize(stillLifeLayerOne, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
  resize(stillLifeLayerTwo, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);

  const duotoneThreshold = 127;
  const stillLifeImageData = stillLifeCtx.getImageData(
    0,
    0,
    STILL_LIFE_WIDTH,
    STILL_LIFE_HEIGHT
  );
  const layerOneImageData = stillLifeLayerOneCtx.getImageData(
    0,
    0,
    STILL_LIFE_WIDTH,
    STILL_LIFE_HEIGHT
  );
  const layerTwoImageData = stillLifeLayerTwoCtx.getImageData(
    0,
    0,
    STILL_LIFE_WIDTH,
    STILL_LIFE_HEIGHT
  );
  // separate the image so that values darker than 100
  // are only in layer one
  for (let y = 0; y < STILL_LIFE_HEIGHT; y++) {
    for (let x = 0; x < STILL_LIFE_WIDTH; x++) {
      const index = positionToDataIndex(x, y, STILL_LIFE_WIDTH);
      const [r, g, b, a] = [
        stillLifeImageData.data[index + 0],
        stillLifeImageData.data[index + 1],
        stillLifeImageData.data[index + 2],
        stillLifeImageData.data[index + 3],
      ];
      const value = (r + g + b) / 3;
      if (value < duotoneThreshold) {
        const adjustedValue = map(value, 0, duotoneThreshold, 0, 255);
        layerTwoImageData.data[index + 0] = adjustedValue;
        layerTwoImageData.data[index + 1] = adjustedValue;
        layerTwoImageData.data[index + 2] = adjustedValue;
        layerTwoImageData.data[index + 3] = 255;
      }
      layerOneImageData.data[index + 0] = value;
      layerOneImageData.data[index + 1] = value;
      layerOneImageData.data[index + 2] = value;
      layerOneImageData.data[index + 3] = 255;
    }
  }
  stillLifeLayerOneCtx.putImageData(layerOneImageData, 0, 0);
  stillLifeLayerTwoCtx.putImageData(layerTwoImageData, 0, 0);
});
