export class BoardState {
  constructor(state, goal_state, size, path = " ") {
    this.state = state;
    this.goal_state = goal_state;
    // this.value = value;
    this.size = size;
    this.path = this.path + path;
    this.empty_tile_row = null;
    this.empty_tile_col = null;
    this.setEmptyTilePos();
  }

  getPath() {
    /**
     * get the path from state to goal state
     */
    return this.path;
  }

  setEmptyTilePos() {
    let state = this.state.flatMap((el) => el);
    state.forEach((el, index) => {
      if (el == 0) {
        this.empty_tile_row = Math.floor(index / this.size);
        this.empty_tile_col = index % this.size;
      }
    });
  }
}
