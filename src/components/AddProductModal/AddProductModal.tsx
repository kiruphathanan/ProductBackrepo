import { useState, useEffect } from 'react';
import { X, Save, Minus, Plus } from 'lucide-react';
import type { Product } from '../../types';
import './AddProductModal.css';

interface AddProductModalProps {
    isOpen: boolean;
    initialData?: Product;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id'>) => void;
}

export default function AddProductModal({ isOpen, initialData, onClose, onSave }: AddProductModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState<number>(0);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
                setPrice(initialData.price.toString());
                setStock(initialData.stock);
            } else {
                setName('');
                setPrice('');
                setStock(0);
            }
            setIsClosing(false);
        }
    }, [initialData, isOpen]);

    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 300); // Wait for transition
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || stock < 0) return;

        onSave({
            name,
            price: parseFloat(price),
            stock,
        });
        handleClose();
    };

    const updateStock = (amount: number) => {
        setStock(prev => Math.max(0, prev + amount));
    };

    return (
        <>
            <div className={`drawer-backdrop ${isClosing ? 'closing' : ''}`} onClick={handleClose}></div>
            <div className={`drawer-panel ${isClosing ? 'closing' : ''}`}>
                <div className="drawer-header">
                    <h3>{initialData ? 'Edit Product' : 'Add New Product'}</h3>
                    <button className="btn-icon" onClick={handleClose} type="button">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="drawer-body-form">
                    <div className="drawer-body">

                        <div className="form-group floating-label-group">
                            <input
                                type="text"
                                id="name"
                                className="floating-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder=" "
                            />
                            <label htmlFor="name" className="floating-label">Product Name</label>
                        </div>

                        <div className="form-group floating-label-group">
                            <div className="input-prefix">₹</div>
                            <input
                                type="number"
                                id="price"
                                step="0.01"
                                min="0"
                                className="floating-input with-prefix"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                placeholder=" "
                            />
                            <label htmlFor="price" className="floating-label with-prefix">Price</label>
                        </div>

                        <div className="form-group">
                            <label className="standard-label">Stock Units</label>
                            <div className="stepper-input">
                                <button type="button" className="btn-stepper" onClick={() => updateStock(-1)}>
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    className="stepper-value"
                                    value={stock}
                                    onChange={(e) => setStock(Math.max(0, parseInt(e.target.value) || 0))}
                                    min="0"
                                    required
                                />
                                <button type="button" className="btn-stepper" onClick={() => updateStock(1)}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="drawer-footer">
                        <button type="button" className="btn btn-outline" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-gradient">
                            <Save size={18} /> {initialData ? 'Save Changes' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
