const MAX_HEIGHT = 8;

export const initialState = {
  board: [[], [], [], [], []],
  currentBox: generateRandomBox(),
  gameOver: false,
  score: 0,
  lastDrop: { col: null, row: null },
  mergedTile: { col: null, row: null },


};

function generateRandomBox() {
  const choices = [2, 4, 8, 16, 32, 64];
  return choices[Math.floor(Math.random() * choices.length)];
}

// Vertical merging within one column
// function applyVerticalMerges(column) {
//     let score = 0;
//   let i = column.length - 1;
//   while (i > 0) {
//     if (column[i] === column[i - 1]) {
//       column.splice(i - 1, 2, column[i] * 2);
//       i = column.length; // restart after merge
//     }
//     i--;
//   }
//   return column;
// }

function applyVerticalMerges(column, colIndex) {
  let score = 0;
  let mergedRow = null;
  let i = column.length - 1;
  while (i > 0) {
    if (column[i] === column[i - 1]) {
      const merged = column[i] * 2;
      column.splice(i - 1, 2, merged);
      score += merged;
      mergedRow = i - 1; // Track the row where merge happened
      i = column.length; // restart
    } else {
      i--;
    }
  }
  return { column, score, mergedRow };
}

// Horizontal merge across the board at each row
// function mergeHorizontalAcrossBoard(board) {
//   const maxHeight = Math.max(...board.map((col) => col.length));

//   for (let row = 0; row < maxHeight; row++) {
//     for (let col = 0; col < board.length - 1; col++) {
//       const left = board[col];
//       const right = board[col + 1];

//       const leftVal = left[row];
//       const rightVal = right[row];

//       if (leftVal !== undefined && leftVal === rightVal) {
//         // Merge into left
//         left[row] = leftVal * 2;
//         right.splice(row, 1);
//       }
//     }
//   }

//   return board;
// }

function mergeHorizontalAcrossBoard(board) {
  const maxHeight = Math.max(...board.map((col) => col.length));
  let score = 0;
  let mergedTile = null;

  for (let row = 0; row < maxHeight; row++) {
    for (let col = 0; col < board.length - 1; col++) {
      const left = board[col];
      const right = board[col + 1];

      const leftVal = left[row];
      const rightVal = right[row];

      if (leftVal !== undefined && leftVal === rightVal) {
        const merged = leftVal * 2;
        left[row] = merged;
        right.splice(row, 1);
        score += merged;
        mergedTile = {col, row}
      }
    }
  }

  return { board, score, mergedTile };
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

      let mergedTile = { col: null, row: null };

      // Step 1: Apply vertical merges to that column
    //   newBoard[columnIndex] = applyVerticalMerges(newBoard[columnIndex]);

    const vert1 = applyVerticalMerges(newBoard[columnIndex], columnIndex);
      newBoard[columnIndex] = vert1.column;

      if(vert1.mergedRow !== null) {
        mergedTile = { col: columnIndex, row: vert1.mergedRow };
      }

      // Step 2: Apply horizontal merges across board
    //   newBoard = mergeHorizontalAcrossBoard(newBoard);

     const horiz = mergeHorizontalAcrossBoard(newBoard);
      newBoard = horiz.board;

      if(horiz.mergedTile) {
        mergedTile = horiz.mergedTile;
      }

      // Step 3: Re-apply vertical merges to all columns (chain reactions)
    //   newBoard = newBoard.map((col) => applyVerticalMerges(col));
     let vert2Score = 0;
      newBoard = newBoard.map((col, colIdx) => {
        const result = applyVerticalMerges(col, colIdx);
        vert2Score += result.score;

        if(result.mergedRow !== null) {
          mergedTile = {col: colIdx, row: result.mergedRow};
        }

        return result.column;
      });

      const totalScore = vert1.score + horiz.score + vert2Score;

      const dropRowIndex = newBoard[columnIndex].length - 1;


      return {
        ...state,
        board: newBoard,
        currentBox: generateRandomBox(),
        score: state.score + totalScore,
        lastDrop: { col: columnIndex, row: dropRowIndex },
        mergedTile,

      };
    }
     case 'RESTART_GAME': {
      return {
        board: [[], [], [], [], []],
        currentBox: generateRandomBox(),
        gameOver: false,
        score: 0,
        lastDrop: { col: null, row: null },
        mergedTile: { col: null, row: null },


      };
    }

    default:
      return state;
  }
}
