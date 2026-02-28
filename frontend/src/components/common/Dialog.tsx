import React from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="dialog-close-button">&times;</button>
        </div>
        <div className="dialog-body">
          {children}
        </div>
      </div>
    </div>
  );
}
