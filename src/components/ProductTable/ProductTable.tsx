import { Edit2, Trash2, Package } from 'lucide-react';
import type { Product } from '../../types';
import './ProductTable.css';

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {

    const getStockStatus = (stock: number) => {
        if (stock > 20) return { label: 'High', class: 'status-high' };
        if (stock > 5) return { label: 'Medium', class: 'status-med' };
        return { label: 'Low', class: 'status-low' };
    };

    return (
        <div className="table-wrapper">
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock Level</th>
                        <th>Status</th>
                        <th className="action-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const status = getStockStatus(product.stock);

                        return (
                            <tr key={product.id} className="table-row">
                                <td>
                                    <div className="product-name-cell">
                                        <div className="product-icon-container">
                                            <Package size={16} />
                                        </div>
                                        <div>
                                            <span className="product-name">{product.name}</span>
                                            <span className="product-id">ID: {product.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="font-numeric">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td>{product.stock} units</td>
                                <td>
                                    <span className={`status-badge ${status.class}`}>
                                        {status.label}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-icon btn-action-edit"
                                            onClick={() => onEdit(product)}
                                            title="Edit Product"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn-icon btn-action-delete"
                                            onClick={() => onDelete(product)}
                                            title="Delete Product"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
