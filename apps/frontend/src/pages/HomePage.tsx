import { Link } from 'react-router-dom';
import { BackendStatus } from '../components/BackendStatus';
import { PageContainer } from '../components/layout/PageContainer';

export function HomePage() {
  return (
    <div className="home-page">
      <section aria-labelledby="hero-heading" className="hero-banner">
        <div className="hero-banner__inner">
          <p className="hero-banner__eyebrow">WARSZAWA · LOKALNIE · ŚWIEŻO</p>
          <h1 id="hero-heading" className="hero-banner__title">
            Dobre jedzenie
            <br />
            biegnie do Ciebie.
          </h1>
          <p className="hero-banner__subtitle">
            Przeglądaj punkty na kampusie, sprawdzaj dostępność na żywo i zamawiaj szybko.
          </p>
          <div className="hero-banner__actions">
            <Link to="/vendors" className="hero-banner__cta-primary">
              Przeglądaj sprzedawców
            </Link>
            <Link to="/cart" className="hero-banner__cta-secondary">
              Zobacz koszyk
            </Link>
          </div>
        </div>
      </section>

      <div className="home-page__content">
        <PageContainer
          title="Strona główna / Menu"
          description="Sprawdź dzisiejsze dania na kampusie i szybkie wybory."
        >
          <BackendStatus />
          <p>Miejsce na treść makiety: Polecane dania i filtry kategorii.</p>
        </PageContainer>
      </div>
    </div>
  );
}
