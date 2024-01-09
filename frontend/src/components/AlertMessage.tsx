import React, { useEffect, useState } from 'react';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertProps> = ({ message, onClose }) => {
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
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'red', color: 'white', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>{message}</span>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }} onClick={handleDismiss}>
        X
      </button>
    </div>
  ) : null;
};

export default AlertMessage;
