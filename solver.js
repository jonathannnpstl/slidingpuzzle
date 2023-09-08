import { BoardState } from "./boardstate.js";

export class Solver {
  constructor(boardInstance) {
    this.state = boardInstance.state;
    this.goal_state = boardInstance.goal_state;
    this.size = boardInstance.size;
    this.queue = [];
    this.visited = new Set();
    this.limit = 100;
  }

  clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  expand(state) {
    let new_state = null;
    let row = state.empty_tile_row;
    let col = state.empty_tile_col;
    console.log("empty tile pos: ", row, col);
    console.log("state path: ", state.path);
    //Up;
    if (row > 0) {
      console.log("Up");
      new_state = this.clone(state.state);
      let temp = new_state[row - 1][col];
      new_state[row - 1][col] = 0;
      new_state[row][col] = temp;
      if (!this.visited.has(new_state.flat().toString())) {
        console.log(new_state.flat().toString());
        console.log(new_state);
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          state.path + "U"
        );
        this.queue.push(new_board_state);
        this.limit -= 1;
      }
    }
    //Down
    if (row < state.size - 1) {
      console.log("Down");
      new_state = this.clone(state.state);
      let temp = new_state[row + 1][col];
      new_state[row + 1][col] = 0;
      new_state[row][col] = temp;
      if (!this.visited.has(new_state.flat().toString())) {
        console.log(new_state.flat().toString());
        console.log(new_state);
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          state.path + "D"
        );
        this.queue.push(new_board_state);
        this.limit -= 1;
      }
    }
    //Left
    if (col > 0) {
      new_state = this.clone(state.state);
      console.log("Left");
      let temp = new_state[row][col - 1];
      new_state[row][col - 1] = 0;
      new_state[row][col] = temp;
      console.log(new_state.flat().toString());
      console.log(new_state);
      if (!this.visited.has(new_state.flat().toString())) {
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          state.path + "L"
        );
        this.queue.push(new_board_state);
        this.limit -= 1;
      }
    }
    //Right
    if (col > this.size - 1) {
      console.log("Right");
      new_state = this.clone(state.state);
      let temp = new_state[row][col + 1];
      new_state[row][col + 1] = 0;
      new_state[row][col] = temp;
      console.log(new_state.flat().toString());
      console.log(new_state);
      if (!this.visited.has(new_state.flat().toString())) {
        let new_board_state = new BoardState(
          new_state,
          this.goal_state,
          this.size,
          state.path + "R"
        );
        this.queue.push(new_board_state);
        this.limit -= 1;
      }
    }
    console.log("queue after expand: ", this.queue);
  }

  solveAStar() {
    let init_state = new BoardState(
      this.state,
      this.goal_state,
      this.size,
      " "
    );
    this.queue.push(init_state);
    console.log("queue: ", this.queue);
    while (this.queue.length > 0 && this.limit > 0) {
      let current_state = this.queue.shift();
      this.visited.add(current_state.state.flat().toString());
      if (
        current_state.state.flat().toString() ===
        this.goal_state.flat().toString()
      ) {
        return current_state.getPath();
      }
      this.expand(current_state);
    }
  }
  solveBFS() {}
}
