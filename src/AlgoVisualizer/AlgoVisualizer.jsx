import React, { Component } from "react";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "../Algorithms/Dijkstra.ts";
import Node from "./Node/Node";
import "./AlgoVisualizer.css";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class AlgoVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  /**
   * Initialize the grid
   */
  componentDidMount() {
    const grid = initGrid();
    this.setState({ grid });
  }

  /**
   * Detects and handles mouse down event
   *
   * @param {number} row
   * @param {number} col
   */
  mouseDown(row, col) {
    const updatedGrid = updateGrid(this.state.grid, row, col);
    this.setState({ grid: updatedGrid, mouseIsPressed: true });
  }

  /**
   * Detects and handles mouse enter event
   *
   * @param {number} row
   * @param {number} col
   * @returns
   */
  mouseEnter(row, col) {
    if (!this.state.mouseIsPressed) {
      return;
    }
    const updatedGrid = updateGrid(this.state.grid, row, col);
    this.setState({ grid: updatedGrid });
  }

  /**
   * Detects and handle mouse up event
   */
  mouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodes, shortestPath) {
    for (let i = 0; i <= visitedNodes.length; i++) {
      // Once we find the target node
      if (i === visitedNodes.length) {
        setTimeout(() => {
          this.animateShortestPath(shortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  /**
   * Animates the shortest path from the algorithm
   *
   * @param {Array} shortestPath
   */
  animateShortestPath(shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    // These two nodes are hard-coded for convenience
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    // Perform Dijkstra's Algorithm
    const visitedNodes = dijkstra(grid, startNode, finishNode);
    const shortestPath = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodes, shortestPath);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>

        <div className="grid">
          {grid.map((row, rowIndex) => {
            // Create a new node with unique id
            return (
              <div key={rowIndex}>
                {row.map((node, nodeIndex) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIndex}
                      row={row}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.mouseDown(row, col)}
                      onMouseEnter={(row, col) => this.mouseEnter(row, col)}
                      onMouseUp={() => this.mouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

/**
 * Initialize the grid
 *
 * @returns an empty grid
 */
const initGrid = () => {
  const grid = [];
  // The row and col are hard-coded for convenience
  for (let row = 0; row < 20; row++) {
    const currRow = [];
    for (let col = 0; col < 50; col++) {
      currRow.push(createNode(col, row));
    }
    grid.push(currRow);
  }
  return grid;
};

/**
 * Node factory
 *
 * @param {number} col
 * @param {number} row
 * @returns
 */
const createNode = (col, row) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

/**
 * Update the gride after certain event
 *
 * @param {array} grid
 * @param {number} row
 * @param {number} col
 * @returns
 */
const updateGrid = (grid, row, col) => {
  const updatedGrid = grid.slice();
  const node = updatedGrid[row][col];
  const updatedNode = {
    ...node,
    isWall: !node.isWall,
  };
  updatedGrid[row][col] = updatedNode;
  return updatedGrid;
};
