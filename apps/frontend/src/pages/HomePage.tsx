import { Link } from 'react-router-dom';
import { BackendStatus } from '../components/BackendStatus';

interface PreviewProduct {
  id: string;
  title: string;
  description: string;
  badgeColor: 'lime' | 'coral' | 'turquoise';
  to: string;
}

const PREVIEW_PRODUCTS: PreviewProduct[] = [
  {
    id: 'bagietka-miejska',
    title: 'Bagietka miejska',
    description: 'Chrupiące pieczywo rzemieślnicze, świeże zioła i dodatki na szybki lunch.',
    badgeColor: 'lime',
    to: '/vendors',
  },
  {
    id: 'salatka-kampusowa',
    title: 'Sałatka kampusowa',
    description: 'Chrupiące liście, chrupiące ziarna i lekki sos przygotowane na świeżo.',
    badgeColor: 'turquoise',
    to: '/vendors',
  },
  {
    id: 'green-power-bowl',
    title: 'Green power bowl',
    description: 'Sycąca miska pełna roślinnych składników na intensywny dzień zajęć.',
    badgeColor: 'lime',
    to: '/vendors',
  },
  {
    id: 'wrap-street-food',
    title: 'Wrap street food',
    description: 'Ciepła tortilla zwijana tuż przed odbiorem z wyrazistymi dodatkami.',
    badgeColor: 'coral',
    to: '/vendors',
  },
  {
    id: 'kanapka-na-droge',
    title: 'Kanapka na drogę',
    description: 'Wygodna porcja zapakowana tak, aby łatwo zabrać ją między wykładami.',
    badgeColor: 'turquoise',
    to: '/vendors',
  },
  {
    id: 'sushi-box',
    title: 'Sushi box',
    description: 'Zestaw świeżych rolek przygotowany przez lokalny punkt gastronomiczny.',
    badgeColor: 'coral',
    to: '/vendors',
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    accent: 'lime' as const,
    title: 'Wybierasz',
    description: 'Przeglądasz świeżą ofertę z lokalnych punktów i wybierasz to, na co masz ochotę.',
  },
  {
    number: '02',
    accent: 'turquoise' as const,
    title: 'Dostawcy gotują',
    description: 'Wybrany lokal przygotowuje zamówienie na czas, bez zbędnego czekania w kolejce.',
  },
  {
    number: '03',
    accent: 'coral' as const,
    title: 'Łapiesz na kampusie',
    description: 'Odbierasz gotowy posiłek w wyznaczonym punkcie i wracasz do swoich spraw.',
  },
];

export function HomePage() {
  return (
    <div className="landing-page">
      {/* 3.1.A Pływający pasek nawigacyjny sekcji Landing + Scena Hero */}
      <section aria-labelledby="hero-heading" className="lp-hero">
        <div className="lp-landing-bar">
          <div className="lp-landing-bar__inner">
            <div className="lp-brand-mark">
              <span className="lp-brand-mark__name">szAmmAm</span>
              <span className="lp-brand-mark__sub">GOOD FOOD BETTER MOOD</span>
            </div>

            <nav aria-label="Nawigacja sekcji strony głównej" className="lp-anchor-nav">
              <a href="#o-nas" className="lp-anchor-pill lp-anchor-pill--turquoise">
                O NAS
              </a>
              <a href="#jak-dzialamy" className="lp-anchor-pill lp-anchor-pill--blue">
                JAK DZIAŁAMY
              </a>
              <a href="#zostan-dostawca" className="lp-anchor-pill lp-anchor-pill--coral">
                ZOSTAŃ DOSTAWCĄ
              </a>
              <a href="#kontakt" className="lp-anchor-pill lp-anchor-pill--amber">
                KONTAKT
              </a>
            </nav>

            <div className="lp-auth-zone">
              <Link to="/login" className="lp-auth-register">
                Zarejestruj się
              </Link>
              <Link to="/login" className="lp-auth-login">
                Zaloguj się
              </Link>
            </div>
          </div>
        </div>

        <div className="lp-hero__inner">
          <div className="lp-hero__content">
            <p className="lp-hero__eyebrow">WARSZAWA · LOKALNIE · ŚWIEŻO</p>
            <h1 id="hero-heading" className="lp-hero__title">
              <span className="lp-hero__line-primary">Dobre jedzenie</span>
              <span className="lp-hero__line-accent">biegnie do Ciebie.</span>
            </h1>
            <div className="lp-hero__status">
              <BackendStatus />
            </div>
          </div>
        </div>
      </section>

      {/* 3.1.B Sekcja „O nas” i siatka 6 kart (3x2) */}
      <section id="o-nas" aria-labelledby="about-heading" className="lp-section lp-about">
        <div className="lp-container">
          <div className="lp-about__header">
            <div className="lp-about__left">
              <p className="lp-eyebrow lp-eyebrow--coral">O NAS</p>
              <h2 id="about-heading" className="lp-h2">
                Dostarczamy jedzenie od najlepszych dostawców w naszym mieście.
              </h2>
            </div>
            <p className="lp-about__right">
              Łączymy lokalne kawiarnie, restauracje i punkty gastronomiczne z osobami szukającymi
              szybkiego odbioru posiłków w mieście i na kampusach.
            </p>
          </div>

          <div className="lp-product-grid">
            {PREVIEW_PRODUCTS.map((item) => (
              <article key={item.id} className="lp-product-card">
                <div className="lp-product-card__media">
                  <span className="lp-product-card__pack">szAmmAm · KRAFT</span>
                  <span
                    aria-hidden="true"
                    className={`lp-status-dot lp-status-dot--${item.badgeColor}`}
                  />
                </div>
                <div className="lp-product-card__body">
                  <h3 className="lp-product-card__title">{item.title}</h3>
                  <p className="lp-product-card__desc">{item.description}</p>
                  <Link to={item.to} className="lp-product-card__cta">
                    Zobacz w menu →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3.1.C Sekcja „Jak działamy” (Dark Mode) */}
      <section id="jak-dzialamy" aria-labelledby="how-heading" className="lp-section lp-how">
        <div className="lp-container">
          <p className="lp-eyebrow lp-eyebrow--turquoise">JAK DZIAŁAMY</p>
          <div className="lp-how__header">
            <h2 id="how-heading" className="lp-h2 lp-h2--light">
              Trzy kroki. Zero kombinowania.
            </h2>
            <p className="lp-how__lead">
              Zamawiasz wygodnie i odbierasz świeży posiłek dokładnie tam, gdzie jesteś — również w
              krótkiej przerwie między zajęciami.
            </p>
          </div>

          <div className="lp-steps-grid">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <article key={step.number} className="lp-step-card">
                <span className={`lp-step-badge lp-step-badge--${step.accent}`}>{step.number}</span>
                <h3 className="lp-step-card__title">{step.title}</h3>
                <p className="lp-step-card__desc">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3.1.D Wielkoformatowy baner rekrutacyjny dla partnerów (B2B) */}
      <section id="zostan-dostawca" aria-label="Zostań dostawcą" className="lp-section lp-b2b">
        <div className="lp-container">
          <div className="lp-b2b__banner">
            <span aria-hidden="true" className="lp-b2b__ring" />
            <div className="lp-b2b__content">
              <p className="lp-eyebrow lp-eyebrow--on-dark">ZOSTAŃ DOSTAWCĄ</p>
              <h2 className="lp-b2b__title">Twój lokal zasługuje na pełną salę.</h2>
              <p className="lp-b2b__desc">
                Wspieramy kawiarnie, sklepy spożywcze i restauracje, które chcą docierać do nowych
                klientów bez uciążliwych kosztów pośredników.
              </p>
              <Link to="/login" className="lp-b2b__cta">
                Dołącz jako partner →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3.1.E Sekcja kontaktowa (Asymmetric Bento Grid) */}
      <section id="kontakt" aria-labelledby="contact-heading" className="lp-section lp-contact">
        <div className="lp-container">
          <div className="lp-contact__layout">
            <div className="lp-contact__intro">
              <p className="lp-eyebrow lp-eyebrow--coral">KONTAKT</p>
              <h2 id="contact-heading" className="lp-h2">
                Porozmawiajmy o dobrym jedzeniu.
              </h2>
            </div>

            <div className="lp-bento">
              <div className="lp-bento__tile lp-bento__tile--light">
                <span className="lp-bento__label">NAPISZ</span>
                <a href="mailto:kontakt@szammam.pl" className="lp-bento__value">
                  kontakt@szammam.pl
                </a>
              </div>

              <div className="lp-bento__tile lp-bento__tile--light">
                <span className="lp-bento__label">ZADZWOŃ</span>
                <a href="tel:+48220000000" className="lp-bento__value">
                  +48 22 000 00 00
                </a>
              </div>

              <div className="lp-bento__tile lp-bento__tile--lime lp-bento__tile--wide">
                <span className="lp-bento__label">ZNAJDŹ NAS</span>
                <p className="lp-bento__value">
                  Warszawa · kampusy i punkty odbioru w całym mieście
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
