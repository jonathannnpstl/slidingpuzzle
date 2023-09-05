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
    this.goalState = [];
    this.emptyTileRow = null;
    this.emptyTileCol = null;
    this.createBoard();
  }

  createBoard() {
    let board = $(".board");
    let number = 1;
    for (let row = 0; row < this.size; row++) {
      let rowDiv = this.createRows();
      let rowGoal = [];
      for (let col = 0; col < this.size; col++) {
        if (col == this.size - 1 && row == this.size - 1) {
          number = 0; //mark the empty tile 0
        }
        rowGoal = [...rowGoal, number];
        rowDiv.append(this.createTile(number++, row, col));
      }
      this.goalState = [...this.goalState, rowGoal]; //make the goalState
      board.append(rowDiv);
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
    let new2dState = [];
    let index = 0;
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        row = [...row, state[index++]];
      }
      new2dState = [...new2dState, row];
    }

    return new2dState;
  }

  shuffle() {
    //make a 1d copy of goalState for easier logic
    var state = [...this.goalState].flatMap((el) => {
      return el;
    });

    //outer for loop for more randomized state
    for (let i = 0; i < this.size ** 2; i++) {
      // Fisher-Yates algorithm to shuffle the state
      state.map((n, i) => {
        let randomIndex = Math.floor(Math.random() * this.size);
        let temp = state[i];
        state[i] = state[randomIndex];
        state[randomIndex] = temp;
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
    let numberOfInversion = 0;
    for (let i = 0; i < state.length - 1; i++) {
      if (state[i] == 0) continue; //empty tile not included
      for (let j = i + 1; j < state.length; j++) {
        if (state[i] > state[j] && state[j] != 0) {
          numberOfInversion++;
        }
      }
    }

    /**
     * If the puzzle´s grid is odd the puzzle is
     * solvable when the number of inversions is even
     */
    if (this.size % 2 != 0) return numberOfInversion % 2 == 0;

    this.setEmptyTilePos(state); //will use row position of empty tile, so call this
    let rowNumber = this.emptyTileRow - this.size;

    if (rowNumber % 2 != 0) {
      /**
       * If the puzzle´s grid is  even and the empty tile
       *  is in an odd row counting from the bottom,
       * the puzzle is solvable if the number of inversions is even.
       */
      return numberOfInversion % 2 == 0;
    } else {
      /**
       * If the puzzle´s grid is  even and the empty tile is in
       * an even row counting from the bottom, the puzzle is
       * solvable if the number of inversions is odd.
       */
      return numberOfInversion % 2 != 0;
    }
  }

  setEmptyTilePos(state) {
    state.forEach((el, index) => {
      if (el == 0) {
        this.emptyTileRow = Math.floor(index / this.size);
        this.emptyTileCol = index % this.size;
      }
    });
  }

  makeSolvable(state) {
    //makes sure the size isn't 1 or less
    let solvableState = [...state];
    if (this.size < 2) return;
    /**
     * when odd sized puzzle and has odd number inversions,
     * simply swap the first two element, else the last two.
     * Swapping the first/last 2 elements of an array will either
     * increase or decrease by one the number of inversions
     */
    if (solvableState[0] != 0 && solvableState[1] != 0) {
      let temp = solvableState[0];
      solvableState[0] = solvableState[1];
      solvableState[1] = temp;
    } else {
      const length = solvableState.length;
      let temp = solvableState[length - 1];
      solvableState[length - 1] = solvableState[length - 2];
      solvableState[length - 2] = temp;
    }
    this.setEmptyTilePos(state); //reset incase changes of empty tile pos
    return solvableState;
  }
}

class Solver {
  constructor(state, goalState) {
    this.state = state;
    this.goalState = goalState;
  }
}

const board = new Board(SIZE);

$("#shuffle-btn").click(() => {
  board.shuffle();
});

$("#solve-btn").click(() => {
  // let movePath = AStar(board.state, board.goalState);
  if (board.state.length < 1) return;
  console.log(board.state, board.goalState);
});
