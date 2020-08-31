/**
 * Setup
 */

function createApp() {
  const config = {
    artBoard: '#artBoard',
    tools: {
      pencil: '#toolPencil',
      highlighter: '#toolHighlighter',
      eraser: '#toolEraser',
      colorPicker: '#toolColorPicker',
    },
    mouse: {
      x: '#mouseX',
      y: '#mouseY',
    }
  };

  createSketch(config);
}

createApp();