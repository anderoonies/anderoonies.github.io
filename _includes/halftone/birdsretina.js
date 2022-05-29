(() => {
  const devicePixelRatio = window.devicePixelRatio || 1;

  const devicePixelRatioLabel = document.createElement("span");
  devicePixelRatioLabel.innerHTML = `You <b>${
    devicePixelRatio > 1 ? "do" : "do not"
  }</b> have a retina (or similar) display`;
  attach(devicePixelRatioLabel);

  const birdImage = new Image();
  birdImage.src = "/projects/halftone/birds.jpg";
  const birdCanvas = createCanvas(1, 1);
  const birdContext = birdCanvas.getContext("2d");
  birdContext.scale(devicePixelRatioLabel, devicePixelRatioLabel);
  attach(birdCanvas);

  const compositeBirdCanvas = createCanvas(1, 1);
  attach(compositeBirdCanvas);
  const compositeBirdContext = compositeBirdCanvas.getContext("2d");
  compositeBirdContext.scale(devicePixelRatioLabel, devicePixelRatioLabel);

  let width, height;
  const birdReady = new Promise((resolve) => {
    birdImage.onload = () => {
      const aspectRatio = birdImage.height / birdImage.width;
      birdImage.width = Math.min(birdImage.width, window.screen.width - 50);
      birdImage.height = birdImage.width * aspectRatio;

      width = birdImage.width * devicePixelRatio;
      height = birdImage.height * devicePixelRatio;

      resize(birdCanvas, width, height);
      birdCanvas.style.width = `${birdImage.width}px`;
      birdCanvas.style.height = `${birdImage.height}px`;

      resize(compositeBirdCanvas, width, height);
      compositeBirdCanvas.style.width = `${birdImage.width}px`;
      compositeBirdCanvas.style.height = `${birdImage.height}px`;

      birdContext.drawImage(birdImage, 0, 0, width, height);
      halftoneBird();
    };
  });

  const birdAngles = {
    yellow: 45,
    cyan: 15,
    key: 75,
    magenta: 45,
  };

  const halftoneBird = () => {
    const birdData = birdContext.getImageData(0, 0, width, height);
    compositeBirdContext.fillStyle = "white";
    compositeBirdContext.fillRect(0, 0, width, height);

    const inMemoryCanvas = createCanvas(width, height);
    const grayscaleCtx = inMemoryCanvas.getContext("2d");
    grayscaleCtx.scale(devicePixelRatio, devicePixelRatio);
    const grayscaleImageData = grayscaleCtx.getImageData(
      0,
      0,
      width,
      height
    );
    [
      { angle: birdAngles.yellow, color: "yellow", channel: 2 },
      {
        angle: birdAngles.magenta,
        color: "magenta",
        channel: 1,
      },
      { angle: birdAngles.cyan, color: "cyan", channel: 0 },
      { angle: birdAngles.key, color: "black", key: true },
    ].forEach(({ angle, color, channel, key }) => {
      for (let y = 0; y < birdCanvas.height; y++) {
        for (let x = 0; x < birdCanvas.width; x++) {
          const index = positionToDataIndex(x, y, width);
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
            const complement = 255 - birdData.data[index + channel];
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
        targetCtx: compositeBirdContext,
        sourceCtx: grayscaleCtx,
        width: width,
        height: height,
        color: color,
        layer: true,
      });
    });
  };
})();
