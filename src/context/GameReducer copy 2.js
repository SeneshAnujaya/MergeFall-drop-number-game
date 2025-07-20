const MAX_HEIGHT = 8;

export const initialState = {
  board: [[], [], [], [], []],
  currentBox: generateRandomBox(),
  gameOver: false,
  score: 0,
};

function generateRandomBox() {
  const choices = [2, 4, 8, 16, 32, 64];
  return choices[Math.floor(Math.random() * choices.length)];
}

// Vertical merging within one column
function applyVerticalMerges(column) {
    let score = 0;
  let i = column.length - 1;
  while (i > 0) {
    if (column[i] === column[i - 1]) {
      column.splice(i - 1, 2, column[i] * 2);
      i = column.length; // restart after merge
    }
    i--;
  }
  return column;
}

// Horizontal merge across the board at each row
function mergeHorizontalAcrossBoard(board) {
  const maxHeight = Math.max(...board.map((col) => col.length));

  for (let row = 0; row < maxHeight; row++) {
    for (let col = 0; col < board.length - 1; col++) {
      const left = board[col];
      const right = board[col + 1];

      const leftVal = left[row];
      const rightVal = right[row];

      if (leftVal !== undefined && leftVal === rightVal) {
        // Merge into left
        left[row] = leftVal * 2;
        right.splice(row, 1);
      }
    }
  }

  return board;
}

export function gameReducer(state, action) {
  switch (action.type) {
    case "DROP_BOX": {
      const { columnIndex } = action.payload;

      if (state.gameOver) return state; // Ignore if game is over

      if (state.board[columnIndex].length >= MAX_HEIGHT) {
        return {
          ...state,
          gameOver: true,
        };
      }

      const value = state.currentBox;

      // Deep clone board
      let newBoard = state.board.map((col) => [...col]);

      // Drop into selected column
      newBoard[columnIndex].push(value);

      // Step 1: Apply vertical merges to that column
      newBoard[columnIndex] = applyVerticalMerges(newBoard[columnIndex]);

      // Step 2: Apply horizontal merges across board
      newBoard = mergeHorizontalAcrossBoard(newBoard);

      // Step 3: Re-apply vertical merges to all columns (chain reactions)
      newBoard = newBoard.map((col) => applyVerticalMerges(col));

      return {
        ...state,
        board: newBoard,
        currentBox: generateRandomBox(),
      };
    }
     case 'RESTART_GAME': {
      return {
        board: [[], [], [], [], []],
        currentBox: generateRandomBox(),
        gameOver: false,
      };
    }

    default:
      return state;
  }
}
