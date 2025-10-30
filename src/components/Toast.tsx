import React, { useEffect, useState } from "react";
import "./Toast.scss";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 2000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast-message ${type} ${visible ? "visible" : ""}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: number;
    message: string;
    type?: "success" | "error" | "info";
  }>;
  onRemove: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemove,
}) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};
