import React, { useState } from "react";
import { useMainStore } from "../store";
import { useTranslation } from "../hooks/useTranslation";
import { Modal } from "./Modal";
import "./Progress.scss";

export const Progress: React.FC = () => {
  const store = useMainStore();
  const { t } = useTranslation();
  const [showRanking, setShowRanking] = useState(false);

  const progressIndex = store.getProgressIndex();
  const progressPercentage = store.getProgressPercentage();
  const userScore = store.getUserScore();
  const scoreLevels = store.getScoreLevels();

  return (
    <>
      <Modal
        visible={showRanking}
        title={t("Ranking")}
        onClose={() => setShowRanking(false)}>
        <div className="ranking-dialog">
          <p>{t("RankMSG")}:</p>
          <ul>
            {scoreLevels.map((scoreLevel: number, index: number) => (
              <li key={`ranking${index}`}>
                {t(`rank.${index}`)} ({scoreLevel})
              </li>
            ))}
          </ul>
        </div>
      </Modal>
      <div className="row" onClick={() => setShowRanking(true)}>
        <strong className="rank-level">{t(`rank.${progressIndex}`)}</strong>
        <div className="progress-bar">
          <div className="progress-bar-outer">
            <div
              className="progress-bar-inner"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="progress-text">{userScore}</span>
        </div>
      </div>
    </>
  );
};
