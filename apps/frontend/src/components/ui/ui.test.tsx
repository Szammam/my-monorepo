import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Button } from './Button';
import { TextField } from './TextField';

describe('UI primitives', () => {
  it('disables Button and displays "Proszę czekać…" when loading is true', () => {
    render(
      <Button variant="primary" loading>
        Wyślij
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Proszę czekać…' });
    expect(button).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Wyślij' })).not.toBeInTheDocument();
  });

  it('shows error message and sets aria-invalid on TextField when error is provided', () => {
    function Wrapper() {
      const [val, setVal] = useState('');
      return (
        <TextField
          label="Adres e-mail"
          name="email"
          type="email"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          error="Podaj poprawny adres e-mail."
          required
        />
      );
    }

    render(<Wrapper />);

    const input = screen.getByLabelText(/Adres e-mail/i);
    const errorMessage = screen.getByText('Podaj poprawny adres e-mail.');

    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', errorMessage.id);
  });
});
