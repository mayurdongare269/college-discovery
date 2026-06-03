'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompareContextType {
  compareIds: number[];
  addToCompare: (id: number) => boolean;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('compareColleges');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompareIds(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        localStorage.removeItem('compareColleges');
      }
    }
  }, []);

  // Save to localStorage whenever compareIds changes
  useEffect(() => {
    localStorage.setItem('compareColleges', JSON.stringify(compareIds));
  }, [compareIds]);

  const addToCompare = (id: number): boolean => {
    if (compareIds.includes(id)) {
      return false; // Already in compare
    }
    if (compareIds.length >= 3) {
      return false; // Max 3 colleges
    }
    setCompareIds([...compareIds, id]);
    return true;
  };

  const removeFromCompare = (id: number) => {
    setCompareIds(compareIds.filter((cid) => cid !== id));
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const isInCompare = (id: number): boolean => {
    return compareIds.includes(id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        compareCount: compareIds.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
