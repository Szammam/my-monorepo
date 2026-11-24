import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('renders the Szammam brand link, primary navigation links, and login action', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppHeader />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Szammam' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Start' })).toHaveClass('app-header__link--active');
    expect(screen.getByRole('link', { name: 'Sprzedawcy' })).toHaveAttribute('href', '/vendors');
    expect(screen.getByRole('link', { name: 'Koszyk' })).toHaveAttribute('href', '/cart');
    expect(screen.getByRole('link', { name: 'Zamówienia' })).toHaveAttribute('href', '/orders');
    expect(screen.getByRole('link', { name: 'Profil' })).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('link', { name: 'Zaloguj się' })).toHaveAttribute('href', '/login');
  });
});
