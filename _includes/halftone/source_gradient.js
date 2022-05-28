const domTarget = document.currentScript.parentElement;
const attach = (node) => {
  document.currentScript.parentElement.appendChild(node);
};
const resize = (canvas, width, height) => {
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};

const createCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  resize(canvas, width, height);
  return canvas;
};

const WIDTH = 200,
  HEIGHT = 200;

const sourceCanvas = createCanvas(WIDTH, HEIGHT);
attach(sourceCanvas);
const sourceCtx = sourceCanvas.getContext("2d");

const gradient = sourceCtx.createLinearGradient(
  0,
  HEIGHT / 2,
  WIDTH,
  HEIGHT / 2
);
gradient.addColorStop(0, "black");
gradient.addColorStop(1, "white");

sourceCtx.fillStyle = gradient;
sourceCtx.fillRect(0, 0, WIDTH, HEIGHT);
