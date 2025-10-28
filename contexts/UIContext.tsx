import React, { createContext, useState, useContext, ReactNode } from 'react';

type InitialState = 'login' | 'register';

interface UIContextType {
  isAuthModalOpen: boolean;
  authModalState: InitialState;
  openAuthModal: (initialState?: InitialState) => void;
  closeAuthModal: () => void;
  setAuthModalState: (state: InitialState) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<InitialState>('login');

  // Ensure modal is closed on app initialization
  React.useEffect(() => {
    setIsAuthModalOpen(false);
    setAuthModalState('login');
  }, []);

  const openAuthModal = (initialState: InitialState = 'login') => {
    setAuthModalState(initialState);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    // Reset modal state after a brief delay to allow for smooth animations
    setTimeout(() => {
      setAuthModalState('login');
    }, 300);
  };

  return (
    <UIContext.Provider value={{ isAuthModalOpen, openAuthModal, closeAuthModal, authModalState, setAuthModalState }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
