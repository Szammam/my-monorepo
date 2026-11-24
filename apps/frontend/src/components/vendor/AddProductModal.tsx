import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import type { NewProductInput, ProductCategory } from '../../context/AppContext';
import './AddProductModal.css';

export interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitProduct: (product: NewProductInput) => void;
}

interface ModalErrors {
  name?: string;
  description?: string;
  netPrice?: string;
  grossPrice?: string;
  stock?: string;
  availableFrom?: string;
  availableTo?: string;
  expiryDate?: string;
  file?: string;
}

const CATEGORIES: ProductCategory[] = ['Trendujące', 'Pizza', 'Azjatyckie'];

export function AddProductModal({ open, onClose, onSubmitProduct }: AddProductModalProps) {
  const titleId = useId();
  const descFieldId = useId();
  const categoryFieldId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [netPrice, setNetPrice] = useState('');
  const [grossPrice, setGrossPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Trendujące');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [imageName, setImageName] = useState('');
  const [errors, setErrors] = useState<ModalErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function resetForm() {
    setName('');
    setDescription('');
    setNetPrice('');
    setGrossPrice('');
    setStock('');
    setCategory('Trendujące');
    setAvailableFrom('');
    setAvailableTo('');
    setExpiryDate('');
    setImageName('');
    setErrors({});
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setImageName('');
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (!file.type.startsWith('image/') || file.size > maxBytes) {
      setErrors((prev) => ({
        ...prev,
        file: 'Wybierz obraz (JPG/PNG/WEBP) o rozmiarze do 5 MB.',
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, file: undefined }));
    setImageName(file.name);
  }

  function validate(): ModalErrors {
    const next: ModalErrors = {};
    const parsedNet = Number(netPrice.replace(',', '.'));
    const parsedGross = Number(grossPrice.replace(',', '.'));
    const parsedStock = Number(stock);

    if (!name.trim()) {
      next.name = 'Wypełnij to pole.';
    }
    if (!description.trim()) {
      next.description = 'Wypełnij to pole.';
    }
    if (!netPrice.trim() || Number.isNaN(parsedNet) || parsedNet <= 0) {
      next.netPrice = 'Wypełnij to pole.';
    }
    if (!grossPrice.trim() || Number.isNaN(parsedGross) || parsedGross <= 0) {
      next.grossPrice = 'Wypełnij to pole.';
    }
    if (!stock.trim() || Number.isNaN(parsedStock) || parsedStock < 0) {
      next.stock = 'Wypełnij to pole.';
    }
    if (!availableFrom.trim()) {
      next.availableFrom = 'Wypełnij to pole.';
    }
    if (!availableTo.trim()) {
      next.availableTo = 'Wypełnij to pole.';
    }
    if (!expiryDate.trim()) {
      next.expiryDate = 'Wypełnij to pole.';
    }

    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const parsedNet = Number(netPrice.replace(',', '.'));
    const parsedGross = Number(grossPrice.replace(',', '.'));
    const parsedStock = Number(stock);

    onSubmitProduct({
      name,
      description,
      netPrice: parsedNet,
      grossPrice: parsedGross,
      stock: parsedStock,
      category,
      availableFrom,
      availableTo,
      expiryDate,
      imageName: imageName || undefined,
    });

    setIsSubmitting(false);
    resetForm();
    onClose();
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-card">
        <div className="modal-card__header">
          <div>
            <p className="modal-card__eyebrow">NOWA POZYCJA</p>
            <h2 id={titleId} className="modal-card__title">
              Dodaj do magazynu
            </h2>
          </div>

          <button
            type="button"
            aria-label="Zamknij okno"
            onClick={onClose}
            className="modal-card__close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <TextField
            label="NAZWA PRODUKTU"
            name="productName"
            type="text"
            placeholder="np. Miso ramen"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            error={errors.name}
            required
          />

          <div className="modal-field">
            <label htmlFor={descFieldId} className="modal-field__label">
              OPIS
              <span aria-hidden="true" className="modal-field__required">
                *
              </span>
            </label>
            <textarea
              id={descFieldId}
              name="description"
              rows={3}
              placeholder="Składniki, gramatura i najważniejsze informacje..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              aria-invalid={errors.description ? 'true' : undefined}
              className={`modal-field__textarea ${
                errors.description ? 'modal-field__control--error' : ''
              }`}
            />
            {errors.description && (
              <p role="alert" className="modal-field__error">
                {errors.description}
              </p>
            )}
          </div>

          <div className="modal-grid-2">
            <TextField
              label="CENA NETTO"
              name="netPrice"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={netPrice}
              onChange={(e) => {
                setNetPrice(e.target.value);
                if (errors.netPrice) setErrors((prev) => ({ ...prev, netPrice: undefined }));
              }}
              error={errors.netPrice}
              required
            />

            <TextField
              label="CENA BRUTTO"
              name="grossPrice"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={grossPrice}
              onChange={(e) => {
                setGrossPrice(e.target.value);
                if (errors.grossPrice) setErrors((prev) => ({ ...prev, grossPrice: undefined }));
              }}
              error={errors.grossPrice}
              required
            />
          </div>

          <div className="modal-grid-2">
            <TextField
              label="STAN MAGAZYNOWY"
              name="stock"
              type="number"
              min={0}
              placeholder="0"
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                if (errors.stock) setErrors((prev) => ({ ...prev, stock: undefined }));
              }}
              error={errors.stock}
              required
            />

            <div className="modal-field">
              <label htmlFor={categoryFieldId} className="modal-field__label">
                KATEGORIA
              </label>
              <select
                id={categoryFieldId}
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="modal-field__select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-grid-2">
            <TextField
              label="DOSTĘPNY OD"
              name="availableFrom"
              type="date"
              placeholder="dd.mm.rrrr"
              value={availableFrom}
              onChange={(e) => {
                setAvailableFrom(e.target.value);
                if (errors.availableFrom) {
                  setErrors((prev) => ({ ...prev, availableFrom: undefined }));
                }
              }}
              error={errors.availableFrom}
              required
            />

            <TextField
              label="DOSTĘPNY DO"
              name="availableTo"
              type="date"
              placeholder="dd.mm.rrrr"
              value={availableTo}
              onChange={(e) => {
                setAvailableTo(e.target.value);
                if (errors.availableTo) {
                  setErrors((prev) => ({ ...prev, availableTo: undefined }));
                }
              }}
              error={errors.availableTo}
              required
            />
          </div>

          <div className="modal-grid-2">
            <TextField
              label="DATA WAŻNOŚCI"
              name="expiryDate"
              type="date"
              placeholder="dd.mm.rrrr"
              value={expiryDate}
              onChange={(e) => {
                setExpiryDate(e.target.value);
                if (errors.expiryDate) {
                  setErrors((prev) => ({ ...prev, expiryDate: undefined }));
                }
              }}
              error={errors.expiryDate}
              required
            />

            <div className="modal-field">
              <span className="modal-field__label">ZDJĘCIE PRODUKTU</span>
              <div className="modal-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="modal-upload__input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="modal-upload__btn"
                >
                  Wybierz plik
                </button>
                <span className="modal-upload__status">{imageName || 'Nie wybrano pliku'}</span>
              </div>
              {errors.file && (
                <p role="alert" className="modal-field__error">
                  {errors.file}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="modal-form__submit"
          >
            Dodaj produkt do magazynu
          </Button>
        </form>
      </div>
    </div>
  );
}
