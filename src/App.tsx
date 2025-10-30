import React, { useState, useEffect, useCallback } from "react";
import { Hive } from "./components/Hive";
import { CorrectGuesses } from "./components/CorrectGuesses";
import { Progress } from "./components/Progress";
import { YesterdaysAnswers } from "./components/YesterdaysAnswers";
import { Info } from "./components/Info";
import { GameWon } from "./components/GameWon";
import { MigrationModal } from "./components/MigrationModal";
import { Modal } from "./components/Modal";
import { ToastContainer } from "./components/Toast";
import { InfoFilled, Calendar, Sunny, Moon } from "./components/Icons";
import { useMainStore } from "./store";
import { useTranslation } from "./hooks/useTranslation";
import allAnswers from "../data/allAnswers.json";
import "./App.scss";

interface Toast {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
}

function App() {
  const store = useMainStore();
  const { t } = useTranslation();
  const [showYesterdaysAnswers, setShowYesterdaysAnswers] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [zindex, setZindex] = useState(0);
  const [gameWonModalShown, setGameWonModalShown] = useState(false);
  const [darkmode, setDarkmode] = useState(store.theme === "dark");
  const [showMigrationModal, setShowMigrationModal] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);

  let timer: any;

  const showGameWonModal =
    store.getProgressPercentage() === 100 && !gameWonModalShown;

  // Setup toast message function
  useEffect(() => {
    const showMessage = (args: {
      message: string;
      type?: "success" | "error" | "info";
    }) => {
      const id = toastId;
      setToastId((prev) => prev + 1);
      setToasts((prev) => [...prev, { id, ...args }]);
    };

    store.setShowMessage(showMessage);
  }, [store, toastId]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const onToggleDarkMode = (checked: boolean) => {
    setDarkmode(checked);
    if (checked) {
      store.setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      store.setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  const checkUrl = () => {
    setShowMigrationModal(
      window.location.href.includes("spelling-b.netlify.app")
    );
  };

  const onOpenCorrectGuesses = () => {
    clearTimeout(timer);
    setZindex(-1);
  };

  const onCloseCorrectGuesses = () => {
    timer = setTimeout(() => {
      setZindex(0);
    }, 2000);
  };

  useEffect(() => {
    onToggleDarkMode(darkmode);
    checkUrl();
  }, []);

  useEffect(() => {
    store.startGame({ allAnswers });
  }, [store]);

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <Modal
        visible={showMigrationModal}
        title="URL Migration"
        onClose={() => setShowMigrationModal(false)}>
        <MigrationModal />
      </Modal>
      <Modal
        visible={showGameWonModal}
        title="Congratulations!"
        onClose={() => setGameWonModalShown(true)}>
        <GameWon />
      </Modal>
      <Modal
        visible={showYesterdaysAnswers}
        title={t("Yesterdays Answers")}
        onClose={() => setShowYesterdaysAnswers(false)}>
        <YesterdaysAnswers />
      </Modal>
      <Modal
        visible={showInfo}
        title={t("How to play")}
        onClose={() => setShowInfo(false)}>
        <Info />
      </Modal>
      <div className={`common-layout fireworks ${showGameWonModal ? "show-fireworks" : ""}`}>
        {showGameWonModal && (
          <>
            <div className="beforeFireworks" />
            <div className="afterFireworks" />
          </>
        )}
        <header className="header" id="title-header">
          <h2>
            <strong> Spelling Bee </strong>
            <span> {store.getGameDateString()} </span>
          </h2>
        </header>
        <nav className="menu">
          <div className="menu-item" onClick={() => setShowInfo(true)}>
            <span className="menu-icon-tooltip">{t("Info")}</span>
            <span className="menu-icon">
              <InfoFilled />
            </span>
            <span className="responsive-menu-text">{t("Info")}</span>
          </div>
          <div
            className="menu-item"
            onClick={() => setShowYesterdaysAnswers(true)}>
            <span className="menu-icon-tooltip">{t("Yesterday")}</span>
            <span className="menu-icon">
              <Calendar />
            </span>
            <span className="responsive-menu-text">{t("Yesterday")}</span>
          </div>
          <div className="menu-item">
            <label className="darkmode-switch">
              <input
                type="checkbox"
                checked={darkmode}
                onChange={(e) => onToggleDarkMode(e.target.checked)}
              />
              <span className="slider">
                {darkmode ? <Sunny /> : <Moon />}
              </span>
            </label>
          </div>
        </nav>
        <Progress />
        <CorrectGuesses
          onOpen={onOpenCorrectGuesses}
          onClose={onCloseCorrectGuesses}
        />
        <Hive zIndex={zindex} />
      </div>
    </>
  );
}

export default App;
