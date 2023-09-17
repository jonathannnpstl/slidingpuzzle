class BoardState {
  constructor(state, goal_state, size, path = " ", path_states, depth) {
    this.state = state;
    this.goal_state = goal_state;
    this.value = 0;
    this.size = size;
    this.path = path;
    this.path_states = path_states;
    this.depth = depth;
    this.empty_tile_row = null;
    this.empty_tile_col = null;
    this.setEmptyTilePos();
    this.setValue();
    this.addPathState();
  }

  getPath() {
    /**
     * get the path from state to goal state
     */
    return this.path;
  }

  setValue() {
    this.value = (this.size > 3 ? 0 : this.depth) + this.manhattanDistance();
  }

  addPathState() {
    let path_states_clone = JSON.parse(JSON.stringify(this.path_states));
    path_states_clone.push(this.state);
    this.path_states = path_states_clone;
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

  manhattanDistance() {
    var result = 0;

    for (var i = 0; i < this.state.length; i++) {
      for (var j = 0; j < this.state[i].length; j++) {
        var elem = this.state[i][j];
        var found = false;
        for (var h = 0; h < this.goal_state.length; h++) {
          for (var k = 0; k < this.goal_state[h].length; k++) {
            if (this.goal_state[h][k] == elem) {
              result += Math.abs(h - i) + Math.abs(j - k);
              found = true;
              break;
            }
          }
          if (found) break;
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
