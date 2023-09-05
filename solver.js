import { BoardState } from "./boardstate.js";

export class Solver {
  constructor(boardInstance) {
    this.state = boardInstance.state;
    this.goal_state = boardInstance.goal_state;
    this.size = boardInstance.size;
    this.queue = [];
    this.visited = new Set();
  }

  solveAStar() {
    let init_state = new BoardState(this.state, this.goal_state, this.size);
    this.queue.push(init_state);
    while (this.queue.length > 0) {
      console.log("Hello");
      let current_state = this.queue.shift();
      if (
        current_state.state.flat().toString() ===
        this.goal_state.flat().toString()
      ) {
        return current_state.getPath();
      }
      console.log(current_state.getNeighbors());
    }
  }
  solveBFS() {}
}
