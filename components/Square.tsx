import React from 'react';
import { SquareValue } from '../types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinning, disabled }) => {
  const valueColor = value === 'X' ? 'text-blue-500' : 'text-teal-500';
  const winningAnimation = isWinning ? 'animate-pulse scale-110' : '';
  // Added bg-white and shadow-md to make squares visible
  const baseClasses = 'relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center text-6xl sm:text-7xl font-bold rounded-lg transition-all duration-300 ease-in-out bg-white shadow-md';
  // Enhanced interaction feedback
  const interactionClasses = disabled ? 'cursor-not-allowed opacity-75' : 'hover:bg-blue-100/50 transform hover:-translate-y-1';

  return (
    <button
      className={`${baseClasses} ${interactionClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
        {/* Animate the 'X' or 'O' inside the square, not the square itself */}
        {value && (
            <span 
              className={`${valueColor} ${winningAnimation}`}
              style={{ animation: 'pop-in 0.3s ease-out forwards' }}
            >
                {value}
            </span>
        )}
    </button>
  );
};

export default Square;
