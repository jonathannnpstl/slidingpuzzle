const DEFAULT_SIZE = 3;
const DEFAULT_IMAGE = "pic.jpg";
var DEFAULT_BOARD_SIZE = 500;

class Board {
  constructor(size, image) {
    this.size = size;
    this.img = image;
    this.board_size = DEFAULT_BOARD_SIZE; //board size depends on the size of container
    this.tiles_size = this.board_size / this.size;
    this.state = []; //the placement of tiles using 2d array (e.g., [[1,2],[3,0]])
    this.goal_state = [];
    this.empty_tile_row = null;
    this.empty_tile_col = null;
    this.started = false;
    this.solved = false;
    this.moves = 0;
    this.isAI = false;
    this.start();
  }

  start() {
    if (this.solved) return;
    if (this.started) {
      this.shuffle();
      return;
    }
    this.createBoard();
    setTimeout(() => {
      this.shuffle();
    }, 1000);

    this.started = true;
  }

  createBoard() {
    let board = $(".board");
    let number = 1;
    for (let row = 0; row < this.size; row++) {
      let row_goal = [];
      for (let col = 0; col < this.size; col++) {
        if (col == this.size - 1 && row == this.size - 1) {
          number = 0; //mark the empty tile 0
        }
        row_goal = [...row_goal, number];
        board.append(this.createTile(number++, row, col));
      }
      this.goal_state = [...this.goal_state, row_goal]; //make the goal_state
    }
  }

  createTile(number, row, col) {
    return $("<div/>", {
      append: `<p style="margin: 0" class="number">${number}</>`,
      class: "tile",
      id: number,
      css: {
        position: "absolute",
        scale: "0.99",
        width: `${this.tiles_size}px`,
        height: `${this.tiles_size}px`,
        color: "black",
        background: `url("${this.img}")`,
        //tongue ina negative lang pala katapat mo kainisssska
        backgroundPosition: ` -${col * this.tiles_size}px -${
          row * this.tiles_size
        }px`,
        backgroundSize: `${this.board_size}px ${this.board_size}px`,
        left: `${col * this.tiles_size}px`,
        top: `${row * this.tiles_size}px`,
        transitionDuration: ".3s",
        cursor: `${number == 0 ? "default" : "pointer"}`,
        opacity: `${number == 0 ? "0" : "1"}`,
      },
      on: {
        click: () => this.moveTile(number),
      },
    });
  }

  clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  moveTile(number) {
    if (this.state.length <= 0 || this.state == null) return;
    if (this.goal_state.flat().toString() == this.state.flat().toString()) {
      return;
    }

    this.isAI = false;

    let [row, col] = this.findTilePos(number);
    let [empty_tile_row, empty_tile_col] = this.findTilePos(0);
    var state_clone = this.clone(this.state);
    let validMove = false;
    //Up
    if (empty_tile_col == col && row - 1 == empty_tile_row) {
      state_clone[empty_tile_row][empty_tile_col] = number;
      state_clone[row][col] = 0;
      validMove = true;
    }
    //Down
    if (empty_tile_col == col && row + 1 == empty_tile_row) {
      state_clone[empty_tile_row][empty_tile_col] = number;
      state_clone[row][col] = 0;
      validMove = true;
    }
    //Left
    if (empty_tile_row == row && col - 1 == empty_tile_col) {
      state_clone[empty_tile_row][empty_tile_col] = number;
      state_clone[row][col] = 0;
      validMove = true;
    }
    //Right
    if (empty_tile_row == row && col + 1 == empty_tile_col) {
      state_clone[empty_tile_row][empty_tile_col] = number;
      state_clone[row][col] = 0;
      validMove = true;
    }

    if (!this.isAI && validMove) {
      $(".move")
        .children("span")
        .text(function (i, old_) {
          return parseInt(old_) + 1;
        });
    }

    this.state = [...state_clone];
    this.placeTiles();
  }

  isSolved() {
    //every move, check if 0 pos is same as in the goal pos
    if (this.state[this.size - 1][this.size - 1] === 0) {
      //checks if state is same as goal
      if (this.goal_state.flat().toString() == this.state.flat().toString()) {
        this.solved = true;
        this.playAgainPromt();
        return true;
      }
      return false;
    }
  }

  playAgainPromt() {
    let board = $(".board");
    $(".tile").css("scale", "1");
    $(".tile").css("cursor", "default");
    setTimeout(() => {
      $("#0").css("opacity", "1");
      $("<button/>", {
        append: "<span>Play Again</span>",
        class: "button play-again large",
        css: {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        },
        appendTo: board,
        on: {
          click: () => {
            $(".move").children("span").text(0);
            updateBoard();
          },
        },
      });
    }, 200);
  }

  findTilePos(number) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] == number) {
          return [row, col];
        }
      }
    }
  }

  make2dstate(state) {
    /**
     * function to make the array 2d
     *
     */
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

  placeTiles() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        $(`#${this.state[row][col]}`).css("top", `${this.tiles_size * row}px`);
        $(`#${this.state[row][col]}`).css("left", `${this.tiles_size * col}px`);
      }
    }

    if (this.isSolved()) return;
  }

  shuffle() {
    /**
     * function to shuffle the puzzle
     */
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
    }

    this.state = this.make2dstate(state); //set the shuffled state

    this.placeTiles();
  }

  isSolvable(state) {
    /**
     * function to determine if shuffled puzzle is solvable
     */
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

  /**
   *
   * @param {2d array} state
   * remove this if possible
   */
  setEmptyTilePos(state) {
    /**
     * function to set the position (row & col) of the empty tile
     */
    state.forEach((el, index) => {
      if (el == 0) {
        this.empty_tile_row = Math.floor(index / this.size);
        this.empty_tile_col = index % this.size;
      }
    });
  }

  makeSolvable(state) {
    /**
     * function to make the puzzle solvable
     */

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
var isSolving = false; //indicate if solving is done or not
var board = new Board(DEFAULT_SIZE, DEFAULT_IMAGE);

function updateBoard() {
  $(".board").empty();
  size = size_el.value;
  board = new Board(size ?? DEFAULT_SIZE, url ?? DEFAULT_IMAGE);
  check();
}

function valid(size) {
  typeof size == "number" ? true : false;
}

var run = [];
function clearAllAnimation() {
  run?.forEach((el) => clearTimeout(el));
  isSolving = false;
}

$("#shuffle-btn").click(() => {
  $(".move").children("span").text(0);
  clearAllAnimation();
  if (isSolving) return;
  board.start();
});

$("#solve-btn").click(() => {
  if (board.state.length < 1 || isSolving || board.size > 3) return;
  var startTime = new Date();
  const init = new Solver(board);
  let path = init.solveAStar();
  var endTime = new Date();
  console.log("Miliseconds: ", endTime - startTime);
  console.log(path.path);
  console.log(path.path.length);
  async function move() {
    return new Promise((resolve) => {
      path.path_states.map((state, index) => {
        run.push(
          setTimeout(() => {
            board.state = state;
            board.placeTiles();
            clearTimeout(run);
          }, 400 * index)
        );
      });
      setTimeout(() => resolve("done"), path.path_states.length * 400);
    });
  }
  async function execute() {
    isSolving = true;
    await move();
    isSolving = false;
  }
  execute();
});

window.addEventListener("resize", updateBoardSize);
window.addEventListener("load", updateBoardSize);

function updateBoardSize() {
  if (window.innerWidth > 550) {
    DEFAULT_BOARD_SIZE = 500;
    console.log(DEFAULT_BOARD_SIZE);
    $(".board").css("height", `${DEFAULT_BOARD_SIZE}`);
    $(".board").css("width", `${DEFAULT_BOARD_SIZE}`);
    updateBoard();
  }
  if (window.innerWidth < 550) {
    DEFAULT_BOARD_SIZE = window.innerWidth - 50;
    $(".board").css("height", `${DEFAULT_BOARD_SIZE}`);
    $(".board").css("width", `${DEFAULT_BOARD_SIZE}`);
    updateBoard();
  }
}
