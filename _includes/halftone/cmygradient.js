const rgbGradientCanvas = createCanvas(200, 100);
attach(rgbGradientCanvas);
const rgbGradientCtx = rgbGradientCanvas.getContext("2d");
const cmykGradientComposite = createCanvas(200, 100);
const cmykGradientCompositeCtx = cmykGradientComposite.getContext("2d");

(() => {
  const cyanCanvas = createCanvas(200, 100);
  const cyanCtx = cyanCanvas.getContext("2d");
  cyanCtx.fillStyle = "cyan";
  attach(cyanCanvas);
  const magentaCanvas = createCanvas(200, 100);
  const magentaCtx = magentaCanvas.getContext("2d");
  magentaCtx.fillStyle = "magenta";
  attach(magentaCanvas);
  const yellowCanvas = createCanvas(200, 100);
  const yellowCtx = yellowCanvas.getContext("2d");
  yellowCtx.fillStyle = "yellow";
  attach(yellowCanvas);
  attach(cmykGradientComposite);

  const gradient = rgbGradientCtx.createLinearGradient(0, 50, 200, 50);
  gradient.addColorStop(0, "red");
  gradient.addColorStop(0.5, "green");
  gradient.addColorStop(1, "blue");
  rgbGradientCtx.fillStyle = gradient;
  rgbGradientCtx.fillRect(0, 0, 200, 100);
  const rgbGradientData = rgbGradientCtx.getImageData(0, 0, 200, 100);

  const inMemoryCanvas = createCanvas(200, 100);

  [cyanCtx, magentaCtx, yellowCtx].forEach((ctx, i) => {
    const grayscaleCtx = inMemoryCanvas.getContext("2d");
    const grayscaleImageData = grayscaleCtx.getImageData(
      0,
      0,
      inMemoryCanvas.width,
      inMemoryCanvas.height
    );
    for (let y = 0; y < rgbGradientCanvas.height; y++) {
      for (let x = 0; x < rgbGradientCanvas.width; x++) {
        const index = positionToDataIndex(x, y, rgbGradientCanvas.width);
        const complement = 255 - rgbGradientData.data[index + i];
        grayscaleImageData.data[index + 0] = 255 - complement;
        grayscaleImageData.data[index + 1] = 255 - complement;
        grayscaleImageData.data[index + 2] = 255 - complement;
        grayscaleImageData.data[index + 3] = 255;
      }
    }
    grayscaleCtx.putImageData(grayscaleImageData, 0, 0);
    halftone({
      angle: 0,
      dotSize: 3,
      dotResolution: 3,
      targetCtx: ctx,
      sourceCtx: grayscaleCtx,
      width: rgbGradientCanvas.width,
      height: rgbGradientCanvas.height,
      color: ctx.fillStyle,
    });
    halftone({
      angle: i * 33,
      dotSize: 2,
      dotResolution: 3,
      targetCtx: cmykGradientCompositeCtx,
      sourceCtx: grayscaleCtx,
      width: rgbGradientCanvas.width,
      height: rgbGradientCanvas.height,
      color: ctx.fillStyle,
      layer: true,
    });
  });
})();
