
import React from 'react';
import { SquareValue, WinnerInfo } from '../types';
import Square from './Square';

interface BoardProps {
  squares: SquareValue[];
  onSquareClick: (index: number) => void;
  winnerInfo: WinnerInfo | null;
  isAiThinking: boolean;
}

const Board: React.FC<BoardProps> = ({ squares, onSquareClick, winnerInfo, isAiThinking }) => {
  const renderSquare = (i: number) => {
    const isWinning = winnerInfo?.line?.includes(i) ?? false;
    const isDisabled = !!squares[i] || !!winnerInfo?.winner || isAiThinking;
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        isWinning={isWinning}
        disabled={isDisabled}
      />
    );
  };
  
  // Custom key for re-triggering animation on reset
  const boardKey = squares.every(s => s === null) ? 'new' : 'active';

  return (
    <div key={boardKey} className="relative grid grid-cols-3 gap-2 bg-blue-200 p-2 rounded-xl shadow-lg">
      {[...Array(9)].map((_, i) => renderSquare(i))}
      <style>{`
        @keyframes pop-in {
            0% { transform: scale(0); opacity: 0; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Board;
