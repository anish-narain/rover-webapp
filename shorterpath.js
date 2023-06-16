function findShortestPath(coordinates, start, end) {
    const distances = {};
    distances[start] = 0;
    const previous = {};
    const visited = new Set();
    const queue = new PriorityQueue();
    queue.enqueue(start, 0);
  
    while (!queue.isEmpty()) {
      const current = queue.dequeue();
  
      if (current === end) {
        return reconstructPath(previous, end);
      }
  
      visited.add(current);
      const neighbors = getNeighbors(coordinates, current);
  
      for (const neighbor of neighbors) {
        const distance = distances[current] + 1;
  
        if (!visited.has(neighbor) && (!distances[neighbor] || distance < distances[neighbor])) {
          distances[neighbor] = distance;
          previous[neighbor] = current;
          queue.enqueue(neighbor, distance);
        }
      }
    }
  
    return null;
  }
  
  function getNeighbors(coordinates, current) {
    const [x, y] = current;
    const neighbors = [];
  
    for (const coordinate of coordinates) {
      const [neighborX, neighborY] = coordinate;
  
      if (
        (Math.abs(neighborX - x) === 1 && neighborY === y) ||
        (Math.abs(neighborY - y) === 1 && neighborX === x) ||
        (neighborX === x && neighborY === y)
      ) {
        neighbors.push(coordinate);
      }
    }
  
    return neighbors;
  }
  
  function reconstructPath(previous, end) {
    const path = [];
    let current = end;
  
    while (current !== undefined) {
      path.unshift(current);
      current = previous[current];
    }
  
    return path;
  }
  
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
  
  const coordinates = [
    [0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [2, 2], [1, 2], [1, 1], [2, 1]
  ];
  
  const start = [0, 0];
  const end = [2, 2];
  
  const shortestPath = findShortestPath(coordinates, start, end);
  
  console.log(shortestPath);
  