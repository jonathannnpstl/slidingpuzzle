export class BoardState {
  constructor(state, goal_state, size, path = "") {
    this.state = state;
    this.goal_state = goal_state;
    // this.value = value;
    this.path = this.path + path;
    this.neighbors = [];
    this.empty_tile_row = null;
    this.empty_tile_col = null;
    this.size = size;
    this.setEmptyTilePos();
    this.setNeighbors();
  }

  setNeighbors() {
    //Up
    if (this.empty_tile_row > 0) {
      let new_state = [...this.state];
      let temp = new_state[this.empty_tile_row - 1][this.empty_tile_col];
      new_state[this.empty_tile_row - 1][this.empty_tile_col] = 0;
      new_state[this.empty_tile_row][this.empty_tile_col] = temp;
      let new_board_state = new BoardState(
        new_state,
        this.goal_state,
        this.size
      );
      this.neighbors.push(new_board_state);
    }

    //Down
    if (this.empty_tile_row < this.size - 1) {
      let new_state = [...this.state];
      let temp = new_state[this.empty_tile_row + 1][this.empty_tile_col];
      new_state[this.empty_tile_row + 1][this.empty_tile_col] = 0;
      new_state[this.empty_tile_row][this.empty_tile_col] = temp;
      let new_board_state = new BoardState(
        new_state,
        this.goal_state,
        this.size
      );
      this.neighbors.push(new_board_state);
    }
    //Left
    if (this.empty_tile_col > 0) {
      let new_state = [...this.state];
      let temp = new_state[this.empty_tile_row][this.empty_tile_col - 1];
      new_state[this.empty_tile_row][this.empty_tile_col - 1] = 0;
      new_state[this.empty_tile_row][this.empty_tile_col] = temp;
      let new_board_state = new BoardState(
        new_state,
        this.goal_state,
        this.size
      );
      this.neighbors.push(new_board_state);
    }
    //Right
    if (this.empty_tile_col < this.size - 1) {
      let new_state = [...this.state];
      let temp = new_state[this.empty_tile_row];
      new_state[this.empty_tile_row + 1][this.empty_tile_col] = 0;
      new_state[this.empty_tile_row][this.empty_tile_col] = temp;
      let new_board_state = new BoardState(
        new_state,
        this.goal_state,
        this.size
      );
      this.neighbors.push(new_board_state);
    }
  }

  getNeighbors() {
    /**
     * get all the neighbors or possible moves from the state
     */
    return this.neighbors;
  }

  getPath() {
    /**
     * get the path from state to goal state
     */
    return this.path;
  }

  setEmptyTilePos() {
    this.state.flat().forEach((el, index) => {
      if (el == 0) {
        this.empty_tile_row = Math.floor(index / this.size);
        this.empty_tile_col = index % this.size;
      }
    });
  }
}
