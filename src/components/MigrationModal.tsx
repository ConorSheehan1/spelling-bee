import React from "react";

export const MigrationModal: React.FC = () => {
  return (
    <div>
      <p>
        The{" "}
        <a href="https://spelling-b.netlify.app" className="link-primary">
          https://spelling-b.netlify.app
        </a>{" "}
        URL will stop working soon.
      </p>
      <p>
        Please use{" "}
        <a href="https://spelling-bee-free.pages.dev" className="link-primary">
          https://spelling-bee-free.pages.dev
        </a>{" "}
        instead. Sorry for the short notice!
      </p>
    </div>
  );
};
