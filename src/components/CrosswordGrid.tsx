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
  completedWords?: number[];
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
        padding: "5px",
        borderRadius: "8px",
        backgroundColor:
          theme === "light" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        justifyContent: "center",
        overflowX: "auto",
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
                minWidth: `${size}px`,
                minHeight: `${size}px`,
              }}
            >
              {isActive ? (
                <>
                  {number && (
                    <span
                      style={{
                        position: "absolute",
                        top: 1,
                        left: 2,
                        fontSize: Math.max(size / 4, 8),
                        fontWeight: "bold",
                        color: theme === "light" ? "#000" : "#fff",
                        userSelect: "none",
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
                      fontSize: isMobile ? size * 0.5 : size * 0.45,
                      border: "1px solid",
                      borderColor: theme === "light" ? "#555" : "#aaa",
                      backgroundColor: isHighlighted
                        ? theme === "light"
                          ? "#fffa90"
                          : "#ffc10790"
                        : completedCell
                        ? "#4CAF50"
                        : theme === "light"
                        ? "#fff"
                        : "#333",
                      color: theme === "light" ? "#000" : "#fff",
                      boxSizing: "border-box",
                      borderRadius: "3px",
                      padding: 0,
                      transition: "background-color 0.3s ease, color 0.3s ease",
                    }}
                  />
                </>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: theme === "light" ? "#555" : "#000",
                    border: "1px solid",
                    borderColor: theme === "light" ? "#555" : "#444",
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
