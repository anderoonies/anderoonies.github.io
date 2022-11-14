(() => {
  const canvas = document.currentScript.parentElement.querySelector("canvas");
  const width = Math.min(300, 300);
  const height = Math.min(300, 300);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.scale(3, 3);
  ctx.imageSmoothingEnabled = false;

  let rotation = Math.PI / 2;
  canvas.style.transform = `rotate(${-rotation}rad)`;

  const slider =
    document.currentScript.parentElement.querySelector("#hourglass");
  slider.addEventListener("input", (e) => {
    const v = slider.value;
    const angle = map(v, 0, 100, Math.PI / 2, 2 * Math.PI);
    requestAnimationFrame(() => {
      rotation = angle;
      canvas.style.transform = `rotate(${-angle}rad)`;
    });
  });

  const Materials = {
    WALL: -1,
    EMPTY: 0,
    SAND: 1,
    WATER: 2,
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
    [Materials.WATER]: {
      base: { r: 80, g: 100, b: 230, a: 255 },
      variance: { r: 20, g: 20, b: 35 },
    },
  };

  let world = new Array(canvas.height)
    .fill(Materials.EMPTY)
    .map((row, rowI) => {
      return new Array(canvas.width).fill(Materials.EMPTY).map((col, colI) => {
        console.log(rowI);
        if (rowI > 66) {
          return Materials.SAND;
        }
        return Materials.EMPTY;
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

  const rotatePointAboutPosition = ([x, y], [rotX, rotY], angle) => {
    return [
      (x - rotX) * Math.cos(angle) - (y - rotY) * Math.sin(angle) + rotX,
      (x - rotX) * Math.sin(angle) + (y - rotY) * Math.cos(angle) + rotY,
    ];
  };

  const map = (value, minA, maxA, minB, maxB) => {
    return ((value - minA) / (maxA - minA)) * (maxB - minB) + minB;
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
        } else if (bottom === Materials.WATER) {
          set(0, 0, bottom);
          set(0, 1, cell);
        }
        break;
      }
      case Materials.WATER: {
        let bottom = get(0, 1);
        let dx = choice([-1, 1]);
        if (bottom === Materials.EMPTY) {
          set(0, 0, Materials.EMPTY);
          set(0, 1, cell);
          return;
        }
        if (get(dx, 0) === Materials.EMPTY) {
          set(0, 0, Materials.EMPTY);
          set(dx, 0, cell);
          return;
        }
        if (get(dx, 1) === Materials.EMPTY) {
          set(0, 0, Materials.EMPTY);
          set(dx, 1, cell);
          return;
        }
        if (get(2, 1) === Materials.EMPTY) {
          set(0, 0, Materials.EMPTY);
          set(2, 1, cell);
          return;
        }
        if (get(-2, 1) === Materials.EMPTY) {
          set(0, 0, Materials.EMPTY);
          set(-2, 1, cell);
          return;
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
        [dx, dy] = rotatePointAboutPosition([dx, dy], [0, 0], rotation);
        dx = Math.round(dx);
        dy = Math.round(dy);
        let x = col + dx;
        let y = row + dy;
        if (x < 0 || x > canvas.width - 1 || y < 0 || y > canvas.height - 1) {
          return Materials.WALL;
        }
        return nextWorld[y][x];
      },
      set: (dx, dy, v) => {
        [dx, dy] = rotatePointAboutPosition([dx, dy], [0, 0], rotation);
        dx = Math.round(dx);
        dy = Math.round(dy);
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

  const paint = (x, y, material) => {
    world[y][x] = material;
  };

  canvas.addEventListener("mousemove", (e) => {
    const { x, y } = mousePosition(canvas, e);
    paint(x, y, Materials.SAND);
  });
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const { x, y } = mousePosition(canvas, touch);
    world[y][x] = Materials.SAND;
  });
})();
