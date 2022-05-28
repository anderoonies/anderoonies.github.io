const targetCanvas = document.createElement("canvas");
targetCanvas.width = WIDTH;
targetCanvas.height = HEIGHT;
targetCanvas.style.width = `${WIDTH}px`;
targetCanvas.style.height = `${HEIGHT}px`;
attach(targetCanvas);
const targetCtx = targetCanvas.getContext("2d");

let PIXELS_PER_DOT = 10;
const sourceImageData = sourceCtx.getImageData(0, 0, WIDTH, HEIGHT);

const positionToDataIndex = (x, y, width) => {
  width = width || WIDTH;
  // data is arranged as [R, G, B, A, R, G, B, A, ...]
  return (y * width + x) * 4;
};

const clamp = (value, min, max) => Math.min(max, Math.max(value, min));

// re-maps a value from its original range [minA, maxA] to the range [minB, maxB]
const map = (value, minA, maxA, minB, maxB) => {
  return ((value - minA) / (maxA - minA)) * (maxB - minB) + minB;
};

for (let y = 0; y < HEIGHT; y += PIXELS_PER_DOT) {
  for (let x = 0; x < WIDTH; x += PIXELS_PER_DOT) {
    const index = positionToDataIndex(x, y);
    // extract the R, G, B from the source image.
    // because it's grayscale, these will all be the same number, but in general they'll need to be averaged.
    const [r, g, b] = [
      sourceImageData.data[index + 0],
      sourceImageData.data[index + 1],
      sourceImageData.data[index + 2],
    ];
    const value = (r + g + b) / 3;
    const circleRadius = map(value, 0, 255, PIXELS_PER_DOT / 2, 0);
    targetCtx.beginPath();
    targetCtx.arc(x, y, circleRadius, 0, Math.PI * 2);
    targetCtx.closePath();
    targetCtx.fill();
  }
}
