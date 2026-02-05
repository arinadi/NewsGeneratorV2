'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  modelId: string;
  setModelId: (id: string) => void;
  isConnected: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = 'kuli_tinta_api_key';
const MODEL_STORAGE_KEY = 'kuli_tinta_model';

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [modelId, setModelIdState] = useState<string>('gemini-3-pro-preview');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKeyState(savedKey);
      setIsConnected(true);
    }
    const savedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    if (savedModel) {
      setModelIdState(savedModel);
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      setIsConnected(true);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setIsConnected(false);
    }
  };

  const setModelId = (id: string) => {
    setModelIdState(id);
    localStorage.setItem(MODEL_STORAGE_KEY, id);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, modelId, setModelId, isConnected }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}
