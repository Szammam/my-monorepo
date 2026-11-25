import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModeSwitcher } from '../components/layout/ModeSwitcher';
import { Button } from '../components/ui/Button';
import { AddProductModal } from '../components/vendor/AddProductModal';
import { useAppContext, type ProductCategory } from '../context/AppContext';
import './VendorsPage.css';

type CategoryFilter = 'Wszystkie' | ProductCategory;

const CATEGORY_FILTERS: CategoryFilter[] = ['Wszystkie', 'Trendujące', 'Pizza', 'Azjatyckie'];

function formatPricePl(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')} zł`;
}

export function VendorsPage() {
  const navigate = useNavigate();
  const {
    mode,
    session,
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
  } = useAppContext();

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Wszystkie');
  const [cartOpen, setCartOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Wszystkie') return products;
    return products.filter((item) => item.category === selectedCategory);
  }, [products, selectedCategory]);

  const totalStock = useMemo(() => products.reduce((sum, item) => sum + item.stock, 0), [products]);

  const cartLines = useMemo(() => {
    return cart
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId);
        if (!product) return null;
        return {
          ...entry,
          product,
          lineTotal: entry.quantity * product.grossPrice,
        };
      })
      .filter((line): line is NonNullable<typeof line> => Boolean(line));
  }, [cart, products]);

  const cartTotal = useMemo(
    () => cartLines.reduce((sum, line) => sum + line.lineTotal, 0),
    [cartLines]
  );

  const vendorDisplayName = session?.userName || 'andy';

  function handleLogout() {
    logout();
    navigate('/');
  }

  function handlePlaceOrder() {
    placeOrder();
    setOrderConfirmed(true);
  }

  return (
    <div className="ops-page">
      {/* Pasek górny aplikacji */}
      <header className="ops-header">
        <div className="ops-header__inner">
          <Link to="/" className="ops-brand">
            <span className="ops-brand__signet" aria-hidden="true">
              s
            </span>
            <span className="ops-brand__name">szAmmAm</span>
          </Link>

          <ModeSwitcher />

          <div className="ops-header__right">
            {mode === 'vendor' || session ? (
              <>
                <span className="ops-user-badge">{vendorDisplayName}</span>
                <button type="button" onClick={handleLogout} className="ops-logout-btn">
                  Wyloguj
                </button>
              </>
            ) : (
              <Link to="/login" className="ops-login-btn">
                Zaloguj
              </Link>
            )}
          </div>
        </div>
      </header>

      {mode === 'client' ? (
        /* ====================================================================
           WIDOK 3: KATALOG OFERTOWY I ZAMAWIANIE („DLA KLIENTÓW”)
           ==================================================================== */
        <main className="ops-container ops-main">
          <div className="catalog-hero">
            <div>
              <p className="ops-eyebrow">MENU MIASTA</p>
              <h1 className="catalog-hero__title">
                Co dziś <span className="catalog-hero__accent">szAmmAsz?</span>
              </h1>
            </div>
            <p className="catalog-hero__sub">
              Wybierz danie od lokalnego dostawcy na kampusie i odbierz je bez czekania w kolejce.
            </p>
          </div>

          <div className="catalog-toolbar">
            <div role="group" aria-label="Filtry kategorii" className="category-pills">
              {CATEGORY_FILTERS.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setSelectedCategory(category);
                      setOrderConfirmed(false);
                    }}
                    className={`category-pill ${active ? 'category-pill--active' : ''}`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setCartOpen((prev) => !prev)}
              className="cart-pill-btn"
            >
              Koszyk · {cartCount}
            </button>
          </div>

          {orderConfirmed && (
            <div role="status" className="order-banner">
              Zamówienie przyjęte! Możesz odebrać posiłek w wybranym punkcie odbioru.
            </div>
          )}

          {cartOpen && (
            <section aria-label="Twój koszyk" className="cart-drawer">
              <div className="cart-drawer__top">
                <h2 className="cart-drawer__title">Koszyk ({cartCount})</h2>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="cart-drawer__close"
                >
                  Zamknij
                </button>
              </div>

              {cartLines.length === 0 ? (
                <p className="cart-drawer__empty">Twój koszyk jest pusty. Dodaj pozycję z listy.</p>
              ) : (
                <>
                  <ul className="cart-drawer__list">
                    {cartLines.map(({ product, quantity, lineTotal }) => (
                      <li key={product.id} className="cart-drawer__row">
                        <div>
                          <strong>{product.name}</strong>
                          <span className="cart-drawer__meta">
                            {' '}
                            · {formatPricePl(product.grossPrice)}
                          </span>
                        </div>
                        <div className="cart-drawer__controls">
                          <button
                            type="button"
                            aria-label={`Zmniejsz ilość: ${product.name}`}
                            onClick={() => updateCartQuantity(product.id, -1)}
                            className="qty-btn"
                          >
                            −
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            aria-label={`Zwiększ ilość: ${product.name}`}
                            onClick={() => updateCartQuantity(product.id, 1)}
                            className="qty-btn"
                          >
                            +
                          </button>
                          <span className="cart-drawer__subtotal">{formatPricePl(lineTotal)}</span>
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="remove-btn"
                          >
                            Usuń
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="cart-drawer__footer">
                    <strong>Razem: {formatPricePl(cartTotal)}</strong>
                    <Button type="button" variant="primary" onClick={handlePlaceOrder}>
                      Zamawiam →
                    </Button>
                  </div>
                </>
              )}
            </section>
          )}

          {filteredProducts.length === 0 ? (
            <div className="empty-box">
              <p className="empty-box__text">
                Brak dostępnych dań w kategorii „{selectedCategory}”.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSelectedCategory('Wszystkie')}
              >
                Pokaż wszystkie
              </Button>
            </div>
          ) : (
            <div className="offer-grid">
              {filteredProducts.map((item) => (
                <article key={item.id} className="offer-card">
                  <div className="offer-card__media">
                    <span className="offer-card__rating">★ {item.rating.toFixed(1)}</span>
                    <span className="offer-card__placeholder">{item.imageName || item.name}</span>
                  </div>

                  <div className="offer-card__body">
                    <div className="offer-card__head">
                      <h2 className="offer-card__title">{item.name}</h2>
                      <strong className="offer-card__price">
                        {formatPricePl(item.grossPrice)}
                      </strong>
                    </div>

                    <p className="offer-card__desc">{item.description}</p>

                    <button
                      type="button"
                      disabled={item.stock <= 0}
                      onClick={() => {
                        setOrderConfirmed(false);
                        addToCart(item.id);
                      }}
                      className="offer-card__add-btn"
                    >
                      {item.stock > 0 ? 'Dodaj do koszyka →' : 'Brak w magazynie'}
                    </button>
                  </div>

                  <div className="offer-card__footer">
                    <span>od {item.vendorName || 'Lokalny dostawca'}</span>
                    <span className="offer-card__tag">{item.category}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      ) : (
        /* ====================================================================
           WIDOK 4: PANEL ZARZĄDZANIA („DLA DOSTAWCÓW”)
           ==================================================================== */
        <main className="ops-container ops-main">
          <div className="vendor-top">
            <div>
              <p className="ops-eyebrow">PANEL DOSTAWCY</p>
              <h1 className="vendor-top__title">Dzień dobry, {vendorDisplayName}.</h1>
              <p className="vendor-top__sub">Twój biznes w jednym czytelnym widoku.</p>
            </div>

            <Button
              type="button"
              variant="primary"
              onClick={() => setIsAddModalOpen(true)}
              className="vendor-top__cta"
            >
              + Dodaj produkt
            </Button>
          </div>

          {/* 3 karty wskaźników KPI */}
          <div className="kpi-grid">
            <article className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-icon kpi-icon--lime" aria-hidden="true">
                  ▮▯
                </span>
                <span className="kpi-card__label">SPRZEDAŻ PRODUKTÓW</span>
              </div>
              <strong className="kpi-card__value">{soldCount} szt.</strong>
              <span className="kpi-card__meta">
                {soldCount === 0 ? 'Pierwsze zamówienia przed Tobą' : 'Zrealizowane pozycje'}
              </span>
            </article>

            <article className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-icon kpi-icon--coral" aria-hidden="true">
                  ▣
                </span>
                <span className="kpi-card__label">STAN MAGAZYNU</span>
              </div>
              <strong className="kpi-card__value">{totalStock} szt.</strong>
              <span className="kpi-card__meta">{products.length} aktywnych pozycji</span>
            </article>

            <article className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-icon kpi-icon--sky" aria-hidden="true">
                  ◫
                </span>
                <span className="kpi-card__label">WAŻNOŚĆ</span>
              </div>
              <strong className="kpi-card__value">0 uwag</strong>
              <span className="kpi-card__meta">Wszystko pod kontrolą</span>
            </article>
          </div>

          {/* Strefa robocza w układzie 2:1 */}
          <div className="vendor-workspace">
            <section aria-labelledby="my-products-heading" className="inventory-box">
              <div className="inventory-box__header">
                <div>
                  <p className="ops-eyebrow">MAGAZYN</p>
                  <h2 id="my-products-heading" className="inventory-box__title">
                    Twoje produkty
                  </h2>
                </div>
                <span className="inventory-box__counter">{products.length} pozycji</span>
              </div>

              {totalStock === 0 || products.length === 0 ? (
                <div className="inventory-empty">
                  <span className="inventory-empty__icon" aria-hidden="true">
                    📦
                  </span>
                  <p className="inventory-empty__text">
                    Magazyn jest pusty. Dodaj pierwszy produkt przyciskiem powyżej.
                  </p>
                </div>
              ) : (
                <ul className="inventory-list">
                  {products.map((item) => (
                    <li key={item.id} className="inventory-item">
                      <div>
                        <strong className="inventory-item__name">{item.name}</strong>
                        <p className="inventory-item__meta">
                          {item.category} · {formatPricePl(item.grossPrice)}
                        </p>
                      </div>
                      <span className="inventory-item__stock">{item.stock} szt.</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <aside className="vendor-side">
              <section className="calendar-tile">
                <div className="calendar-tile__head">
                  <span className="calendar-tile__badge" aria-hidden="true">
                    ◫
                  </span>
                  <h2 className="calendar-tile__title">Kalendarz — Dostępność</h2>
                </div>
                <p className="calendar-tile__text">
                  {products.length > 0
                    ? `Aktywne okna dla ${products.length} pozycji w ofercie.`
                    : 'Daty pojawią się po dodaniu produktów.'}
                </p>
              </section>

              <section className="tip-tile">
                <p className="tip-tile__label">WSKAZÓWKA DNIA</p>
                <p className="tip-tile__text">
                  Zdjęcia z naturalnym światłem sprzedają się średnio lepiej. Dbaj o jasny kadr i
                  pokaż najważniejszy składnik produktu.
                </p>
              </section>
            </aside>
          </div>
        </main>
      )}

      <AddProductModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmitProduct={addProduct}
      />
    </div>
  );
}
