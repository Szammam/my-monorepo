import { Link } from 'react-router-dom';
import './layout.css';

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div className="app-footer__grid">
          <div className="app-footer__brand-col">
            <Link to="/" className="app-footer__brand">
              szAmmAm
            </Link>
            <p className="app-footer__motto">Dobre jedzenie, lepszy humor, lokalne miasto.</p>
          </div>

          <div className="app-footer__col">
            <h3 className="app-footer__heading">O NAS</h3>
            <ul className="app-footer__list">
              <li>
                <a href="/#o-nas" className="app-footer__link">
                  Blog
                </a>
              </li>
              <li>
                <a href="/#jak-dzialamy" className="app-footer__link">
                  Nasz model biznesowy
                </a>
              </li>
              <li>
                <a href="/#zostan-dostawca" className="app-footer__link">
                  Zostań partnerem
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  Kariera
                </a>
              </li>
            </ul>
          </div>

          <div className="app-footer__col">
            <h3 className="app-footer__heading">WAŻNE</h3>
            <ul className="app-footer__list">
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  Prywatność danych
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  Ustawa o usługach cyfrowych
                </a>
              </li>
              <li>
                <Link to="/vendors" className="app-footer__link">
                  Aplikacja szAmmAm
                </Link>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          <div className="app-footer__col">
            <h3 className="app-footer__heading">OBSERWUJ</h3>
            <ul className="app-footer__list">
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  Facebook
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  Instagram
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  X / Twitter
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  YouTube
                </a>
              </li>
              <li>
                <a href="/#kontakt" className="app-footer__link">
                  Opinie Google
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="app-footer__bottom">
          <span>© 2026 szAmmAm. Wszystkie prawa zastrzeżone.</span>
          <span>Warszawa smakuje lepiej razem.</span>
        </div>
      </div>
    </footer>
  );
}
