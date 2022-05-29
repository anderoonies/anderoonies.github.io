const cmykComposite = createCanvas(200, 200);
const cmykAngles = createCanvas(200, 200);

attach(cmykComposite);
attach(cmykAngles);

const drawArrow = (ctx, angle, color, length) => {
  angle = (angle * Math.PI) / 180;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.translate(0, 200);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(angle) * length, -Math.sin(angle) * length);
  ctx.closePath();
  ctx.stroke();
  ctx.rotate(-angle);
  ctx.translate(length, 0);
  ctx.moveTo(10, 0);
  ctx.lineTo(0, 10);
  ctx.lineTo(0, -10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

(() => {
  const angles = {
    yellow: 0,
    cyan: 15,
    key: 45,
    magenta: 75,
  };
  const cmykCtx = cmykComposite.getContext("2d");
  const cmykAnglesCtx = cmykAngles.getContext("2d");

  const [cyanSlider, cyanLabel] = createSlider(
    1,
    90,
    angles.cyan,
    (v) => `Cyan: ${v}º`
  );
  const [magentaSlider, magentaLabel] = createSlider(
    1,
    90,
    angles.magenta,
    (v) => `Magenta: ${v}º`
  );
  const [yellowSlider, yellowLabel] = createSlider(
    1,
    90,
    angles.yellow,
    (v) => `Yellow: ${v}º`
  );
  const [keySlider, keyLabel] = createSlider(
    1,
    90,
    angles.key,
    (v) => `Key: ${v}º`
  );

  attach(cyanLabel);
  attach(cyanSlider);
  attach(magentaLabel);
  attach(magentaSlider);
  attach(yellowLabel);
  attach(yellowSlider);
  attach(keyLabel);
  attach(keySlider);

  const redraw = () => {
    drawArrows();
    drawComposite();
  };

  const drawArrows = () => {
    cmykAnglesCtx.clearRect(0, 0, 200, 200);
    drawArrow(cmykAnglesCtx, angles.cyan, "cyan", 150);
    drawArrow(cmykAnglesCtx, angles.magenta, "magenta", 150);
    drawArrow(cmykAnglesCtx, angles.yellow, "yellow", 150);
    drawArrow(cmykAnglesCtx, angles.key, "black", 150);
  };

  const drawComposite = () => {
    cmykCtx.globalAlpha = 0.75;
    halftone({
      angle: angles.yellow,
      dotSize: 10,
      dotResolution: 10,
      targetCtx: cmykCtx,
      sourceCtx: valueCtx,
      width: 400,
      height: 400,
      color: "yellow",
    });
    halftone({
      angle: angles.cyan,
      dotSize: 10,
      dotResolution: 10,
      targetCtx: cmykCtx,
      sourceCtx: valueCtx,
      width: 400,
      height: 400,
      color: "cyan",
      layer: true,
    });
    halftone({
      angle: angles.magenta,
      dotSize: 10,
      dotResolution: 10,
      targetCtx: cmykCtx,
      sourceCtx: valueCtx,
      width: 400,
      height: 400,
      color: "magenta",
      layer: true,
    });
    halftone({
      angle: angles.key,
      dotSize: 10,
      dotResolution: 10,
      targetCtx: cmykCtx,
      sourceCtx: valueCtx,
      width: 400,
      height: 400,
      color: "black",
      layer: true,
    });
  };

  cyanSlider.addEventListener("input", (e) => {
    angles.cyan = parseInt(cyanSlider.value, 10);
    redraw();
  });
  magentaSlider.addEventListener("input", (e) => {
    angles.magenta = parseInt(magentaSlider.value, 10);
    redraw();
  });
  yellowSlider.addEventListener("input", (e) => {
    angles.yellow = parseInt(yellowSlider.value, 10);
    redraw();
  });
  keySlider.addEventListener("input", (e) => {
    angles.key = parseInt(keySlider.value, 10);
    redraw();
  });

  redraw();
})();
