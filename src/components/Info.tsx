import React from "react";
import { Support } from "./Support";
import { useTranslation } from "../hooks/useTranslation";
import "./Info.scss";

const email = "conor.sheehan.dev@gmail.com";

export const Info: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="info-dialog">
      <h3>{t("helpCreateWords")}</h3>

      <ul>
        <li>{t("helpWordRule1")}.</li>
        <li>{t("helpWordRule2")}.</li>
        <li>{t("helpWordRule3")}.</li>
      </ul>

      <h3>{t("helpScorePoints")}</h3>

      <ul>
        <li>{t("helpPointsRule1")}.</li>
        <li>{t("helpPointsRule2")}.</li>
        <li>
          {t("helpPointsRule3A")}. {t("helpPointsRule3B")}!
        </li>
      </ul>

      <h3>Support</h3>
      <Support />

      <h3>{t("AboutGame")}</h3>
      <ul>
        <li>{t("AboutGameText")}</li>
        <li>
          {t("InspirationSpellingBee")}{" "}
          <a
            href="https://www.nytimes.com/puzzles/spelling-bee"
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary">
            New York Times Spelling Bee
          </a>
        </li>
        <li>
          {t("WordlistSource")}{" "}
          <a
            href="https://github.com/en-wl/wordlist/blob/master/alt12dicts/2of4brif.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary">
            Wordlist
          </a>
        </li>
      </ul>

      <h3>{t("Bugs")}</h3>
      <ul>
        <li>
          {t("BugText")}{" "}
          <a
            href="https://github.com/ConorSheehan1/spelling-bee/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary">
            GitHub
          </a>{" "}
          {t("BugTextEmail")}{" "}
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary">
            {email}
          </a>
        </li>
      </ul>
    </div>
  );
};
