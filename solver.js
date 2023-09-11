import { BoardState } from "./boardstate.js";
import FastPriorityQueue from "./FastPriorityQueue.js";

export class Solver {
  constructor(boardInstance) {
    this.state = boardInstance.state;
    this.goal_state = boardInstance.goal_state;
    this.size = boardInstance.size;
    this.queue = new FastPriorityQueue(function (a, b) {
      return a.value < b.value;
    });
    this.visited = new Set();
    this.limit = 1000000;
  }

  clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  expand(current_state) {
    let new_state = null;
    let state = current_state.state;
    let row = current_state.empty_tile_row;
    let col = current_state.empty_tile_col;
    //Up
    if (row > 0) {
      new_state = this.clone(state);
      let temp = new_state[row - 1][col];
      new_state[row - 1][col] = 0;
      new_state[row][col] = temp;
      if (!this.visited.has(new_state.flat().toString())) {
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          current_state.path + "U",
          current_state.path_states,
          current_state.depth + 1
        );
        this.queue.add(new_board_state);
        this.limit -= 1;
      }
    }

    //Down
    if (row < this.size - 1) {
      new_state = this.clone(state);
      let temp = new_state[row + 1][col];
      new_state[row + 1][col] = 0;
      new_state[row][col] = temp;
      if (!this.visited.has(new_state.flat().toString())) {
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          current_state.path + "D",
          current_state.path_states,
          current_state.depth + 1
        );
        this.queue.add(new_board_state);
        this.limit -= 1;
      }
    }

    //Left
    if (col > 0) {
      new_state = this.clone(state);
      let temp = new_state[row][col - 1];
      new_state[row][col - 1] = 0;
      new_state[row][col] = temp;
      if (!this.visited.has(new_state.flat().toString())) {
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          current_state.path + "L",
          current_state.path_states,
          current_state.depth + 1
        );
        this.queue.add(new_board_state);
        this.limit -= 1;
      }
    }

    //Right
    if (col < this.size - 1) {
      new_state = this.clone(state);
      let temp = new_state[row][col + 1];
      new_state[row][col + 1] = 0;
      new_state[row][col] = temp;
      if (!this.visited.has(new_state.flat().toString())) {
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          current_state.path + "R",
          current_state.path_states,
          current_state.depth + 1
        );
        this.queue.add(new_board_state);
        this.limit -= 1;
      }
    }
    console.log(this.queue);
  }

  solveAStar() {
    let init_state = new BoardState(
      this.state,
      this.goal_state,
      this.size,
      "",
      [],
      0
    );
    this.queue.add(init_state);
    while (!this.queue.isEmpty() > 0 && this.limit > 0) {
      let current_state = this.queue.poll();
      this.visited.add(current_state.state.flat().toString());
      if (
        current_state.state.flat().toString() ===
        this.goal_state.flat().toString()
      ) {
        return current_state;
      }
      this.expand(current_state);
    }
  }
}
