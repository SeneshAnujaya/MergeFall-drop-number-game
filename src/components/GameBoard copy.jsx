import { useReducer } from "react";
import { gameReducer, initialState } from "../context/GameReducer";
import { motion, AnimatePresence } from "framer-motion";

const colorMap = {
  2: "bg-yellow-300 text-yellow-900",
  4: "bg-yellow-400 text-yellow-900",
  8: "bg-orange-400 text-white",
  16: "bg-orange-500 text-white",
  32: "bg-red-400 text-white",
  64: "bg-red-600 text-white",
};

const GameBoard = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const handleDrop = (columnIndex) => {
    if (state.gameOver) return; // Ignore if game is over
    dispatch({ type: "DROP_BOX", payload: { columnIndex } });
  };

  const handleRestart = () => {
    dispatch({ type: "RESTART_GAME" });
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6 h-full">
      <div className="text-xl font-semibold text-white">
        🧮 Score: <span className="text-yellow-400">{state.score}</span>
      </div>
      {/* Incoming Box - floating centered */}
      <div className="flex items-center justify-center w-full max-w-xl">
        {!state.gameOver ? (
          <div
            className={`${
              colorMap[state.currentBox]
            } text-2xl font-bold rounded-lg px-6 py-4 w-15 h-15 flex items-center justify-center shadow-lg`}
          >
            {state.currentBox}
          </div>
        ) : (
          <div className="text-3xl font-bold text-red-500 mb-6">
            🎮 Game Over!
          </div>
        )}
        {state.gameOver && (
          <button
            onClick={handleRestart}
            className="ml-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded shadow"
          >
            🔄 Restart
          </button>
        )}
      </div>

      {/* Board Columns */}
      <div className="grid grid-cols-5 gap-2 h-auto min-h-[460px] w-full max-w-[350px]">
        {state.board.map((column, colIndex) => (
          <div
            key={colIndex}
            onClick={() => handleDrop(colIndex)}
            className={`${
              state.gameOver
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-700"
            } bg-gray-800 p-2 rounded min-h-[380px] flex flex-col-reverse gap-2  transition`}
          >
            {column.length === 0 && (
              <div className="text-gray-600 text-center mt-auto select-none w-12"></div>
            )}
            {column.map((num, rowIndex) => {
              const isLastDrop =
                state.lastDrop.col === colIndex &&
                state.lastDrop.row === rowIndex;

              return (
                <AnimatePresence key={rowIndex}>
                  <motion.div
                    key={rowIndex}
                    className={`${colorMap[num]} w-12 h-12 text-center py-2 rounded text-lg font-semibold`}
                  >
                    {num}
                  </motion.div>
                </AnimatePresence>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
