import React, { useState, useEffect, useRef } from "react";
import { useMainStore } from "../store";
import { shuffle } from "../utils";
import { useTranslation } from "../hooks/useTranslation";
import "./Hive.scss";

interface HiveProps {
  zIndex: number;
}

export const Hive: React.FC<HiveProps> = ({ zIndex }) => {
  const store = useMainStore();
  const { t } = useTranslation();
  const [userGuess, setUserGuess] = useState("");
  const [otherLetters, setOtherLetters] = useState<string[]>([]);

  useEffect(() => {
    const letters = store.availableLetters
      .split("")
      .filter((l: string) => l !== store.middleLetter);
    setOtherLetters(letters);
  }, [store.availableLetters, store.middleLetter]);

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      const pressedKey = e.key.toLowerCase();
      if (pressedKey === "enter") {
        submitGuess();
        return;
      }
      if (["backspace", "delete"].includes(pressedKey)) {
        setUserGuess((prev) => prev.slice(0, -1));
        return;
      }
      if (
        pressedKey.length === 1 &&
        store.availableLetters.includes(pressedKey)
      ) {
        setUserGuess((prev) => prev + pressedKey);
        return;
      }
    };

    window.addEventListener("keyup", onKeyPress);
    return () => window.removeEventListener("keyup", onKeyPress);
  }, [store.availableLetters]);

  const submitGuess = () => {
    const guess = userGuess;
    setUserGuess("");
    store.submitGuess({ guess, t });
  };

  const handleShuffle = () => {
    setOtherLetters(shuffle(otherLetters, Math.random()));
  };

  const handleDelete = () => {
    setUserGuess((prev) => prev.slice(0, -1));
  };

  return (
    <div className="sb-controls" style={{ zIndex }}>
      <div className="user-guess">
        {userGuess.split("").map((letter, index) => (
          <strong
            key={`user-guess-${index}`}
            className={letter === store.middleLetter ? "middle-letter" : ""}>
            {letter}
          </strong>
        ))}
      </div>

      <div className="hive">
        <svg
          className="hive-cell center"
          onClick={() => setUserGuess((prev) => prev + store.middleLetter)}
          viewBox="0 0 120 104">
          <polygon
            className="cell-fill"
            points="0,52 30,0 90,0 120,52 90,104 30,104"
            stroke={store.getColor()}
            strokeWidth="7.5"
          />
          <text className="cell-letter" x="50%" y="50%" dy="10.75%">
            {store.middleLetter}
          </text>
        </svg>
        {otherLetters.map((letter, index) => (
          <svg
            key={index}
            onClick={() => setUserGuess((prev) => prev + letter)}
            className="hive-cell outer"
            viewBox="0 0 120 104">
            <polygon
              className="cell-fill"
              points="0,52 30,0 90,0 120,52 90,104 30,104"
              stroke={store.getColor()}
              strokeWidth="7.5"
            />
            <text className="cell-letter" x="50%" y="50%" dy="10.75%">
              {letter}
            </text>
          </svg>
        ))}
      </div>

      <div className="hive-actions">
        <button
          className="hive-action hive-action__delete sb-touch-button"
          style={{ marginLeft: 0, minWidth: "5.5em" }}
          onClick={handleDelete}>
          {t("Delete")}
        </button>
        <button
          className="hive-action hive-action__shuffle sb-touch-button"
          onClick={handleShuffle}
        />
        <button
          className="hive-action hive-action__submit sb-touch-button"
          style={{ minWidth: "5.5em" }}
          onClick={submitGuess}>
          {t("Enter")}
        </button>
      </div>
    </div>
  );
};
