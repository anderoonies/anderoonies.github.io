const rotationCanvas = createCanvas(WIDTH, HEIGHT);
attach(rotationCanvas);
const rotationCtx = rotationCanvas.getContext("2d");

const rotatePointAboutPosition = ([x, y], [rotX, rotY], angle) => {
  return [
    (x - rotX) * Math.cos(angle) - (y - rotY) * Math.sin(angle) + rotX,
    (x - rotX) * Math.sin(angle) + (y - rotY) * Math.cos(angle) + rotY,
  ];
};

const halftone = ({
  angle,
  dotSize,
  dotResolution,
  targetCtx,
  sourceCtx,
  width,
  height,
  color,
  layer,
}) => {
  const sourceImageData = sourceCtx.getImageData(0, 0, width, height);
  angle = (angle * Math.PI) / 180;
  targetCtx.fillStyle = "white";
  layer || targetCtx.fillRect(0, 0, width, height);
  targetCtx.fillStyle = color || "black";
  // get the four corners of the screen
  const tl = [0, 0];
  const tr = [width, 0];
  const br = [width, height];
  const bl = [0, height];
  // rotate the screen, then find the minimum and maximum of the values.
  const boundaries = [tl, br, tr, bl].map(([x, y]) => {
    return rotatePointAboutPosition([x, y], [width / 2, height / 2], angle);
  });
  const minX = Math.min(...boundaries.map((point) => point[0])) | 0;
  const minY = Math.min(...boundaries.map((point) => point[1])) | 0;
  const maxY = Math.max(...boundaries.map((point) => point[1])) | 0;
  const maxX = Math.max(...boundaries.map((point) => point[0])) | 0;

  for (let y = minY; y < maxY; y += dotResolution) {
    for (let x = minX; x < maxX; x += dotResolution) {
      let [rotatedX, rotatedY] = rotatePointAboutPosition(
        [x, y],
        [width / 2, height / 2],
        angle
      );

      if (
        rotatedX < 0 ||
        rotatedY < 0 ||
        rotatedX > width ||
        rotatedY > height
      ) {
        continue;
      }
      const index = positionToDataIndex(
        Math.floor(rotatedX),
        Math.floor(rotatedY),
        width
      );
      // we're always operating on grayscale images, so just grab the value from
      // the red channel.
      const value = sourceImageData.data[index];
      const alpha = sourceImageData.data[index + 3];
      if (alpha) {
        const circleRadius = map(value, 0, 255, dotSize / 2, 0);
        targetCtx.beginPath();
        targetCtx.arc(rotatedX, rotatedY, circleRadius, 0, Math.PI * 2);
        targetCtx.closePath();
        targetCtx.fill();
      }
    }
  }
};

const createSlider = (min, max, value, labelTextFn) => {
  const slider = document.createElement("input");
  slider.min = min;
  slider.max = max;
  slider.value = value;
  slider.type = "range";
  const label = document.createElement("label");
  label.innerHTML = labelTextFn(value);
  slider.addEventListener("input", () => {
    label.innerHTML = labelTextFn(slider.value);
  });
  return [slider, label];
};

(() => {
  halftone({
    angle: 0,
    dotSize: PIXELS_PER_DOT,
    dotResolution: PIXELS_PER_DOT,
    targetCtx: rotationCtx,
    sourceCtx: sourceCtx,
    width: WIDTH,
    height: HEIGHT,
  });

  const [angleSlider, angleSliderLabel] = createSlider(
    0,
    89,
    0,
    (v) => `${v} degrees`
  );
  attach(angleSliderLabel);
  attach(angleSlider);
  angleSlider.addEventListener("input", (e) => {
    const deg = parseInt(angleSlider.value, 10);
    halftone({
      angle: deg,
      dotSize: PIXELS_PER_DOT,
      dotResolution: PIXELS_PER_DOT,
      targetCtx: rotationCtx,
      sourceCtx: sourceCtx,
      width: WIDTH,
      height: HEIGHT,
    });
  });
})();
