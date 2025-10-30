import React, { useMemo } from "react";
import { useMainStore } from "../store";
import { gridify } from "../utils";
import "./YesterdaysAnswers.scss";

export const YesterdaysAnswers: React.FC = () => {
  const store = useMainStore();

  const gridData = useMemo(
    () => gridify({ arr: Array.from(store.yesterdaysAnswers).sort(), size: 3 }),
    [store.yesterdaysAnswers]
  );

  const getCellClassName = (word: string | undefined) => {
    if (!word) return "";
    return store.cellClassName({ row: [word], columnIndex: -1 });
  };

  return (
    <>
      <strong className="yesterday-letters">
        {store.yesterdaysAvailableLetters.split("").map((letter: string) => (
          <span
            key={`ydayLetter${letter}`}
            className={
              letter === store.yesterdaysMiddleLetter ? "middle-letter" : ""
            }>
            {letter}
          </span>
        ))}
      </strong>
      <table className="yesterdays-table">
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
    </>
  );
};
