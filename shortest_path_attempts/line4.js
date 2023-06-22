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
  const [x, y] = JSON.parse(line);

  // Check if the coordinate is [7777, 7777]
  if (x === 7777 && y === 7777) {
    // If it is, add an empty array as a marker of a break
    coordinates.push([]);
  } else {
    // Otherwise, add the coordinate to the current array
    coordinates[coordinates.length - 1].push([x, y]);
  }
});

// After reading all the lines, generate the canvas and draw the lines
rl.on('close', () => {
  // Find the minimum and maximum values of x and y coordinates
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  // Initialize the canvas dimensions
  let canvasWidth = 0;
  let canvasHeight = 0;

  for (const island of coordinates) {
    // Skip empty arrays (break markers)
    if (island.length === 0) continue;

    let islandMinX = Number.POSITIVE_INFINITY;
    let islandMinY = Number.POSITIVE_INFINITY;
    let islandMaxX = Number.NEGATIVE_INFINITY;
    let islandMaxY = Number.NEGATIVE_INFINITY;

    // Calculate the range of x and y coordinates for the current island
    for (const [x, y] of island) {
      islandMinX = Math.min(islandMinX, x);
      islandMinY = Math.min(islandMinY, y);
      islandMaxX = Math.max(islandMaxX, x);
      islandMaxY = Math.max(islandMaxY, y);
    }

    // Update the overall minimum and maximum values
    minX = Math.min(minX, islandMinX);
    minY = Math.min(minY, islandMinY);
    maxX = Math.max(maxX, islandMaxX);
    maxY = Math.max(maxY, islandMaxY);
  }

  // Calculate the range of x and y coordinates
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  // Set canvas dimensions based on the coordinate range
  canvasWidth = rangeX + 100; // Add some padding to the sides
  canvasHeight = rangeY + 100; // Add some padding to the top and bottom

  // Create a canvas and set its dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Set the background color to white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set the line color to black
  ctx.strokeStyle = '#000000';

  // Draw lines using the coordinates
  for (const island of coordinates) {
    // Skip empty arrays (break markers)
    if (island.length === 0) continue;

    for (let i = 0; i < island.length - 1; i++) {
      const [x1, y1] = island[i];
      const [x2, y2] = island[i + 1];
      ctx.beginPath();
      ctx.moveTo(x1 - minX + 50, y1 - minY + 50); // Adjust the coordinates based on the minimum values and padding
      ctx.lineTo(x2 - minX + 50, y2 - minY + 50); // Adjust the coordinates based on the minimum values and padding
      ctx.stroke();
    }
  }

  // Save the canvas as an image
  const outputImage = 'output.png';
  const out = fs.createWriteStream(outputImage);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Image saved as ${outputImage}`));
});
