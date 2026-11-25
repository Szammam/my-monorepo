import { createContext, useContext } from 'react';

export type AppMode = 'client' | 'vendor';
export type UserRole = 'client' | 'vendor';
export type ProductCategory = 'Trendujące' | 'Pizza' | 'Azjatyckie';

export interface AuthSession {
  userName: string;
  role: UserRole;
  restaurantName?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  netPrice: number;
  grossPrice: number;
  stock: number;
  category: ProductCategory;
  rating: number;
  vendorName: string;
  availableFrom?: string;
  availableTo?: string;
  expiryDate?: string;
  imageName?: string;
}

export interface CartEntry {
  productId: string;
  quantity: number;
}

export interface NewProductInput {
  name: string;
  description: string;
  netPrice: number;
  grossPrice: number;
  stock: number;
  category: ProductCategory;
  availableFrom: string;
  availableTo: string;
  expiryDate: string;
  imageName?: string;
}

export interface AppContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  session: AuthSession | null;
  loginAs: (session: AuthSession) => void;
  logout: () => void;
  products: CatalogProduct[];
  addProduct: (input: NewProductInput) => void;
  cart: CartEntry[];
  cartCount: number;
  addToCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  placeOrder: () => void;
  soldCount: number;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext musi być użyty wewnątrz AppProvider');
  }
  return ctx;
}
