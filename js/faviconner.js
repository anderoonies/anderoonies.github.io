let link = document.querySelector("link[rel~='icon']");
if (!link) {
  link = document.createElement("link");
  link.rel = "icon";
  document.getElementsByTagName("head")[0].appendChild(link);
}

const canvas = document.createElement("canvas");
canvas.width = 200;
canvas.height = 200;
const ctx = canvas.getContext("2d");
setInterval(() => {
  const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 200, 200);
  link.href = canvas.toDataURL();
}, 10000);
