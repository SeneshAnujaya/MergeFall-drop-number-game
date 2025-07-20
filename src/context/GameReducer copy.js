export const initialState = {
  board: [[], [], [], [], []], // 5 columns
  currentBox: generateRandomBox(),
};

function generateRandomBox() {
  const choices = [2, 4, 8, 16, 32, 64];
  return choices[Math.floor(Math.random() * choices.length)];
}



export function gameReducer(state, action) {
  switch (action.type) {
    case 'DROP_BOX': {
      const { columnIndex } = action.payload;
      const value = state.currentBox;

      // Deep copy board
      const newBoard = state.board.map(col => [...col]);

      // Drop value into column
      newBoard[columnIndex].push(value);

    //   const newBoard = [...state.board];
    //   newBoard[columnIndex] = [...newBoard[columnIndex], value];

     // Apply full vertical merges recursively
  newBoard[columnIndex] = applyVerticalMerges(newBoard[columnIndex]);

     // Vertical merge
    //   const col = newBoard[columnIndex];
    //   const colLen = col.length;
    //   if (colLen >= 2 && col[colLen - 1] === col[colLen - 2]) {
    //     const merged = col[colLen - 1] * 2;
    //     col.splice(colLen - 2, 2, merged); // replace last two with merged value
    //   }

    // Merge all vertically in the column from top to bottom
function applyVerticalMerges(column) {
  let i = column.length - 1;
  while (i > 0) {
    if (column[i] === column[i - 1]) {
      column.splice(i - 1, 2, column[i] * 2); // merge
      i = column.length; // reset scan since column size changed
    }
    i--;
  }
  return column;
}

      // After vertical merge, check horizontal merge at the topmost row level
      const rowIndex = newBoard[columnIndex].length - 1;

         const currentVal = newBoard[columnIndex][rowIndex];

         // Check left and right columns
      const neighbors = [];

       if (columnIndex > 0) {
        const left = newBoard[columnIndex - 1];
        if (left[rowIndex] === currentVal) {
          neighbors.push(columnIndex - 1);
        }
      }

       if (columnIndex < 4) {
        const right = newBoard[columnIndex + 1];
        if (right[rowIndex] === currentVal) {
          neighbors.push(columnIndex + 1);
        }
      }

      // If horizontal matches found, merge all into current tile
      if (neighbors.length > 0) {
        let total = currentVal;
        neighbors.forEach(i => {
          total += newBoard[i][rowIndex];
          newBoard[i].splice(rowIndex, 1); // remove merged tile from neighbor
        });

        newBoard[columnIndex][rowIndex] = total;
        
         // Apply vertical merge again in case result can merge below
    newBoard[columnIndex] = applyVerticalMerges(newBoard[columnIndex]);// update current tile
      }

      return {
        ...state,
        board: newBoard,
        currentBox: generateRandomBox(),
      };
    }
    default:
      return state;
  }
}
