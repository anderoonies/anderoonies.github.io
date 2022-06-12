const compositeCanvas = createCanvas(300, 300);
const compositeContext = compositeCanvas.getContext("2d");
compositeContext.globalCompositeOperation = "darken";
attach(compositeCanvas);

(() => {
  const inMemoryCanvas = createCanvas(300, 300);
  const inMemoryContext = inMemoryCanvas.getContext("2d");
  inMemoryContext.fillStyle = "black";
  inMemoryContext.fillRect(0, 0, 300, 300);
  halftone({
    angle: 0,
    dotSize: 6,
    dotResolution: 8,
    targetCtx: compositeContext,
    sourceCtx: inMemoryContext,
    width: compositeCanvas.width,
    height: compositeCanvas.height,
    color: "yellow",
    layer: true,
  });
  halftone({
    angle: 75,
    dotSize: 6,
    dotResolution: 8,
    targetCtx: compositeContext,
    sourceCtx: inMemoryContext,
    width: compositeCanvas.width,
    height: compositeCanvas.height,
    color: "magenta",
    layer: true,
  });
})();
