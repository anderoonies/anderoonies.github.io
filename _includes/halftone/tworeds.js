const worseRed = createCanvas(100, 100);
const worseRedCtx = worseRed.getContext("2d");
const worseRedLabel = document.createElement("label");
worseRedLabel.innerHTML = "Worse red";
attach(worseRedLabel);
attach(worseRed);

const betterRed = createCanvas(100, 100);
const betterRedCtx = betterRed.getContext("2d");
const betterRedLabel = document.createElement("label");
betterRedLabel.innerHTML = "Less worse red";
attach(betterRedLabel);
attach(betterRed);

const opacityRed = createCanvas(100, 100);
const opacityRedCtx = opacityRed.getContext("2d");
opacityRedCtx.globalAlpha = 0.7;
const opacityRedLabel = document.createElement("label");
opacityRedLabel.innerHTML = "0.7 globalAlpha";
attach(opacityRedLabel);
attach(opacityRed);

const angles = {
  yellow: 0,
  cyan: 15,
  key: 75,
  magenta: 45,
};

(() => {
  const inMemoryCanvas = createCanvas(100, 100);
  const grayscaleCtx = inMemoryCanvas.getContext("2d");
  const grayscaleImageData = grayscaleCtx.getImageData(
    0,
    0,
    inMemoryCanvas.width,
    inMemoryCanvas.height
  );

  [
    { angle: angles.yellow, color: "yellow", channel: 2 },
    {
      angle: angles.magenta,
      color: "magenta",
      channel: 1,
    },
    { angle: angles.cyan, color: "cyan", channel: 0 },
    { angle: angles.key, color: "black", key: true },
  ].forEach(({ angle, color, channel, key }) => {
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x < 100; x++) {
        const colorData = [255, 0, 0, 255];
        const keyValue = 0;
        const index = positionToDataIndex(x, y, 100);
        if (key) {
          grayscaleImageData.data[index + 0] = 255 - keyValue;
          grayscaleImageData.data[index + 1] = 255 - keyValue;
          grayscaleImageData.data[index + 2] = 255 - keyValue;
          grayscaleImageData.data[index + 3] = 255;
        } else {
          const complement = 255 - colorData[channel];
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
      dotSize: 10,
      dotResolution: 10,
      targetCtx: worseRedCtx,
      sourceCtx: grayscaleCtx,
      width: 100,
      height: 100,
      color: color,
      layer: true,
    });
    halftone({
      angle: angle,
      dotSize: 2,
      dotResolution: 3,
      targetCtx: betterRedCtx,
      sourceCtx: grayscaleCtx,
      width: 100,
      height: 100,
      color: color,
      layer: true,
    });
    halftone({
      angle: angle,
      dotSize: 8,
      dotResolution: 10,
      targetCtx: opacityRedCtx,
      sourceCtx: grayscaleCtx,
      width: 100,
      height: 100,
      color: color,
      layer: true,
    });
  });
})();
