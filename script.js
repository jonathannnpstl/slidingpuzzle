import { Solver } from "./solver.js";

const BOARD_SIZE = 400;
const SIZE = 2;
const NUMBER_OF_TILES = SIZE ** 2;
const TILES_SIZE = BOARD_SIZE / NUMBER_OF_TILES;

class Board {
  constructor(size) {
    this.size = size;
    this.board_size = 500; //board size depends on the size of container
    this.tiles_size = this.board_size / this.size;
    this.state = []; //the placement of tiles using 2d array (e.g., [[1,2],[3,0]])
    this.goal_state = [];
    this.empty_tile_row = null;
    this.empty_tile_col = null;
    this.createBoard();
  }

  createBoard() {
    let board = $(".board");
    let number = 1;
    for (let row = 0; row < this.size; row++) {
      let row_div = this.createRows();
      let row_goal = [];
      for (let col = 0; col < this.size; col++) {
        if (col == this.size - 1 && row == this.size - 1) {
          number = 0; //mark the empty tile 0
        }
        row_goal = [...row_goal, number];
        row_div.append(this.createTile(number++, row, col));
      }
      this.goal_state = [...this.goal_state, row_goal]; //make the goal_state
      board.append(row_div);
    }
  }

  createTile(number, row, col) {
    return $("<div/>", {
      "data-pos": `${row},${col}`,
      append: `<b>${number}</b>`,
      class: "cell",
      id: number,
      css: {
        width: `${this.tiles_size}px`,
        height: `${this.tiles_size}px`,
        // background: `url("\\neom-jTxhUMyPTrE-unsplash.jpg")`,
        // backgroundPosition: "bottom",
      },
      on: {
        click: () => this.moveTile(console.log(row)),
      },
    });
  }

  createRows() {
    return $("<div/>", {
      class: "row",
    });
  }

  moveTile() {
    //every move, check if 0 pos is same as in the goal pos
    if (this.state[this.size - 1][this.state - 1] == 0) {
      //checks if state is same as goal
    }

    /**
     * U - Up
     * R - Right
     * L - Left
     * D - Down
     *
     *
     */
    console.log(this);
  }

  swap(node1, node2) {
    const temp = $(node1).html();
    $(node1).html($(node2).html());
    $(node2).html(temp);
  }

  make2dstate(state) {
    let new_2d_state = [];
    let index = 0;
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        row = [...row, state[index++]];
      }
      new_2d_state = [...new_2d_state, row];
    }

    return new_2d_state;
  }

  shuffle() {
    //make a 1d copy of goal_state for easier logic
    var state = [...this.goal_state].flatMap((el) => {
      return el;
    });

    //outer for loop for more randomized state
    for (let i = 0; i < this.size ** 2; i++) {
      // Fisher-Yates algorithm to shuffle the state
      state.map((n, i) => {
        let random_index = Math.floor(Math.random() * this.size);
        let temp = state[i];
        state[i] = state[random_index];
        state[random_index] = temp;
      });
    }

    if (!this.isSolvable(state)) {
      state = [...this.makeSolvable(state)];
      //final check if puzzle is solvable
      // if (this.isSolvable(newPuzzle)) {
      //   state = newPuzzle;
      // } else {
      //   do re-shuffle
      //   console.log("Error");
      // }
    }

    this.state = this.make2dstate(state); //set the shuffled state

    // this.createBoard should just rerender or manipulate the board???
  }

  isSolvable(state) {
    let number_of_inversion = 0;
    for (let i = 0; i < state.length - 1; i++) {
      if (state[i] == 0) continue; //empty tile not included
      for (let j = i + 1; j < state.length; j++) {
        if (state[i] > state[j] && state[j] != 0) {
          number_of_inversion++;
        }
      }
    }

    /**
     * If the puzzle´s grid is odd the puzzle is
     * solvable when the number of inversions is even
     */
    if (this.size % 2 != 0) return number_of_inversion % 2 == 0;

    this.setEmptyTilePos(state); //will use row position of empty tile, so call this
    let row_number = this.empty_tile_row - this.size;

    if (row_number % 2 != 0) {
      /**
       * If the puzzle´s grid is  even and the empty tile
       *  is in an odd row counting from the bottom,
       * the puzzle is solvable if the number of inversions is even.
       */
      return number_of_inversion % 2 == 0;
    } else {
      /**
       * If the puzzle´s grid is  even and the empty tile is in
       * an even row counting from the bottom, the puzzle is
       * solvable if the number of inversions is odd.
       */
      return number_of_inversion % 2 != 0;
    }
  }

  setEmptyTilePos(state) {
    state.forEach((el, index) => {
      if (el == 0) {
        this.empty_tile_row = Math.floor(index / this.size);
        this.empty_tile_col = index % this.size;
      }
    });
  }

  makeSolvable(state) {
    //makes sure the size isn't 1 or less
    let solvable_state = [...state];
    if (this.size < 2) return;
    /**
     * when odd sized puzzle and has odd number inversions,
     * simply swap the first two element, else the last two.
     * Swapping the first/last 2 elements of an array will either
     * increase or decrease by one the number of inversions
     */
    if (solvable_state[0] != 0 && solvable_state[1] != 0) {
      let temp = solvable_state[0];
      solvable_state[0] = solvable_state[1];
      solvable_state[1] = temp;
    } else {
      const length = solvable_state.length;
      let temp = solvable_state[length - 1];
      solvable_state[length - 1] = solvable_state[length - 2];
      solvable_state[length - 2] = temp;
    }
    this.setEmptyTilePos(state); //reset incase changes of empty tile pos
    return solvable_state;
  }
}

const board = new Board(SIZE);

$("#shuffle-btn").click(() => {
  board.shuffle();
});

$("#solve-btn").click(() => {
  // let movePath = AStar(board.state, board.goal_state);
  if (board.state.length < 1) return;
  console.log(board.goal_state, board.goal_state);
  const init = new Solver(board);
  let path = init.solveAStar();
});
