const container = document.currentScript.parentElement;
const stillLifeCanvas = createCanvas(1, 1);
attach(stillLifeCanvas);

const stillLifeCtx = stillLifeCanvas.getContext("2d");
const stillLife = new Image();

let STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT;

const stillLifeReady = new Promise((resolve) => {
  stillLife.src = "/projects/halftone/stilllife.jpeg";
  stillLife.onload = () => {
    STILL_LIFE_WIDTH = stillLife.width;
    STILL_LIFE_HEIGHT = stillLife.height;
    resize(stillLifeCanvas, STILL_LIFE_WIDTH, STILL_LIFE_HEIGHT);
    stillLifeCtx.drawImage(stillLife, 0, 0);
    resolve();
  };
});
