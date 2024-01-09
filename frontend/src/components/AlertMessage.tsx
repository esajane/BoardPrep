import React, { useEffect, useState } from "react";

interface AlertProps {
  message: string;
  type: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setShowAlert(false);
    onClose();
  };

  return showAlert ? (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        marginBottom: "20px",
        marginLeft: "20px",
        borderRadius: "8px",
        backgroundColor: type === "success" ? "#58f43c" : "red",
        color: "white",
        padding: "10px",
        display: "flex",
        justifyContent: "space-between",
        gap: "30px",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "white",
        }}
        onClick={handleDismiss}
      >
        X
      </button>
    </div>
  ) : null;
};

export default AlertMessage;
