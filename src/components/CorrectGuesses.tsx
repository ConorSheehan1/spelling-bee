import React, { useState, useEffect, useMemo } from "react";
import { useMainStore } from "../store";
import { gridify } from "../utils";
import { useTranslation } from "../hooks/useTranslation";
import "./CorrectGuesses.scss";

interface CorrectGuessesProps {
  onOpen: () => void;
  onClose: () => void;
}

export const CorrectGuesses: React.FC<CorrectGuessesProps> = ({
  onOpen,
  onClose,
}) => {
  const store = useMainStore();
  const { t } = useTranslation();
  const [showWords, setShowWords] = useState(false);

  const correctGuesses = store.getCorrectGuesses();

  const numCorrectMessage = useMemo(() => {
    return t("foundWords", correctGuesses.length);
  }, [correctGuesses.length, t]);

  const lastFiveGuesses = useMemo(() => {
    const numGuessesToShow = Math.min(correctGuesses.length, 5);
    return [...correctGuesses].reverse().slice(0, numGuessesToShow);
  }, [correctGuesses]);

  const gridData = useMemo(
    () => gridify({ arr: Array.from(correctGuesses).sort(), size: 3 }),
    [correctGuesses]
  );

  useEffect(() => {
    if (showWords) {
      onOpen();
    } else {
      onClose();
    }
  }, [showWords, onOpen, onClose]);

  const getCellClassName = (word: string | undefined) => {
    if (!word) return "";
    return store.cellClassName({ row: [word], columnIndex: -1 });
  };

  return (
    <div className="correct-guesses-collapse">
      <div
        className={`collapse-header ${showWords ? "expanded" : ""}`}
        onClick={() => setShowWords(!showWords)}>
        <div className="collapse-title">
          {showWords ? (
            numCorrectMessage
          ) : lastFiveGuesses.length === 0 ? (
            <span>{t("Your words")}...</span>
          ) : (
            <>
              {lastFiveGuesses.map((guess, index) => (
                <span key={guess} className={getCellClassName(guess)}>
                  {guess}
                  {index === lastFiveGuesses.length - 1 ? "" : ", "}
                </span>
              ))}
              {lastFiveGuesses.length === 5 && <span> ... </span>}
            </>
          )}
        </div>
        <span className="collapse-arrow">{showWords ? "▲" : "▼"}</span>
      </div>
      {showWords && (
        <div className="collapse-content">
          <table className="correct-guesses-table">
            <tbody>
              {gridData.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  <td className={getCellClassName(row["1"])}>{row["1"]}</td>
                  <td className={getCellClassName(row["2"])}>{row["2"]}</td>
                  <td className={getCellClassName(row["3"])}>{row["3"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
