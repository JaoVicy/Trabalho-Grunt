class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 1, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

class AStar {
    constructor(grid) {
        this.grid = grid;
        this.openList = new PriorityQueue();
        this.closedList = [];
        this.startNode = null;
        this.endNode = null;
        this.path = [];
    }

    heuristic(node, endNode) {
        return Math.abs(node.x - endNode.x) + Math.abs(node.y - endNode.y);
    }

    findNeighbors(node) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
        ];

        for (const dir of directions) {
            const x = node.x + dir.x;
            const y = node.y + dir.y;

            if (x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length) {
                neighbors.push(this.grid[y][x]);
            }
        }

        return neighbors;
    }

    findPath(startX, startY, endX, endY) {
        this.startNode = this.grid[startY][startX];
        this.endNode = this.grid[endY][endX];
        this.openList.enqueue(this.startNode, 0);

        while (!this.openList.isEmpty()) {
            const currentNode = this.openList.dequeue().element;

            if (currentNode === this.endNode) {
                this.reconstructPath(currentNode);
                return this.path;
            }

            this.closedList.push(currentNode);

            const neighbors = this.findNeighbors(currentNode);

            for (const neighbor of neighbors) {
                if (this.closedList.includes(neighbor) || neighbor.isWall) {
                    continue;
                }

                const tentativeG = currentNode.g + 1;

                let newPath = false;
                if (!this.openList.items.some(item => item.element === neighbor)) {
                    newPath = true;
                    neighbor.h = this.heuristic(neighbor, this.endNode);
                    this.openList.enqueue(neighbor, neighbor.f);
                } else if (tentativeG < neighbor.g) {
                    newPath = true;
                }

                if (newPath) {
                    neighbor.g = tentativeG;
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = currentNode;
                }
            }
        }

        return [];
    }

    reconstructPath(node) {
        while (node.previous) {
            this.path.push(node);
            node = node.previous;
        }
        this.path.reverse();
    }
}

// Create a grid for the A* algorithm
const grid = [];
const rows = 10;
const cols = 10;

for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
        row.push({ x, y, g: 0, h: 0, f: 0, isWall: false, previous: null });
    }
    grid.push(row);
}

// Adding some walls
grid[4][2].isWall = true;
grid[4][3].isWall = true;
grid[4][4].isWall = true;
grid[4][5].isWall = true;
grid[4][6].isWall = true;

const astar = new AStar(grid);
const path = astar.findPath(0, 0, 9, 9);

console.log("Path found:");
for (const node of path) {
    console.log(`(${node.x}, ${node.y})`);
}
