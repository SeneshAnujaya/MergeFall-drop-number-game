import { useState } from "react";

import "./App.css";
import GameBoard from "./components/GameBoard";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <GameBoard />
      </div>
    </>
  );
}

export default App;
