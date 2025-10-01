import React, { useState, useEffect } from "react";
import CrosswordGrid from "./components/CrosswordGrid";
import Clues from "./components/Clues";

interface Word {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: "across" | "down";
}

const crosswordWords: Word[] = [
  {
    word: "IMPACT",
    clue: "Strong effect or influence",
    row: 0,
    col: 1,
    direction: "across",
  },
  {
    word: "MEETING",
    clue: "Gathering of people to discuss something",
    row: 0,
    col: 2,
    direction: "down",
  },
  {
    word: "TECHNICAL",
    clue: "Specialized or practical",
    row: 2,
    col: 1,
    direction: "across",
  },
  {
    word: "NETWORKING",
    clue: "Building professional or digital connections",
    row: 2,
    col: 5,
    direction: "down",
  },
  {
    word: "MENTORING",
    clue: "Guiding and advising someone less experienced",
    row: 2,
    col: 14,
    direction: "down",
  },
  {
    word: "TUNISIAN",
    clue: "Person from Tunisia",
    row: 4,
    col: 5,
    direction: "across",
  },
  {
    word: "COMPUTING",
    clue: "Act of using a computer to process information",
    row: 6,
    col: 4,
    direction: "across",
  },
  {
    word: "SYMPOSIUM",
    clue: "Formal meeting where experts discuss a topic",
    row: 8,
    col: 3,
    direction: "down",
  },
  {
    word: "COMPUTER",
    clue: "Machine for processing data",
    row: 8,
    col: 8,
    direction: "down",
  },
  {
    word: "IEEE",
    clue: "Engineering organization for electrical and electronics engineers",
    row: 8,
    col: 14,
    direction: "across",
  },
  {
    word: "INNOVATION",
    clue: "Introduction of new ideas or methods",
    row: 9,
    col: 5,
    direction: "across",
  },
  {
    word: "TUNISIA",
    clue: "North African country on the Mediterranean",
    row: 9,
    col: 11,
    direction: "down",
  },
  {
    word: "GLOBAL",
    clue: "Worldwide or all-encompassing",
    row: 11,
    col: 15,
    direction: "down",
  },
  {
    word: "SOCIETY",
    clue: "Organized group sharing common rules",
    row: 13,
    col: 3,
    direction: "across",
  },
  {
    word: "INDIAN",
    clue: "Person from the second-most populous country",
    row: 13,
    col: 6,
    direction: "down",
  },
  {
    word: "CLOUD",
    clue: "Visible mass of condensed water in the sky, also online storage metaphor",
    row: 13,
    col: 13,
    direction: "across",
  },
  {
    word: "ANNUAL",
    clue: "Happening once every year",
    row: 15,
    col: 11,
    direction: "across",
  },
  {
    word: "NANO",
    clue: "Prefix meaning one-billionth",
    row: 15,
    col: 12,
    direction: "down",
  },
  {
    word: "MICRO",
    clue: "Opposite of MACRO",
    row: 18,
    col: 8,
    direction: "across",
  },
];

const GRID_SIZE = 19;
const SECRET_WORD = "CSTS";

const initializeGrid = (size: number) =>
  Array(size)
    .fill("")
    .map(() => Array(size).fill(""));

const App: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(() => initializeGrid(GRID_SIZE));
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [secretGuess, setSecretGuess] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const highlightedCells = ["13-7", "13-10", "13-2", "13-12"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkWordCompletion = (currentGrid: string[][]) => {
    const completedIndices: number[] = [];

    crosswordWords.forEach((w, idx) => {
      let isComplete = true;
      for (let k = 0; k < w.word.length; k++) {
        const r = w.row + (w.direction === "down" ? k : 0);
        const c = w.col + (w.direction === "across" ? k : 0);
        if (
          (currentGrid[r]?.[c] ?? "").toUpperCase() !== w.word[k].toUpperCase()
        ) {
          isComplete = false;
          break;
        }
      }
      if (isComplete) completedIndices.push(idx);
    });

    setCompletedWords(completedIndices);

    if (!completed && completedIndices.length === crosswordWords.length) {
      setCompleted(true);
      setShowModal(true);
    }
  };

  const handleChange = (row: number, col: number, value: string) => {
    const upperValue = value.toUpperCase();
    setGrid((prev) => {
      const newGrid = prev.map((r) => [...r]);
      newGrid[row][col] = upperValue;
      checkWordCompletion(newGrid);
      return newGrid;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    let newRow = row;
    let newCol = col;
    switch (e.key) {
      case "ArrowUp":
        newRow = Math.max(row - 1, 0);
        break;
      case "ArrowDown":
        newRow = Math.min(row + 1, GRID_SIZE - 1);
        break;
      case "ArrowLeft":
        newCol = Math.max(col - 1, 0);
        break;
      case "ArrowRight":
        newCol = Math.min(col + 1, GRID_SIZE - 1);
        break;
      default:
        return;
    }
    e.preventDefault();
    const input = document.getElementById(
      `cell-${newRow}-${newCol}`
    ) as HTMLInputElement;
    input?.focus();
  };

  const mobileCellSize = Math.floor(window.innerWidth / GRID_SIZE) - 2;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vw",
        padding: "2vw",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: theme === "light" ? "#f0f2f5" : "#121212",
        color: theme === "light" ? "#000" : "#fff",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
        alignItems: "center",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          gap: "2vw",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: isMobile ? 0 : "2vw",
            borderRadius: "10px",
            width: isMobile ? "100vw" : "auto",
            overflowX: "auto",
          }}
        >
          <CrosswordGrid
            grid={grid}
            onChange={handleChange}
            handleKeyDown={handleKeyDown}
            words={crosswordWords}
            theme={theme}
            highlightedCells={highlightedCells}
            cellSize={isMobile ? mobileCellSize : 35}
            isMobile={isMobile}
            completedWords={completedWords}
          />
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: theme === "light" ? "#ffffff" : "#2a2a2a",
            padding: "1rem",
            borderRadius: "1rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            marginTop: isMobile ? "1rem" : 0,
            transition: "background-color 0.3s ease",
          }}
        >
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              borderRadius: "5px",
              border: "none",
              backgroundColor: theme === "light" ? "#333" : "#ddd",
              color: theme === "light" ? "#fff" : "#000",
            }}
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Theme
          </button>
          <Clues
            words={crosswordWords}
            theme={theme}
            isMobile={isMobile}
            completedWords={completedWords}
          />
        </div>
      </div>

      {/* Secret word modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          {/* Backdrop blur */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.2)",
              zIndex: -1,
            }}
          />

          <div
            style={{
              backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
              padding: "2rem",
              borderRadius: "1rem",
              textAlign: "center",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              color: theme === "light" ? "#000" : "#fff",
              maxWidth: "90vw",
              animation: "scaleUp 0.4s ease forwards",
            }}
          >
            <h2>🎉 Good job! 🎉</h2>
            <p>You have completed the CSTAM2.0 crossword.</p>
            <p>Have you guessed the secret word?</p>

            <input
              type="text"
              value={secretGuess}
              onChange={(e) => setSecretGuess(e.target.value)}
              placeholder="Enter secret word"
              style={{
                padding: "0.5rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginTop: "1rem",
                width: "80%",
              }}
            />

            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => {
                  if (secretGuess.trim().toUpperCase() === SECRET_WORD) {
                    setShowModal(false);
                    setShowSuccessModal(true);
                  } else {
                    alert("Wrong guess, try again!");
                  }
                }}
                style={{
                  marginRight: "1rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: theme === "light" ? "#333" : "#ddd",
                  color: theme === "light" ? "#fff" : "#000",
                  fontWeight: "bold",
                }}
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#888",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.2)",
              zIndex: -1,
            }}
          />
          <div
            style={{
              backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
              padding: "2rem",
              borderRadius: "1rem",
              textAlign: "center",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              color: theme === "light" ? "#000" : "#fff",
              maxWidth: "90vw",
              animation: "scaleUp 0.4s ease forwards",
            }}
          >
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You guessed the secret word correctly!</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: theme === "light" ? "#333" : "#ddd",
                color: theme === "light" ? "#fff" : "#000",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
