import { GoogleGenAI, Type } from "@google/genai";
import { SquareValue } from "../types";

const getAiMove = async (board: SquareValue[]): Promise<number> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not set in environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const availableMoves = board
    .map((value, index) => (value === null ? index : null))
    .filter((val) => val !== null);

  if (availableMoves.length === 0) {
    return -1; // Should not happen in a real game flow
  }

  const prompt = `
    You are a Tic-Tac-Toe AI. Your mark is 'O'. The user is 'X'.
    The board is a 9-element array: ${JSON.stringify(board)}.
    'null' is an empty square.
    Available move indices: ${availableMoves.join(", ")}.
    
    Return ONLY the index of your best move.
    Priorities:
    1. Win if possible.
    2. Block user 'X' from winning.
    3. Take a strategic position (center, then corners).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            move: {
              type: Type.INTEGER,
              description: "The index (0-8) of the best move for 'O'.",
            }
          },
          required: ["move"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    const move = jsonResponse.move;

    if (typeof move === 'number' && availableMoves.includes(move)) {
        return move;
    } else {
        // Fallback if AI returns an invalid move
        console.warn("AI returned an invalid move. Picking a random available move.");
        return availableMoves[Math.floor(Math.random() * availableMoves.length)] as number;
    }
  } catch (error) {
    console.error("Error fetching AI move from Gemini API:", error);
    // Fallback in case of API error
    return availableMoves[Math.floor(Math.random() * availableMoves.length)] as number;
  }
};

export { getAiMove };