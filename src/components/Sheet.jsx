import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Sheet({ open, onClose, title, description, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            {title && <h2 className="sheet-title">{title}</h2>}
            {description && <p className="sheet-desc">{description}</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Закрыть">
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
