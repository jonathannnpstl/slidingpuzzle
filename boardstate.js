export class BoardState {
  constructor(value, state, goal_state, size, path = " ") {
    this.value = value;
    this.state = state;
    this.goal_state = goal_state;
    // this.value = value;
    this.size = size;
    this.path = path;
    this.empty_tile_row = null;
    this.empty_tile_col = null;
    this.setEmptyTilePos();
    this.setValue();
  }

  getPath() {
    /**
     * get the path from state to goal state
     */
    return this.path;
  }

  setValue() {
    this.value = this.misplacedTiles();
  }

  misplacedTiles() {
    let result = 0;
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (
          this.state[i][j] != this.goal_state[i][j] &&
          this.state[i][j] != 0
        ) {
          result++;
        }
      }
    }
    return result;
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
