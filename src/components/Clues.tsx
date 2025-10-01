import React from "react";

interface Word {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
}

interface CluesProps {
  words?: Word[];
  theme: "light" | "dark";
  isMobile: boolean;
  completedWords?: number[]; // ✅ added prop to track completed words
}

const Clues: React.FC<CluesProps> = ({
  words,
  theme,
  isMobile,
  completedWords,
}) => {
  if (!words) return null;

  const startPositions: Record<string, number> = {};
  words.forEach((w, index) => {
    startPositions[`${w.row}-${w.col}`] = index + 1;
  });

  const across = words.filter((w) => w.direction === "across");
  const down = words.filter((w) => w.direction === "down");

  const textColor = theme === "light" ? "#333" : "#fff";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "row" : "row", // always row, just wrap if mobile
        flexWrap: isMobile ? "wrap" : "nowrap",
        gap: "1rem",
        fontSize: "0.95rem",
        color: textColor,
        justifyContent: isMobile ? "space-between" : "flex-start",
      }}
    >
      {/* Across */}
      <div style={{ flex: 1, minWidth: isMobile ? "45%" : "auto" }}>
        <h3
          style={{
            borderBottom: "2px solid #4CAF50",
            paddingBottom: "0.5rem",
            marginBottom: "0.8rem",
            color: textColor,
          }}
        >
          Across
        </h3>
        <ul style={{ paddingLeft: "0.5rem", listStyle: "none", margin: 0 }}>
          {across.map((w, idx) => {
            const number = startPositions[`${w.row}-${w.col}`];
            const isCompleted = completedWords?.includes(words.indexOf(w));
            return (
              <li
                key={idx}
                style={{
                  marginBottom: "0.5rem",
                  color: textColor,
                  textDecoration: isCompleted ? "line-through" : "none", // ✅ line-through completed
                }}
              >
                <strong>{number}.</strong> {w.clue}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Down */}
      <div style={{ flex: 1, minWidth: isMobile ? "45%" : "auto" }}>
        <h3
          style={{
            borderBottom: "2px solid #2196F3",
            paddingBottom: "0.5rem",
            marginBottom: "0.8rem",
            color: textColor,
          }}
        >
          Down
        </h3>
        <ul style={{ paddingLeft: "0.5rem", listStyle: "none", margin: 0 }}>
          {down.map((w, idx) => {
            const number = startPositions[`${w.row}-${w.col}`];
            const isCompleted = completedWords?.includes(words.indexOf(w));
            return (
              <li
                key={idx}
                style={{
                  marginBottom: "0.5rem",
                  color: textColor,
                  textDecoration: isCompleted ? "line-through" : "none", // ✅ line-through completed
                }}
              >
                <strong>{number}.</strong> {w.clue}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Clues;
