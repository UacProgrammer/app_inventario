import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Asset, AssetStatus, Employee, Category, Location, AssetHistoryEntry } from '../types';
import { initialAssets, initialEmployees, initialCategories, initialLocations } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

interface StoreContextType {
  assets: Asset[];
  employees: Employee[];
  categories: Category[];
  locations: Location[];
  addAsset: (asset: Omit<Asset, 'id' | 'history' | 'createdAt'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  assignAsset: (assetId: string, employeeId: string, notes?: string) => void;
  returnAsset: (assetId: string, notes?: string) => void;
  markDamaged: (assetId: string, notes?: string) => void;
  markSold: (assetId: string, notes?: string) => void;
  moveToStorage: (assetId: string, notes?: string) => void;
  markFree: (assetId: string, notes?: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  getEmployeeById: (id: string) => Employee | undefined;
  getAssetsByStatus: (status: AssetStatus) => Asset[];
  getStats: () => { total: number; libre: number; asignado: number; almacen: number; dañado: number; vendido: number; totalValue: number };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error loading from storage:', e);
  }
  return defaultValue;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(() => loadFromStorage('assets', initialAssets));
  const [employees] = useState<Employee[]>(initialEmployees);
  const [categories] = useState<Category[]>(initialCategories);
  const [locations] = useState<Location[]>(initialLocations);

  useEffect(() => {
    localStorage.setItem('assets', JSON.stringify(assets));
  }, [assets]);

  const addAsset = (assetData: Omit<Asset, 'id' | 'history' | 'createdAt'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0],
      history: [{
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        action: 'Activo creado',
        notes: `Ingresado como ${assetData.status}`
      }]
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const addHistoryEntry = (assetId: string, action: string, from?: string, to?: string, notes?: string) => {
    const entry: AssetHistoryEntry = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      action,
      from,
      to,
      notes
    };
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, history: [...a.history, entry] } : a));
  };

  const assignAsset = (assetId: string, employeeId: string, notes?: string) => {
    const employee = employees.find(e => e.id === employeeId);
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return { ...a, status: 'asignado' as AssetStatus, assignedTo: employeeId, assignedDate: new Date().toISOString().split('T')[0] };
      }
      return a;
    }));
    addHistoryEntry(assetId, 'Asignado', undefined, employee?.name, notes);
  };

  const returnAsset = (assetId: string, notes?: string) => {
    const asset = assets.find(a => a.id === assetId);
    const employee = asset?.assignedTo ? employees.find(e => e.id === asset.assignedTo) : undefined;
    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return { ...a, status: 'almacen' as AssetStatus, assignedTo: undefined, assignedDate: undefined };
      }
      return a;
    }));
    addHistoryEntry(assetId, 'Devuelto a almacén', employee?.name, undefined, notes);
  };

  const markDamaged = (assetId: string, notes?: string) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'dañado' as AssetStatus, assignedTo: undefined, assignedDate: undefined } : a));
    addHistoryEntry(assetId, 'Marcado como dañado', undefined, undefined, notes);
  };

  const markSold = (assetId: string, notes?: string) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'vendido' as AssetStatus, assignedTo: undefined, assignedDate: undefined } : a));
    addHistoryEntry(assetId, 'Vendido', undefined, undefined, notes);
  };

  const moveToStorage = (assetId: string, notes?: string) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'almacen' as AssetStatus, assignedTo: undefined, assignedDate: undefined } : a));
    addHistoryEntry(assetId, 'Movido a almacén', undefined, undefined, notes);
  };

  const markFree = (assetId: string, notes?: string) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status: 'libre' as AssetStatus, assignedTo: undefined, assignedDate: undefined } : a));
    addHistoryEntry(assetId, 'Marcado como libre', undefined, undefined, notes);
  };

  const getAssetById = (id: string) => assets.find(a => a.id === id);
  const getEmployeeById = (id: string) => employees.find(e => e.id === id);
  const getAssetsByStatus = (status: AssetStatus) => assets.filter(a => a.status === status);

  const getStats = () => ({
    total: assets.length,
    libre: assets.filter(a => a.status === 'libre').length,
    asignado: assets.filter(a => a.status === 'asignado').length,
    almacen: assets.filter(a => a.status === 'almacen').length,
    dañado: assets.filter(a => a.status === 'dañado').length,
    vendido: assets.filter(a => a.status === 'vendido').length,
    totalValue: assets.reduce((sum, a) => sum + (a.purchasePrice || 0), 0),
  });

  return (
    <StoreContext.Provider value={{
      assets, employees, categories, locations,
      addAsset, updateAsset, deleteAsset,
      assignAsset, returnAsset, markDamaged, markSold, moveToStorage, markFree,
      getAssetById, getEmployeeById, getAssetsByStatus, getStats
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
