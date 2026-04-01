import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SHOPPING_KEY = 'tchope_shopping_v2';

export type ShoppingItem = {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  recipeName?: string;
};

type ShoppingContextType = {
  items: ShoppingItem[];
  addItem: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  addItems: (items: Omit<ShoppingItem, 'id' | 'checked'>[]) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearAll: () => void;
};

const ShoppingContext = createContext<ShoppingContextType>({
  items: [],
  addItem: () => {},
  addItems: () => {},
  removeItem: () => {},
  toggleItem: () => {},
  clearAll: () => {},
});

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(SHOPPING_KEY).then((raw) => {
      if (raw) {
        try {
          setItems(JSON.parse(raw));
        } catch (e) {
          console.error('Failed to parse shopping list', e);
        }
      }
    });
  }, []);

  const persist = useCallback((next: ShoppingItem[]) => {
    setItems(next);
    AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(next));
  }, []);

  const addItem = useCallback(
    (item: Omit<ShoppingItem, 'id' | 'checked'>) => {
      const newItem: ShoppingItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        checked: false,
      };
      persist([...items, newItem]);
    },
    [items, persist]
  );

  const addItems = useCallback(
    (newItems: Omit<ShoppingItem, 'id' | 'checked'>[]) => {
      const prepared = newItems.map((item) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        checked: false,
      }));
      persist([...items, ...prepared]);
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(items.filter((i) => i.id !== id));
    },
    [items, persist]
  );

  const toggleItem = useCallback(
    (id: string) => {
      persist(
        items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
      );
    },
    [items, persist]
  );

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  return (
    <ShoppingContext.Provider
      value={{ items, addItem, addItems, removeItem, toggleItem, clearAll }}
    >
      {children}
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  return useContext(ShoppingContext);
}
