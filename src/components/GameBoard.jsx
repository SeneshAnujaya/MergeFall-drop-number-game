import { useEffect, useReducer } from "react";
import { gameReducer, initialState } from "../context/GameReducer";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import burstAnim from "../assets/burst.json"; // adjust path
import { playSound } from "../hooks/useSound"; 
import dropSound from "../assets/drop-box.mp3";
import  mergeSound from "../assets/magic-merge.mp3";



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
    playSound(dropSound); // Play drop sound
    dispatch({ type: "DROP_BOX", payload: { columnIndex } });
  };

  const handleRestart = () => {
    dispatch({ type: "RESTART_GAME" });
  };

  useEffect(() => {
  if (
    state.mergedTile.col !== null &&
    state.mergedTile.row !== null
  ) {
    playSound(mergeSound); // ✅ Play merge sound
  }
}, [state.mergedTile]);


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

              const isMergedTile =
                state.mergedTile.col === colIndex &&
                state.mergedTile.row === rowIndex;

              return (
                <AnimatePresence key={rowIndex}>
                  <div className="relative w-12 h-12">
                    {/* Tail Effect */}
                    {isLastDrop && (
                      // <motion.div
                      //   initial={{ opacity: 0.6, scaleY: 1, y:0 }}
                      //   animate={{ opacity: 0, scaleY: 0.2, y: -8 }}
                      //   transition={{ duration: 1, ease: "easeOut" }}
                      //   className="absolute bottom-full h-8 left-0 w-full  bg-cyan-300 rounded-t opacity-50 z-0"
                      // />
                      <motion.div
                        initial={{ y: 0, opacity: 0.5, scaleY: 1 }}
                        animate={{ y: 0, opacity: 0, scaleY: 0.2 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className={`absolute bottom-full w-11 h-40 ${colorMap[num]} blur-md rounded opacity-50 z-0`}
                      />
                    )}
                    <motion.div
                      key={`${num}-${rowIndex}-${colIndex}`}
                      initial={
                        isLastDrop ? { y: -100, opacity: 0.6, scale: 1 } : false
                      }
                      animate={
                        isLastDrop
                          ? {
                              y: [-100, 0, -7, 0],
                              opacity: [0.6, 1, 1, 1],
                              scale: [1, 1.05, 1],
                            }
                          : isMergedTile
                          ? { scale: [1, 1.3, 0.9, 1], opacity: 1 }
                          : {}
                      }
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "tween",
                        duration: isMergedTile ? 1 : 0.6,
                        ease: "easeInOut",
                        // bounce: 0.3,
                        times: isMergedTile
                          ? [0, 0.3, 0.6, 1]
                          : [0, 0.6, 0.8, 1],
                      }}
                      className={`${
                        colorMap[num]
                      } w-12 h-12 text-center py-2 rounded text-lg font-semibold ${
                        isLastDrop ? "" : ""
                      }`}
                    >
                      {num}
                      {/* Optional Particle Burst */}
                      {/* {isMergedTile && (
                        <>
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ x: 0, y: 0, opacity: 1 }}
                              animate={{
                                x: Math.cos((i / 5) * 2 * Math.PI) * 12,
                                y: Math.sin((i / 5) * 2 * Math.PI) * 12,
                                opacity: 0,
                              }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                            />
                          ))}
                        </>
                        
                      )} */}
                      {/* {isMergedTile && (
                        <div className="absolute inset-0 pointer-events-none  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                          <Lottie
                            animationData={burstAnim}
                            loop={false}
                            onComplete={() => console.log("done")}
                            style={{ width: 94, height: 94 }}
                          />
                        </div>
                      )} */}
                      {isMergedTile && (
  <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
    <div className="relative">
      <Lottie
        animationData={burstAnim}
        loop={false}
        autoplay
        style={{
          width: 55,
          height: 55,
          transform: "scale(2.4)", // 🔥 Force scale
          transformOrigin: "center center",
        }}
      />
    </div>
  </div>
)}


                    </motion.div>
                  </div>
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
