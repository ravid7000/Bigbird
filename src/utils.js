/**
 * Utilities
 */

function select(el) {
  return document.querySelector(el);
}

document.addEventListener('mousemove', (event) => {
  const { clientX, clientY } = event;
  window.mouseX = clientX;
  window.mouseY = clientY;
  if (typeof window.mousemove === 'function') {
    window.mousemove({
      x: clientX,
      y: clientY,
    }, event);
  }
});

document.addEventListener('mousedown', (event) => {
  window.mousePressed = true;
  if (typeof window.mousedown === 'function') {
    window.mousedown({
      x: event.clientX,
      y: event.clientY,
    }, event);
  }
});

document.addEventListener('mouseup', (event) => {
  window.mousePressed = false;
  if (typeof window.mouseup === 'function') {
    window.mouseup({
      x: event.clientX,
      y: event.clientY,
    }, event);
  }
});

let isLineDrawn = false;

function line(ctx, x1, y1, x2, y2) {
  if (!isLineDrawn) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
  }
  ctx.lineTo(x2, y2);
  if (!isLineDrawn) {
    ctx.stroke();
  }

  isLineDrawn = true;
}

function stroke(ctx, color) {
  ctx.strokeStyle = color;
  ctx.stroke();
}

function hexToRgb(hex) {
  const aRgbHex = hex.substring(1).match(/.{1,2}/g);
  const aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16)
  ];
  return aRgb;
}