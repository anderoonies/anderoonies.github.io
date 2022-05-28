const container = document.currentScript.parentElement;
const stillLifeCanvas = createCanvas(1, 1);
const blackCanvas = createCanvas(1, 1);
const grayCanvas = createCanvas(1, 1);
const blackCtx = blackCanvas.getContext("2d");
const grayCtx = grayCanvas.getContext("2d");
attach(stillLifeCanvas);
attach(grayCanvas);
attach(blackCanvas);

const [thresholdSlider, thresholdSliderLabel] = createSlider(
  1,
  255,
  50,
  (v) => `<${v}`
);
attach(thresholdSlider);
attach(thresholdSliderLabel);

const stillLifeCtx = stillLifeCanvas.getContext("2d");
const stillLife = new Image();

let STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT;

const stillLifeReady = new Promise((resolve) => {
  stillLife.src = "/projects/halftone/stilllife.jpg";
  stillLife.onload = () => {
    STILL_LIFE_WIDTH = stillLife.width;
    STILL_LIFE_HEIGHT = stillLife.height;
    resize(stillLifeCanvas, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    resize(blackCanvas, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    resize(grayCanvas, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    stillLifeCtx.drawImage(stillLife, 0, 0);
    resolve();
  };
});

stillLifeReady.then(() => {
  const sourceImageData = stillLifeCtx.getImageData(
    0,
    0,
    STILL_LIFE_WIDTH,
    STILL_LIFE_HEIGHT
  );

  let threshold = 50;
  const split = (threshold) => {
    blackCtx.clearRect(0, 0, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    grayCtx.clearRect(0, 0, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    const blackImageData = blackCtx.getImageData(
      0,
      0,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT
    );
    const grayImageData = grayCtx.getImageData(
      0,
      0,
      STILL_LIFE_WIDTH,
      STILL_LIFE_HEIGHT
    );
    for (let y = 0; y < STILL_LIFE_HEIGHT; y++) {
      for (let x = 0; x < STILL_LIFE_WIDTH; x++) {
        const index = positionToDataIndex(x, y, STILL_LIFE_WIDTH);
        const [r, g, b] = [
          sourceImageData.data[index + 0],
          sourceImageData.data[index + 1],
          sourceImageData.data[index + 2],
        ];

        const value = (r + g + b) / 3;
        if (value < threshold) {
          blackImageData.data[index + 0] = value;
          blackImageData.data[index + 1] = value;
          blackImageData.data[index + 2] = value;
          blackImageData.data[index + 3] = 255;
        }
        grayImageData.data[index + 0] = value;
        grayImageData.data[index + 1] = value;
        grayImageData.data[index + 2] = value;
        grayImageData.data[index + 3] = 255;
      }
    }
    blackCtx.putImageData(blackImageData, 0, 0);
    grayCtx.putImageData(grayImageData, 0, 0);
  };
  thresholdSlider.addEventListener("input", () => {
    threshold = thresholdSlider.value;
    thresholdSliderLabel.innerHTML = `<${threshold}`;
    split(threshold);
  });

  split(threshold);
});
