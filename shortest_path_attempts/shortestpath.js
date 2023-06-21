// Import the Plotly.js library

// The function to find the shortest path
function findShortestPath(coordinates, start, end) {
  // Create a dictionary to store the distance from the start to each coordinate
  const distances = {};
  distances[start] = 0;

  // Create a dictionary to store the previous coordinate in the shortest path
  const previous = {};

  // Create a set to keep track of visited coordinates
  const visited = new Set();

  // Create a priority queue to store coordinates and their distances
  const queue = new PriorityQueue();

  // Initialize the priority queue with the start coordinate
  queue.enqueue(start, 0);

  while (!queue.isEmpty()) {
    // Get the coordinate with the smallest distance from the priority queue
    const current = queue.dequeue();

    // If we have reached the end coordinate, reconstruct and return the path
    if (current === end) {
      return reconstructPath(previous, end);
    }

    // Mark the current coordinate as visited
    visited.add(current);

    // Get the neighboring coordinates of the current coordinate
    const neighbors = getNeighbors(coordinates, current);

    for (const neighbor of neighbors) {
      // Calculate the distance from the start to the neighbor coordinate
      const distance = distances[current] + 1;

      // If the neighbor coordinate has not been visited or
      // the new distance is smaller than the previously recorded distance
      if (!visited.has(neighbor) && (!distances[neighbor] || distance < distances[neighbor])) {
        // Update the distance and previous coordinate
        distances[neighbor] = distance;
        previous[neighbor] = current;

        // Enqueue the neighbor coordinate with its distance
        queue.enqueue(neighbor, distance);
      }
    }
  }

  // If no path is found, return null
  return null;
}

// Helper function to get the neighboring coordinates
function getNeighbors(coordinates, current) {
  const [x, y] = current;
  const neighbors = [];

  for (const coordinate of coordinates) {
    const [neighborX, neighborY] = coordinate;

    // Check if the coordinate is adjacent to the current coordinate
    if (
      (Math.abs(neighborX - x) === 1 && neighborY === y) ||
      (Math.abs(neighborY - y) === 1 && neighborX === x)
    ) {
      neighbors.push(coordinate);
    }
  }

  return neighbors;
}

// Helper function to reconstruct the shortest path
function reconstructPath(previous, end) {
  const path = [];
  let current = end;

  while (current !== undefined) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}

// Priority queue implementation using a binary heap
class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  enqueue(element, priority) {
    const item = { element, priority };
    let added = false;

    for (let i = 0; i < this.elements.length; i++) {
      if (priority < this.elements[i].priority) {
        this.elements.splice(i, 0, item);
        added = true;
        break;
      }
    }

    if (!added) {
      this.elements.push(item);
    }
  }

  dequeue() {
    return this.elements.shift().element;
  }
}

// Function to visualize the coordinates and shortest path
function visualizeShortestPath(coordinates, shortestPath) {
  const xCoordinates = coordinates.map(coord => coord[0]);
  const yCoordinates = coordinates.map(coord => coord[1]);

  const data = [
    {
      x: xCoordinates,
      y: yCoordinates,
      mode: 'markers',
      marker: { size: 12, color: 'blue' },
      name: 'Coordinates'
    },
    {
      x: shortestPath.map(coord => coord[0]),
      y: shortestPath.map(coord => coord[1]),
      mode: 'lines',
      line: { color: 'red', width: 2 },
      name: 'Shortest Path'
    }
  ];

  const layout = {
    title: 'Shortest Path Visualization',
    xaxis: { title: 'X Coordinate' },
    yaxis: { title: 'Y Coordinate' },
    hovermode: 'closest'
  };

  Plotly.newPlot('graph', data, layout);
}

// Example usage
const coordinates = [
  [0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [2, 2], [1, 2], [1, 1], [2, 1]
];

const start = [0, 0];
const end = [2, 2];

const shortestPath = findShortestPath(coordinates, start, end);

if (shortestPath !== null) {
  visualizeShortestPath(coordinates, shortestPath);
} else {
  console.log('No path found');
}
