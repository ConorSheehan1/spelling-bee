import React from "react";
import githubIcon from "../assets/github.svg";
import "./Support.scss";

export const Support: React.FC = () => {
  return (
    <>
      <span>If you're enjoying the game you can show your support by</span>
      <ul>
        <li>
          Starring the project on{" "}
          <a
            href="https://github.com/ConorSheehan1/spelling-bee"
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary">
            GitHub
            <img
              height="36"
              src={githubIcon}
              alt="github"
              className="github-icon"
            />
          </a>
        </li>
        <li>
          or donating on{" "}
          <a
            href="https://ko-fi.com/A0A1DOQQD"
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary">
            <img
              height="36"
              style={{ border: 0, height: "36px" }}
              src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </a>
        </li>
      </ul>
    </>
  );
};
