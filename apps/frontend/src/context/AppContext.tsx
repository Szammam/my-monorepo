import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AppContext,
  type AppMode,
  type AppContextValue,
  type AuthSession,
  type CartEntry,
  type CatalogProduct,
  type NewProductInput,
  type UserRole,
} from './appContextCore';

export type {
  AppMode,
  UserRole,
  ProductCategory,
  AuthSession,
  CatalogProduct,
  CartEntry,
  NewProductInput,
  AppContextValue,
} from './appContextCore';
export { useAppContext } from './appContextCore';

const MODE_STORAGE_KEY = 'szammam.mode';
const SESSION_STORAGE_KEY = 'szammam.session';

const INITIAL_PRODUCTS: CatalogProduct[] = [
  {
    id: 'crispy-bao-trio',
    name: 'Crispy Bao Trio',
    description:
      'Trzy puszyste bułeczki bao z chrupiącym kurczakiem, marynowanym ogórkiem i kolendrą.',
    netPrice: 28.37,
    grossPrice: 34.9,
    stock: 12,
    category: 'Azjatyckie',
    rating: 4.8,
    vendorName: 'Lokalny dostawca',
    availableFrom: '2026-01-01',
    availableTo: '2026-12-31',
    expiryDate: '2026-12-20',
  },
  {
    id: 'burrata-napoli',
    name: 'Burrata Napoli',
    description:
      'Rzemieślnicze ciasto dojrzewające, kremowa burrata, pomidorki koktajlowe i świeża bazylia.',
    netPrice: 35.69,
    grossPrice: 43.9,
    stock: 8,
    category: 'Pizza',
    rating: 4.9,
    vendorName: 'Lokalny dostawca',
    availableFrom: '2026-01-01',
    availableTo: '2026-12-31',
    expiryDate: '2026-12-18',
  },
  {
    id: 'ramen-miso-fire',
    name: 'Ramen Miso Fire',
    description:
      'Aromatyczny bulion na bazie pasty miso, sprężysty makaron, jajko marynowane i sezam.',
    netPrice: 32.44,
    grossPrice: 39.9,
    stock: 10,
    category: 'Trendujące',
    rating: 4.7,
    vendorName: 'Lokalny dostawca',
    availableFrom: '2026-01-01',
    availableTo: '2026-12-31',
    expiryDate: '2026-12-15',
  },
];

function readInitialMode(): AppMode {
  try {
    const saved = window.localStorage.getItem(MODE_STORAGE_KEY);
    return saved === 'vendor' ? 'vendor' : 'client';
  } catch {
    return 'client';
  }
}

function readInitialSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (parsed && typeof parsed.userName === 'string' && parsed.userName.trim()) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(readInitialMode);
  const [role, setRoleState] = useState<UserRole>(() => readInitialMode());
  const [session, setSession] = useState<AuthSession | null>(readInitialSession);
  const [products, setProducts] = useState<CatalogProduct[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [soldCount, setSoldCount] = useState(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch {
      // Ignorujemy błędy dostępu do localStorage w trybie ograniczonym
    }
  }, [mode]);

  useEffect(() => {
    try {
      if (session) {
        window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignorujemy błędy dostępu do localStorage w trybie ograniczonym
    }
  }, [session]);

  const setMode = useCallback((nextMode: AppMode) => {
    setModeState(nextMode);
    setRoleState(nextMode);
  }, []);

  const setRole = useCallback((nextRole: UserRole) => {
    setRoleState(nextRole);
    setModeState(nextRole);
  }, []);

  const loginAs = useCallback((nextSession: AuthSession) => {
    setSession(nextSession);
    setRoleState(nextSession.role);
    setModeState(nextSession.role);
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setModeState('client');
    setRoleState('client');
  }, []);

  const addProduct = useCallback(
    (input: NewProductInput) => {
      const ownerLabel =
        session?.restaurantName?.trim() || session?.userName?.trim() || 'Lokalny dostawca';

      const created: CatalogProduct = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: input.name.trim(),
        description: input.description.trim(),
        netPrice: input.netPrice,
        grossPrice: input.grossPrice,
        stock: Math.max(0, Math.floor(input.stock)),
        category: input.category,
        rating: 4.8,
        vendorName: ownerLabel,
        availableFrom: input.availableFrom || undefined,
        availableTo: input.availableTo || undefined,
        expiryDate: input.expiryDate || undefined,
        imageName: input.imageName || undefined,
      };

      setProducts((prev) => [created, ...prev]);
    },
    [session]
  );

  const addToCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const placeOrder = useCallback(() => {
    setCart((currentCart) => {
      const totalOrdered = currentCart.reduce((acc, item) => acc + item.quantity, 0);
      if (totalOrdered > 0) {
        setSoldCount((prev) => prev + totalOrdered);
        setProducts((prevProducts) =>
          prevProducts.map((product) => {
            const orderedEntry = currentCart.find((c) => c.productId === product.id);
            if (!orderedEntry) return product;
            return {
              ...product,
              stock: Math.max(0, product.stock - orderedEntry.quantity),
            };
          })
        );
      }
      return [];
    });
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, entry) => sum + entry.quantity, 0), [cart]);

  const value = useMemo<AppContextValue>(
    () => ({
      mode,
      setMode,
      role,
      setRole,
      session,
      loginAs,
      logout,
      products,
      addProduct,
      cart,
      cartCount,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      placeOrder,
      soldCount,
    }),
    [
      mode,
      setMode,
      role,
      setRole,
      session,
      loginAs,
      logout,
      products,
      addProduct,
      cart,
      cartCount,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      placeOrder,
      soldCount,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
