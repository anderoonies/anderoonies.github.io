(() => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.scale(4, 4);
  ctx.imageSmoothingEnabled = false;

  const Materials = {
    WALL: -1,
    EMPTY: 0,
    SAND: 1,
  };

  const Colors = {
    [Materials.EMPTY]: {
      base: { r: 255, g: 255, b: 255, a: 255 },
      variance: { r: 5, g: 5, b: 5 },
    },
    [Materials.SAND]: {
      base: { r: 212, g: 168, b: 124, a: 255 },
      variance: { r: 5, g: 5, b: 5 },
    },
  };

  let world = new Array(canvas.height).fill(Materials.EMPTY).map((row) => {
    return new Array(canvas.width).fill(Materials.EMPTY);
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

  const mousePosition = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: ((evt.clientX - rect.left) * scaleX) | 0,
      y: ((evt.clientY - rect.top) * scaleY) | 0,
    };
  };

  const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < canvas.height; row++) {
      for (let col = 0; col < canvas.width; col++) {
        let type = world[row][col];
        let color = Colors[type];
        let index = (row * canvas.width + col) * 4;
        imageData.data[index + 0] = color.base.r;
        imageData.data[index + 1] = color.base.g;
        imageData.data[index + 2] = color.base.b;
        imageData.data[index + 3] = color.base.a;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const updateCell = ({ get, set }, cell, row, col) => {
    switch (cell) {
      case Materials.SAND: {
        let bottom = get(0, 1);
        let dx = choice([-1, 1]);
        if (bottom === Materials.EMPTY) {
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
    world = nextWorld;
    redraw();
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);

  canvas.addEventListener("mousemove", (e) => {
    const { x, y } = mousePosition(canvas, e);
    world[y][x] = Materials.SAND;
  });
})();
