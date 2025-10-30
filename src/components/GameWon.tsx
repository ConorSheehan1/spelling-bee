import React from "react";
import { Support } from "./Support";

export const GameWon: React.FC = () => {
  return (
    <div>
      <h2>You're a spelling Genius!</h2>
      <Support />
      <span>
        If you liked this game, you might like the Irish version:{" "}
        <a
          href="https://beach-litriochta.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="link-primary">
          beacha litríochta
        </a>
      </span>
    </div>
  );
};
