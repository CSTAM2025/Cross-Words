import React from "react";

interface Word {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
}

interface CrosswordGridProps {
  grid: string[][];
  onChange: (row: number, col: number, value: string) => void;
  handleKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => void;
  words: Word[];
  theme: "light" | "dark";
  highlightedCells?: string[];
  cellSize?: number;
  isMobile?: boolean;
  completedWords?: number[]; // ✅ added
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  onChange,
  handleKeyDown,
  words,
  theme,
  highlightedCells,
  cellSize,
  isMobile,
  completedWords,
}) => {
  const startPositions: Record<string, number> = {};
  words.forEach((w, idx) => {
    startPositions[`${w.row}-${w.col}`] = idx + 1;
  });

  const activeCells = new Set<string>();
  words.forEach((w) => {
    for (let k = 0; k < w.word.length; k++) {
      const r = w.row + (w.direction === "down" ? k : 0);
      const c = w.col + (w.direction === "across" ? k : 0);
      activeCells.add(`${r}-${c}`);
    }
  });

  const size = cellSize ?? 35;
  const gap = 2;

  const isCompletedCell = (i: number, j: number) => {
    if (!completedWords) return false;
    return words.some((w, idx) => {
      if (!completedWords.includes(idx)) return false;
      for (let k = 0; k < w.word.length; k++) {
        const r = w.row + (w.direction === "down" ? k : 0);
        const c = w.col + (w.direction === "across" ? k : 0);
        if (r === i && c === j) return true;
      }
      return false;
    });
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0].length}, ${size}px)`,
        gap: `${gap}px`,
        padding: "10px",
        borderRadius: "10px",
        backgroundColor:
          theme === "light" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.4)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      {grid.map((rowArr, i) =>
        rowArr.map((cell, j) => {
          const key = `${i}-${j}`;
          const number = startPositions[key];
          const isActive = activeCells.has(key);
          const isHighlighted = highlightedCells?.includes(key);
          const completedCell = isCompletedCell(i, j);

          return (
            <div
              key={key}
              style={{
                position: "relative",
                width: `${size}px`,
                height: `${size}px`,
              }}
            >
              {isActive ? (
                <>
                  {number && (
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: 2,
                        fontSize: 8,
                        fontWeight: "bold",
                        color: theme === "light" ? "#000" : "#fff",
                      }}
                    >
                      {number}
                    </span>
                  )}
                  <input
                    id={`cell-${i}-${j}`}
                    value={cell}
                    maxLength={1}
                    onChange={(e) => onChange(i, j, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i, j)}
                    style={{
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                      fontSize: isMobile ? 8 : 16,
                      border: "1px solid",
                      borderColor: theme === "light" ? "#555" : "#aaa",
                      backgroundColor: completedCell
                        ? "#4CAF50"
                        : isHighlighted
                        ? theme === "light"
                          ? "#fffa90"
                          : "#ffc10790"
                        : theme === "light"
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(50,50,50,0.85)",
                      boxSizing: "border-box",
                      padding: 0,
                      borderRadius: "3px",
                      color: theme === "light" ? "#000" : "#fff",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor:
                      theme === "light" ? "rgba(0,0,0,0.7)" : "#adf5ffff",
                    border: "1px solid",
                    borderColor: theme === "light" ? "#555" : "#aaa",
                    borderRadius: "3px",
                  }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CrosswordGrid;
