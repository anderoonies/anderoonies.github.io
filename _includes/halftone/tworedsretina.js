const devicePixelRatio = window.devicePixelRatio || 1;

const devicePixelRatioLabel = document.createElement("span");
devicePixelRatioLabel.innerHTML = `You ${
  devicePixelRatio > 1 ? "do" : "do not"
} have a retina (or similar) display`;
attach(devicePixelRatioLabel);
(() => {
  const width = 100 * devicePixelRatio;
  const height = 100 * devicePixelRatio;
  const worseRed = createCanvas(width, height);
  worseRed.style.width = "100px";
  worseRed.style.height = "100px";
  const worseRedCtx = worseRed.getContext("2d");
  worseRedCtx.scale(devicePixelRatio, devicePixelRatio);
  const worseRedLabel = document.createElement("label");
  worseRedLabel.innerHTML = "Worse red";
  attach(worseRedLabel);
  attach(worseRed);

  const betterRed = createCanvas(100, 100);
  betterRed.style.width = "100px";
  betterRed.style.height = "100px";
  const betterRedCtx = betterRed.getContext("2d");
  betterRedCtx.scale(devicePixelRatio, devicePixelRatio);
  const betterRedLabel = document.createElement("label");
  betterRedLabel.innerHTML = "Less worse red";
  attach(betterRedLabel);
  attach(betterRed);

  (() => {
    const inMemoryCanvas = createCanvas(width, height);
    const grayscaleCtx = inMemoryCanvas.getContext("2d");
    grayscaleCtx.scale(devicePixelRatio, devicePixelRatio);
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
      for (let y = 0; y < width; y++) {
        for (let x = 0; x < height; x++) {
          const colorData = [255, 0, 0, 255];
          const keyValue = 0;
          const index = positionToDataIndex(x, y, width);
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
        width: width,
        height: height,
        color: color,
        layer: true,
      });
      halftone({
        angle: angle,
        dotSize: 2,
        dotResolution: 3,
        targetCtx: betterRedCtx,
        sourceCtx: grayscaleCtx,
        width: width,
        height: height,
        color: color,
        layer: true,
      });
    });
  })();
})();
