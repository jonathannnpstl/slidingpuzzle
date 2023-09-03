const BOARD_SIZE = 400;
const SIZE = 2;
const NUMBER_OF_TILES = SIZE ** 2;
const TILES_SIZE = BOARD_SIZE / NUMBER_OF_TILES;

class Board {
  constructor(size) {
    this.size = size;
    this.board_size = 500;
    this.tiles_size = this.board_size / this.size;
    this.createBoard();
  }

  createBoard() {
    let board = $(".board");
    let number = 1;
    for (let row = 0; row < this.size; row++) {
      let rowDiv = this.createRows();
      for (let col = 0; col < this.size; col++) {
        rowDiv.append(this.createTile(number++, row, col));
      }
      board.append(rowDiv);
    }
  }

  createTile(number, row, col) {
    console.log(row, col);
    return $("<div/>", {
      "data-pos": `${row},${col}`,
      text: number,
      class: "cell",
      id: number,
      css: {
        width: `${this.tiles_size}px`,
        height: `${this.tiles_size}px`,
      },
    });
  }

  createRows() {
    return $("<div/>", {
      class: "row",
    });
  }

  swap(node1, node2) {}

  shuffle() {}

  start() {
    console.log("Start");
  }
}

const board = new Board(SIZE);
