// create a hidden all-black context so that we can create a full-density halftone
const hiddenCanvas = createCanvas(200, 200);
const valueCtx = hiddenCanvas.getContext("2d");
valueCtx.fillStyle = "rgba(127, 127, 127)";
valueCtx.fillRect(0, 0, 200, 200);

const redBlueCanvas = createCanvas(200, 200);
attach(redBlueCanvas);

const [redBlueAngleSlider, redBlueAngleSliderLabel] = createSlider(
  0,
  90,
  45,
  (v) => `${v} degrees`
);
attach(redBlueAngleSlider);
attach(redBlueAngleSliderLabel);

(() => {
  const redBlueCtx = redBlueCanvas.getContext("2d");

  const redraw = () => {
    halftone(0, 10, 10, redBlueCtx, valueCtx, 200, 200, "red");
    halftone(
      redBlueAngleSlider.value,
      10,
      10,
      redBlueCtx,
      valueCtx,
      200,
      200,
      "blue",
      true
    );
  };

  redBlueAngleSlider.addEventListener("input", () => {
    redBlueCtx.clearRect(0, 0, 200, 200);
    redBlueAngleSliderLabel.innerHTML = `${redBlueAngleSlider.value} degrees`;
    redraw();
  });
  redraw();
})();
