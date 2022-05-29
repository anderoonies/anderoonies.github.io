const compositeRedBirdCanvas = createCanvas(1, 1);
attach(compositeRedBirdCanvas);
const compositeRedBirdContext = compositeRedBirdCanvas.getContext("2d");
birdReady.then(() => {
  resize(compositeRedBirdCanvas, birdImage.width, birdImage.height);
  halftoneRedBird();
});

const halftoneRedBird = () => {
  const birdAngles = {
    green: 0,
    blue: 15,
    key: 75,
    red: 45,
  };
  const birdData = birdContext.getImageData(
    0,
    0,
    birdCanvas.width,
    birdCanvas.height
  );
  compositeRedBirdContext.fillStyle = "white";
  compositeRedBirdContext.fillRect(0, 0, birdCanvas.width, birdCanvas.height);

  const inMemoryCanvas = createCanvas(birdCanvas.width, birdCanvas.height);
  const grayscaleCtx = inMemoryCanvas.getContext("2d");
  const grayscaleImageData = grayscaleCtx.getImageData(
    0,
    0,
    inMemoryCanvas.width,
    inMemoryCanvas.height
  );
  [
    { angle: birdAngles.green, color: "green", channels: [0, 2] },
    {
      angle: birdAngles.red,
      color: "red",
      channels: [1, 2],
    },
    { angle: birdAngles.blue, color: "blue", channels: [0, 1] },
    { angle: birdAngles.key, color: KEY, key: true },
  ].forEach(({ angle, color, channels, key }) => {
    for (let y = 0; y < birdCanvas.height; y++) {
      for (let x = 0; x < birdCanvas.width; x++) {
        const index = positionToDataIndex(x, y, birdCanvas.width);
        const [r, g, b, a] = [
          birdData.data[index + 0],
          birdData.data[index + 1],
          birdData.data[index + 2],
          birdData.data[index + 3],
        ];
        const keyValue = 255 - Math.max(r, g, b);
        if (key) {
          grayscaleImageData.data[index + 0] = 255 - keyValue;
          grayscaleImageData.data[index + 1] = 255 - keyValue;
          grayscaleImageData.data[index + 2] = 255 - keyValue;
          grayscaleImageData.data[index + 3] = 255;
        } else {
          const complement =
            255 -
            (birdData.data[index + channels[0]] +
              birdData.data[index + channels[1]]) /
              2;
          grayscaleImageData.data[index + 0] = 255 - (complement - keyValue);
          grayscaleImageData.data[index + 1] = 255 - (complement - keyValue);
          grayscaleImageData.data[index + 2] = 255 - (complement - keyValue);
          grayscaleImageData.data[index + 3] = 255;
        }
      }
    }
    grayscaleCtx.putImageData(grayscaleImageData, 0, 0);
    halftone({
      angle: angle,
      dotSize: 3,
      dotResolution: 2,
      targetCtx: compositeRedBirdContext,
      sourceCtx: grayscaleCtx,
      width: birdCanvas.width,
      height: birdCanvas.height,
      color: color,
      layer: true,
    });
  });
};
