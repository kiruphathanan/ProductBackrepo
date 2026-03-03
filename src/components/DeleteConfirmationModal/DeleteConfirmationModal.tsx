import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    productName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmationModal({ productName, onClose, onConfirm }: DeleteConfirmationModalProps) {
    return (
        <div className="drawer-backdrop" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '420px', width: '100%', margin: '24px', animation: 'slideUp var(--transition-smooth)' }}>

                <div style={{ padding: '24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ padding: '12px', background: 'var(--status-low-bg)', color: 'var(--status-low-text)', borderRadius: 'var(--radius-full)' }}>
                            <AlertTriangle size={24} />
                        </div>
                        <button className="btn-icon" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Delete Product</h3>

                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{productName}</strong>?
                        This action cannot be undone and will permanently remove the product from your inventory.
                    </p>
                </div>

                <div style={{ padding: '24px 32px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button className="btn btn-outline" style={{ color: 'var(--text-muted)' }} onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-danger-gradient" onClick={onConfirm}>
                        Delete Product
                    </button>
                </div>

            </div>
        </div>
    );
}
