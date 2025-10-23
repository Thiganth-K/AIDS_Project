
export type SquareValue = 'X' | 'O' | null;

export interface WinnerInfo {
  winner: 'X' | 'O' | 'Draw' | null;
  line: number[] | null;
}
