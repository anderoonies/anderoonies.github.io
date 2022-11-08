const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const Materials = {
  WALL: -1,
  EMPTY: 0,
  SAND: 1,
};

const Colors = {
  [Materials.SAND]: {
    base: { r: 212, g: 168, b: 124, a: 255 },
    variance: { r: 5, g: 5, b: 5 },
  },
};

const world = new Array(canvas.height)
  .fill({ r: 0, g: 0, b: 0, a: 0 })
  .map((row) => {
    return new Array(canvas.width).fill({
      material: Materials.EMPTY,
    });
  });

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
};

const random = (min, max) => {
  if (typeof max === "undefined") {
    max = min;
    min = 0;
  }
  return min + Math.random() * (max - min);
};

const randint = (min, max) => {
  return Math.floor(random(min, max));
};

const choice = (it) => {
  return it[randint(it.length)];
};

const redraw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < canvas.height; row++) {
    for (let col = 0; col < canvas.width; col++) {
      let cell = world[row][col];
      let index = (row * canvas.width + col) * 4;
      imageData[index + 0] = cell.r;
      imageData[index + 1] = cell.g;
      imageData[index + 2] = cell.b;
      imageData[index + 3] = cell.a;
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

const updateCell = ({ get, set }, cell, row, col) => {
  switch (cell.material) {
    case Materials.SAND: {
      let bottom = get(0, 1);
      let dx = choice([-1, 1]);
      if (bottom === EMPTY) {
        set(0, 0, Materials.EMPTY);
        set(0, 1, Materials.SAND);
      } else if (get(dx, 1) === Materials.EMPTY) {
        set(0, 0, Materials.EMPTY);
        set(dx, 1, Materials.SAND);
      }
      break;
    }
    default: {
      break;
    }
  }
};

const update = () => {
  let nextWorld = world.map((row) => row.slice());
  const visitor = (row, col) => ({
    get: (dx, dy) => {
      let x = col + dx;
      let y = row + dy;
      if (x < 0 || x > canvas.width - 1 || y < 0 || y > canvas.height - 1) {
        return Materials.WALL;
      }
      return nextWorld[y][x];
    },
    set: (dx, dy, v) => {
      let y = row + dy;
      if (y > canvas.height - 1) {
        return;
      }
      let x = clamp(col + dx, 0, canvas.width - 1);
      nextWorld[y][x] = v;
    },
  });

  for (let row = 0; row < canvas.height; row++) {
    for (let col = 0; col < canvas.width; col++) {
      updateCell(visitor(row, col), world[row][col], row, col);
    }
  }
  redraw();
  requestAnimationFrame(update);
};

requestAnimationFrame(update);

canvas.addEventListener("mousemove", e => {
    const x
})