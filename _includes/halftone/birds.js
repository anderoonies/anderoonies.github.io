const birdImage = new Image();
birdImage.src = "/projects/halftone/birds.jpg";
const birdCanvas = createCanvas(1, 1);
const birdContext = birdCanvas.getContext("2d");
attach(birdCanvas);

const compositeBirdCanvas = createCanvas(1, 1);
attach(compositeBirdCanvas);
const compositeBirdContext = compositeBirdCanvas.getContext("2d");

const birdReady = new Promise((resolve) => {
  birdImage.onload = () => {
    resize(birdCanvas, birdImage.width, birdImage.height);
    resize(compositeBirdCanvas, birdImage.width, birdImage.height);
    birdContext.drawImage(birdImage, 0, 0);
    halftoneBird();
  };
});

const birdAngles = {
  yellow: 32,
  cyan: 35,
  key: 66,
  magenta: 20,
};

const [birdAngleCyanSlider, birdAngleCyanSliderLabel] = createSlider(
  0,
  90,
  birdAngles.cyan,
  (v) => `Cyan: ${v}º`
);
birdAngleCyanSlider.addEventListener("input", () => {
  birdAngles.cyan = birdAngleCyanSlider.value;
  halftoneBird();
});
const [birdAngleYellowSlider, birdAngleYellowSliderLabel] = createSlider(
  0,
  90,
  birdAngles.yellow,
  (v) => `Yellow: ${v}º`
);
birdAngleYellowSlider.addEventListener("input", () => {
  birdAngles.yellow = birdAngleYellowSlider.value;
  halftoneBird();
});
const [birdAngleKeySlider, birdAngleKeySliderLabel] = createSlider(
  0,
  90,
  birdAngles.key,
  (v) => `Key: ${v}º`
);
birdAngleKeySlider.addEventListener("input", () => {
  birdAngles.key = birdAngleKeySlider.value;
  halftoneBird();
});
const [birdAngleMagentaSlider, birdAngleMagentaSliderLabel] = createSlider(
  0,
  90,
  birdAngles.magenta,
  (v) => `Magenta: ${v}º`
);
birdAngleMagentaSlider.addEventListener("input", () => {
  birdAngles.magenta = birdAngleMagentaSlider.value;
  halftoneBird();
});

attach(birdAngleCyanSliderLabel);
attach(birdAngleCyanSlider);
attach(birdAngleYellowSliderLabel);
attach(birdAngleYellowSlider);
attach(birdAngleMagentaSliderLabel);
attach(birdAngleMagentaSlider);
attach(birdAngleKeySliderLabel);
attach(birdAngleKeySlider);

const [birdDotSizeSlider, birdDotSizeSliderLabel] = createSlider(
  1,
  10,
  3,
  (v) => `${v} pixels per dot`
);
birdDotSizeSlider.addEventListener("input", () => {
  halftoneBird();
});
attach(birdDotSizeSliderLabel);
attach(birdDotSizeSlider);

const [birdResolutionSlider, birdResolutionSliderLabel] = createSlider(
  1,
  10,
  2,
  (v) => `${v} pixels between dots`
);
birdResolutionSlider.addEventListener("input", () => {
  halftoneBird();
});
attach(birdResolutionSliderLabel);
attach(birdResolutionSlider);

const halftoneBird = () => {
  const birdData = birdContext.getImageData(
    0,
    0,
    birdCanvas.width,
    birdCanvas.height
  );
  compositeBirdContext.clearRect(0, 0, birdCanvas.width, birdCanvas.height);
  const cyanCanvas = createCanvas(birdCanvas.width, birdCanvas.height);
  const cyanCtx = cyanCanvas.getContext("2d");
  const magentaCanvas = createCanvas(birdCanvas.width, birdCanvas.height);
  const magentaCtx = magentaCanvas.getContext("2d");
  const yellowCanvas = createCanvas(birdCanvas.width, birdCanvas.height);
  const yellowCtx = yellowCanvas.getContext("2d");
  const keyCanvas = createCanvas(birdCanvas.width, birdCanvas.height);
  const keyCtx = keyCanvas.getContext("2d");

  const inMemoryCanvas = createCanvas(birdCanvas.width, birdCanvas.height);
  const grayscaleCtx = inMemoryCanvas.getContext("2d");
  const grayscaleImageData = grayscaleCtx.getImageData(
    0,
    0,
    inMemoryCanvas.width,
    inMemoryCanvas.height
  );
  [
    { ctx: yellowCtx, angle: birdAngles.yellow, color: "yellow", channel: 2 },
    {
      ctx: magentaCtx,
      angle: birdAngles.magenta,
      color: "magenta",
      channel: 1,
    },
    { ctx: cyanCtx, angle: birdAngles.cyan, color: "cyan", channel: 0 },
    { ctx: keyCtx, angle: birdAngles.key, color: "black" },
  ].forEach(({ ctx, angle, color, channel }) => {
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
        if (color === "black") {
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
    halftone(
      angle,
      parseInt(birdDotSizeSlider.value, 10),
      parseInt(birdResolutionSlider.value, 10),
      compositeBirdContext,
      grayscaleCtx,
      birdCanvas.width,
      birdCanvas.height,
      color,
      true
    );
  });
};
