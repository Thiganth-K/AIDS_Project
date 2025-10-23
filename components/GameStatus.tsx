
import React from 'react';
import { WinnerInfo } from '../types';

interface GameStatusProps {
    winnerInfo: WinnerInfo | null;
    isXNext: boolean;
    isAiThinking: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ winnerInfo, isXNext, isAiThinking }) => {
    let statusText;
    let textColor = 'text-slate-700';
    let icon;

    if (winnerInfo?.winner) {
        if (winnerInfo.winner === 'Draw') {
            statusText = "It's a draw!";
            textColor = 'text-amber-600';
            icon = '🤝';
        } else if (winnerInfo.winner === 'X') {
            statusText = 'Congratulations, You Win!';
            textColor = 'text-green-600';
            icon = '🎉';
        } else {
            statusText = 'AI Wins! Better luck next time.';
            textColor = 'text-red-600';
            icon = '🤖';
        }
    } else if (isAiThinking) {
        statusText = 'AI is thinking...';
        textColor = 'text-blue-500 animate-pulse';
        icon = '🧠';
    } else {
        statusText = isXNext ? "Your Turn (X)" : "AI's Turn (O)";
        icon = isXNext ? '🧑' : '🤖';
    }

    return (
        <div className="text-center p-4">
            <h2 className={`text-2xl sm:text-3xl font-bold transition-colors duration-300 ${textColor}`}>
                <span className="mr-2">{icon}</span>{statusText}
            </h2>
        </div>
    );
};

export default GameStatus;
