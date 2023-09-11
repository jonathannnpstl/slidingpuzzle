export class BoardState {
  constructor(state, goal_state, size, path = " ") {
    this.state = state;
    this.goal_state = goal_state;
    this.value = null;
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
    console.log(this.state, this.goal_state);
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
