const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const readline = require('readline');

// Create a readline interface
const rl = readline.createInterface({
  input: fs.createReadStream('output.txt'),
  crlfDelay: Infinity
});

// Initialize an empty array to store the islands
let islands = [[]];

// Read each line from the file and parse the coordinates
rl.on('line', (line) => {
  if (line === '[7777, 7777]') {
    // Start a new island
    islands.push([]);
  } else {
    const [x, y] = JSON.parse(line);
    const currentIsland = islands[islands.length - 1];
    currentIsland.push([x, y]);
  }
});

// After reading all the lines, generate the canvas and draw the lines for each island
rl.on('close', () => {
  const canvasWidth = 1000;
  const canvasHeight = 1000;

  // Create a canvas and set its dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Set the background color to white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set the line color to black
  ctx.strokeStyle = '#000000';

  // Draw lines for each island
  for (const island of islands) {
    let previousPoint = null;

    for (let i = 0; i < island.length; i++) {
      const currentPoint = island[i];

      if (previousPoint === null) {
        previousPoint = currentPoint;
        continue;
      }

      const [x1, y1] = previousPoint;
      const [x2, y2] = currentPoint;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      previousPoint = currentPoint;
    }
  }

  // Save the canvas as an image
  const outputImage = 'output.png';
  const out = fs.createWriteStream(outputImage);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Image saved as ${outputImage}`));
});
