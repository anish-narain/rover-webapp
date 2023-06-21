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
  coordinates.push([x, y]);
});

// After reading all the lines, generate the canvas and draw the lines
rl.on('close', () => {
  // Create a canvas and set its dimensions
  const canvasWidth = 500;
  const canvasHeight = 500;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Draw lines using the coordinates
  for (let i = 0; i < coordinates.length - 1; i++) {
    const [x1, y1] = coordinates[i];
    const [x2, y2] = coordinates[i + 1];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Save the canvas as an image
  const outputImage = 'output.png';
  const out = fs.createWriteStream(outputImage);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => console.log(`Image saved as ${outputImage}`));
});