export type AssetStatus = 'libre' | 'asignado' | 'almacen' | 'dañado' | 'vendido';

export interface Asset {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  category: string;
  status: AssetStatus;
  assignedTo?: string;
  assignedDate?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  location: string;
  notes?: string;
  history: AssetHistoryEntry[];
  createdAt: string;
}

export interface AssetHistoryEntry {
  id: string;
  date: string;
  action: string;
  from?: string;
  to?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
}
