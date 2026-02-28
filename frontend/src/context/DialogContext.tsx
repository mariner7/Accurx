import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Dialog } from '../components/common/Dialog';

interface DialogContextType {
  showDialog: (title: string, message: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const showDialog = (title: string, message: string) => {
    setTitle(title);
    setMessage(message);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog isOpen={isOpen} onClose={handleClose} title={title}>
        <p>{message}</p>
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
