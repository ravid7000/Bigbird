/**
 * Main sketch file, contains all logic
 */

const tools = {
  PENCIL: "PENCIL",
  HIGHLIGHTER: "HIGHLIGHTER",
  ERASER: "ERASER",
  COLORPICKER: "COLORPICKER",
};

let isUp = false;
let pMouseX = 0;
let pMouseY = 0;

const caches = {
  line: [],
  lineCount: -1,
  eraser: [],
  eraserCount: -1,
  highlight: [],
}

const sketchConfig = {
  windowWidth: innerWidth,
  windowHeight: innerHeight,
  appConfig: {},
  width: 0,
  height: 0,
  canvas: null,
  ctx: "2d",
  canvasOffset: {
    x: 0,
    y: 0,
  },
  currentTool: null,
  currentColor: "",
  eraserSize: 20,
};

function initCanvas(el, width, height) {
  const canvas = select(el);
  canvas.width = width;
  canvas.height = height;
  sketchConfig.width = width;
  sketchConfig.height = height;
  sketchConfig.canvas = canvas;
  sketchConfig.ctx = canvas.getContext(sketchConfig.ctx);
  sketchConfig.canvasOffset = {
    x: canvas.offsetLeft,
    y: canvas.offsetTop,
  };
}

function initTools(toolConfig) {
  const pencil = select(toolConfig.pencil);
  const highlighter = select(toolConfig.highlighter);
  const eraser = select(toolConfig.eraser);
  const colorPicker = select(toolConfig.colorPicker);

  sketchConfig.currentTool = tools.PENCIL;
  sketchConfig.currentColor = colorPicker.value;

  pencil.classList.add("pressed");

  pencil.addEventListener("click", () => {
    sketchConfig.currentTool = tools.PENCIL;
    highlighter.classList.remove("pressed");
    eraser.classList.remove("pressed");
    pencil.classList.add("pressed");
  });

  eraser.addEventListener("click", () => {
    sketchConfig.currentTool = tools.ERASER;
    highlighter.classList.remove("pressed");
    pencil.classList.remove("pressed");
    eraser.classList.add("pressed");
  });

  highlighter.addEventListener("click", () => {
    sketchConfig.currentTool = tools.HIGHLIGHTER;
    pencil.classList.remove("pressed");
    eraser.classList.remove("pressed");
    highlighter.classList.add("pressed");
  });

  colorPicker.addEventListener("change", (event) => {
    sketchConfig.currentColor = event.target.value;
  });
}

function mousemove() {
  if (sketchConfig.canvas) {
    const x = mouseX - sketchConfig.canvas.offsetLeft;
    const y = mouseY - sketchConfig.canvas.offsetTop;
    if (x > 0 && y > 0 && x < sketchConfig.width && y < sketchConfig.height) {
      const mouseXEl = select(sketchConfig.appConfig.mouse.x);
      const mouseYEl = select(sketchConfig.appConfig.mouse.y);
      mouseXEl.textContent = x;
      mouseYEl.textContent = y;
    }
  }
}

function drawLine() {
  const { ctx } = sketchConfig;
  for (let i = 0; i < caches.line.length; i++) {
    const line = caches.line[i];
    let moveTo = true;
    ctx.beginPath();
    for (let j = 0; j < line.length; j++) {
      const [x, y, color] = line[j];
      if (moveTo) {
        ctx.moveTo(x, y);
        moveTo = false;
      } else {
        ctx.lineTo(x, y);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctx.stroke();
    }
    ctx.closePath();
  }
}

function usePencil() {
  const { currentColor, canvasOffset } = sketchConfig;
  const cMouseX = mouseX - canvasOffset.x;
  const cMouseY = mouseY - canvasOffset.y;
  if (window.mousePressed) {
    if (caches.lineCount < 0) {
      caches.lineCount = 0;
    }
    if (!caches.line[caches.lineCount]) {
      caches.line[caches.lineCount] = [];
    }
    caches.line[caches.lineCount].push([cMouseX, cMouseY, currentColor]);
    isUp = true;
  } else if (isUp) {
    caches.lineCount += 1;
    isUp = false;
  }
}

function drawEraser() {
  const { ctx, eraserSize } = sketchConfig;
  for (let i = 0; i < caches.eraser.length; i++) {
    const eraser = caches.eraser[i];
    for (let j = 0; j < eraser.length; j++) {
      const [x, y] = eraser[j];
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - eraserSize / 2, y - eraserSize / 2, eraserSize, eraserSize);
    }
  }
}

function useEraser() {
  const { canvasOffset } = sketchConfig;
  const cMouseX = mouseX - canvasOffset.x;
  const cMouseY = mouseY - canvasOffset.y;
  if (window.mousePressed) {
    if (caches.eraserCount < 0) {
      caches.eraserCount = 0;
    }
    if (!caches.eraser[caches.eraserCount]) {
      caches.eraser[caches.eraserCount] = [];
    }
    caches.eraser[caches.eraserCount].push([cMouseX, cMouseY]);
    isUp = true;
  } else if (isUp) {
    caches.eraserCount += 1;
    isUp = false;
  }
}

function useHighlighter() {
  const { canvasOffset, currentColor } = sketchConfig;
  const cMouseX = mouseX - canvasOffset.x;
  const cMouseY = mouseY - canvasOffset.y;
  if (window.mousePressed) {
    if (!isUp) {
      caches.highlight = [];
    }
    if (Math.abs(cMouseX - pMouseX) > 10 || Math.abs(cMouseY - pMouseY) > 10) {
      const rgb = hexToRgb(currentColor);
      const rgba = `rgba(${rgb.join(',')},0.01)`;
      caches.highlight.push([cMouseX, cMouseY, rgba]);
      pMouseX = cMouseX;
      pMouseY = cMouseY;
    }
    isUp = true;
  } else if (isUp) {
    isUp = false;
  }
}

function drawHighlighter() {
  const { ctx, eraserSize } = sketchConfig;
  let moveTo = true;
  ctx.beginPath();
  for (let i = 0; i < caches.highlight.length; i++) {
    const [x, y, color] = caches.highlight[i];
    if (moveTo) {
      ctx.moveTo(x, y);
      moveTo = false;
    } else {
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = eraserSize;
    ctx.stroke();
  }
  ctx.closePath();
}

function drawLoop() {
  if (sketchConfig.canvas) {
    const { currentTool, width, height, ctx } = sketchConfig;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    if (currentTool === tools.PENCIL) {
      usePencil();
    }
    if (currentTool === tools.ERASER) {
      useEraser();
    }
    if (currentTool === tools.HIGHLIGHTER) {
      useHighlighter();
    }

    drawLine();
    drawEraser();
    drawHighlighter();

    window.requestAnimationFrame(() => {
      drawLoop();
    });
  }
}

function createSketch(config) {
  sketchConfig.appConfig = Object.assign({}, sketchConfig.appConfig, config);
  initCanvas(
    config.artBoard,
    sketchConfig.windowHeight - 100,
    sketchConfig.windowHeight - 100
  );
  initTools(config.tools);
  drawLoop();
}
