const fs = require('fs');
const readline = require('readline');
const { createCanvas } = require('canvas');

// Read the coordinates from the text file
const coordinates = [];
const fileStream = fs.createReadStream('output.txt');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  // Remove whitespace and brackets from the line
  const cleanedLine = line.replace(/\s|\[|\]/g, '');
  if (cleanedLine) {
    // Split the line into x and y values and parse them as integers
    const [x, y] = cleanedLine.split(',').map(value => parseInt(value));
    coordinates.push([x, y]);
  }
});

rl.on('close', () => {
  // Find the minimum and maximum values of x and y coordinates
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  coordinates.forEach(([x, y]) => {
    if (!isNaN(x) && !isNaN(y)) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  });

  // Calculate canvas size based on coordinate range
  const canvasWidth = maxX - minX + 10; // Add some padding for better visibility
  const canvasHeight = maxY - minY + 10;

  // Set up the canvas with white background
  const canvas = createCanvas(canvasWidth, canvasHeight, 'png');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Set the line color and width
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  // Adjust the coordinate values to fit within the canvas
  const adjustedCoordinates = coordinates.map(([x, y]) => {
    if (!isNaN(x) && !isNaN(y)) {
      return [x - minX + 5, y - minY + 5];
    }
    return null;
  });

  // Connect the adjusted coordinates and store line coordinates
  ctx.beginPath();
  let isIsland = false;

  adjustedCoordinates.forEach((coordinate) => {
    if (coordinate === null) {
      if (!isIsland) {
        ctx.stroke();
        ctx.beginPath();
        isIsland = true;
      }
    } else {
      if (isIsland) {
        ctx.moveTo(coordinate[0], coordinate[1]);
        isIsland = false;
      }
      ctx.lineTo(coordinate[0], coordinate[1]);
    }
  });

  ctx.stroke();

  // Save the canvas as an image
  const out = fs.createWriteStream(__dirname + '/output.png');
  const stream = canvas.createJPEGStream();
  stream.pipe(out);
  out.on('finish', () => console.log('Image created: output.png'));
  
});
