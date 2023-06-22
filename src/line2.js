const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const readline = require('readline');

// Create a readline interface
const rl = readline.createInterface({
  input: fs.createReadStream('output.txt'),
  crlfDelay: Infinity
});

// Initialize an empty array to store the coordinates
const coordinates = [];

// Read each line from the file and parse the coordinates
rl.on('line', (line) => {
  if (line === '[7777, 7777]') {
    coordinates.push(null); // Add a flag to represent the break
  } else {
    const [x, y] = JSON.parse(line);
    coordinates.push([x, y]);
  }
});

// After reading all the lines, generate the canvas and draw the lines
rl.on('close', () => {
  // Find the minimum and maximum values of x and y coordinates
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const [x, y] of coordinates) {
    if (x !== null && y !== null) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  // Calculate the range of x and y coordinates
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  // Set canvas dimensions based on the coordinate range
  const canvasWidth = rangeX + 100; // Add some padding to the sides
  const canvasHeight = rangeY + 100; // Add some padding to the top and bottom

  // Create a canvas and set its dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Set the background color to white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set the line color to black
  ctx.strokeStyle = '#000000';

  // Draw lines using the coordinates
  let previousPoint = null;

  for (let i = 0; i < coordinates.length; i++) {
    const currentPoint = coordinates[i];

    if (currentPoint === null) {
      previousPoint = null; // Reset previousPoint on a break
      continue; // Skip drawing a line to the next point
    }

    if (previousPoint !== null) {
      const [x1, y1] = previousPoint;
      const [x2, y2] = currentPoint;
      ctx.beginPath();
      ctx.moveTo(x1 - minX + 50, y1 - minY + 50); // Adjust the coordinates based on the minimum values and padding
      ctx.lineTo(x2 - minX + 50, y2 - minY + 50); // Adjust the coordinates based on the minimum values and padding
      ctx.stroke();
    }

    previousPoint = currentPoint;
  }

  // Save the canvas as an image
  const outputImage = 'output.png';
  const out = fs.createWriteStream(outputImage);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Image saved as ${outputImage}`));
});
