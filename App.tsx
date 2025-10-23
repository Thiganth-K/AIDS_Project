import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import { SquareValue, WinnerInfo } from './types';
import { getAiMove } from './services/geminiService';
import useSoundEffects from './hooks/useSoundEffects';

const calculateWinner = (squares: SquareValue[]): WinnerInfo => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    if (squares.every(square => square !== null)) {
        return { winner: 'Draw', line: null };
    }
    return { winner: null, line: null };
};

const App: React.FC = () => {
    const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [winnerInfo, setWinnerInfo] = useState<WinnerInfo | null>(null);
    const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
    const { playSound, startThinkingSound, stopThinkingSound } = useSoundEffects();

    const handleReset = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinnerInfo(null);
        if (isAiThinking) {
            stopThinkingSound();
            setIsAiThinking(false);
        }
    };

    const handleSquareClick = (index: number) => {
        if (winnerInfo?.winner || board[index] || !isXNext || isAiThinking) {
            return;
        }
        
        playSound('click');
        const newBoard = board.slice();
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsXNext(false);
    };
    
    const triggerAiMove = useCallback(async (currentBoard: SquareValue[]) => {
        const currentWinnerInfo = calculateWinner(currentBoard);
        if (currentWinnerInfo.winner) {
            setWinnerInfo(currentWinnerInfo);
            return;
        }

        setIsAiThinking(true);
        startThinkingSound();
        try {
            const aiMoveIndex = await getAiMove(currentBoard);
            if (aiMoveIndex !== -1 && currentBoard[aiMoveIndex] === null) {
                const newBoard = currentBoard.slice();
                newBoard[aiMoveIndex] = 'O';
                playSound('click');
                setBoard(newBoard);
            }
        } catch (error) {
            console.error("Failed to get AI move:", error);
        } finally {
            stopThinkingSound();
            setIsAiThinking(false);
            setIsXNext(true);
        }
    }, [playSound, startThinkingSound, stopThinkingSound]);

    useEffect(() => {
        const newWinnerInfo = calculateWinner(board);
        
        if (newWinnerInfo.winner) {
             if (!winnerInfo?.winner) { // Play sound only on the transition to a won state
                if (newWinnerInfo.winner === 'Draw') {
                    playSound('draw');
                } else {
                    playSound('win');
                }
                if (isAiThinking) { // If win happens while AI is thinking
                    stopThinkingSound();
                    setIsAiThinking(false);
                }
            }
            setWinnerInfo(newWinnerInfo);
        } else if (!isXNext && !isAiThinking) {
            // Removed setTimeout for a faster AI response
            trigger
            AiMove(board);
        }
    }, [board, isXNext, isAiThinking, triggerAiMove, winnerInfo, playSound, stopThinkingSound]);

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 font-sans">
            <header className="text-center mb-6">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight">
                    AI Tic-Tac-Toe
                </h1>
                <p className="text-slate-500 mt-2 text-lg">Can you beat the Gemini AI?</p>
            </header>
            
            <main className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-2xl shadow-blue-200/50">
                <GameStatus winnerInfo={winnerInfo} isXNext={isXNext} isAiThinking={isAiThinking} />
                <Board 
                    squares={board} 
                    onSquareClick={handleSquareClick} 
                    winnerInfo={winnerInfo}
                    isAiThinking={isAiThinking}
                />
                <button
                    onClick={handleReset}
                    className="mt-8 px-8 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {winnerInfo?.winner ? 'Play Again' : 'Reset Game'}
                </button>
            </main>

            <footer className="text-center mt-8 text-slate-400 text-sm">
                <p>Powered by Google Gemini</p>
            </footer>
        </div>
    );
};

export default App;