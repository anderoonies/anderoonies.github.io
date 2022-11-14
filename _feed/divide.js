(() => {
  const maxDepth = 20;
  const parent = document.currentScript.parentElement.querySelector("#parent");
  const listen = (container) => {
    container.addEventListener("mouseover", (e) => {
      e.stopPropagation();
      divide(container);
    });
  };
  listen(parent);
  const map = (value, minA, maxA, minB, maxB) => {
    return ((value - minA) / (maxA - minA)) * (maxB - minB) + minB;
  };
  const divide = (parent) => {
    if (parseInt(parent.dataset.depth) > maxDepth) {
      return;
    }
    const children = new Array(4).fill().map(() => {
      const div = document.createElement("div");
      const depth = parseInt(parent.dataset.depth) + 1;
      div.dataset.depth = depth;
      const value = map(depth, 0, maxDepth, 255, 0);
      div.style = `width: 50%; height: 50%; float: left; background-color: rgb(${
        (Math.random() * value) | 0
      }, ${(Math.random() * value) | 0}, ${(Math.random() * value) | 0})`;
      listen(div);
      return div;
    });
    parent.replaceChildren(...children);
  };
  divide(parent);
})();
