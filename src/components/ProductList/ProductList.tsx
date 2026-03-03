import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, PackageOpen } from 'lucide-react';
import type { Product } from '../../types';
import ProductTable from '../ProductTable/ProductTable';
import Pagination from '../Pagination/Pagination';
import AddProductModal from '../AddProductModal/AddProductModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './ProductList.css';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
    { id: '1', name: 'Premium Wireless Headphones', price: 12999.00, stock: 45 },
    { id: '2', name: 'Ergonomic Office Chair', price: 8500.50, stock: 12 },
    { id: '3', name: 'Mechanical Keyboard (Cherry MX)', price: 7490.00, stock: 0 },
    { id: '4', name: '4K Ultra HD Monitor', price: 24900.00, stock: 8 },
    { id: '5', name: 'USB-C Hub Pro', price: 2999.99, stock: 120 },
    { id: '6', name: 'Smart Home Hub', price: 9999.00, stock: 34 },
    { id: '7', name: 'Noise Cancelling Earbuds', price: 15999.00, stock: 56 },
    { id: '8', name: 'Portable SSD 2TB', price: 11999.00, stock: 23 },
    { id: '9', name: 'Wireless Gaming Mouse', price: 4999.00, stock: 15 },
    { id: '10', name: 'Standing Desk Converter', price: 14500.00, stock: 5 },
    { id: '11', name: 'Podcast Microphone', price: 6500.50, stock: 42 },
    { id: '12', name: 'Webcam 1080p', price: 3499.00, stock: 88 },
];

const ITEMS_PER_PAGE = 7;

// Simple Toast Notification Component
const Toast = ({ message, type }: { message: string, type: 'success' | 'error' }) => (
    <div className={`toast ${type}`}>
        {message}
    </div>
);

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [toastMsg, setToastMsg] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [totalProductsCount, setTotalProductsCount] = useState(0);

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToastMsg({ msg, type });
        setTimeout(() => setToastMsg(null), 3000);
    };

    // Real API Fetch
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}?search=${searchTerm}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setProducts(data.products || []);
            setTotalProductsCount(data.totalCount || 0); // Update total count from server
        } catch (err) {
            console.error("Error fetching products:", err);
            showToast('Error connecting to backend or fetching products.', 'error');
            setProducts([]); // Clear products on error
            setTotalProductsCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Debounce the fetching
        const timer = setTimeout(() => {
            fetchProducts();
        }, 400); // 400ms debounce
        return () => clearTimeout(timer);
    }, [searchTerm, currentPage]); // Re-fetch when search term or page changes

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(totalProductsCount / ITEMS_PER_PAGE));
    // currentProducts is just 'products' as pagination is handled by backend
    const currentProducts = products;

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
        try {
            if (productToEdit) {
                // Optimistic UI Update
                setProducts(products.map(p => p.id === productToEdit.id ? { ...productData, id: p.id } : p));

                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';
                const res = await fetch(`${API_URL}/${productToEdit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                showToast('Product updated successfully.', 'success');
            } else {
                // Optimistic Update pseudo-ID until fetch returns
                const tempId = Math.random().toString(36).substr(2, 9);
                setProducts([{ ...productData, id: tempId }, ...products]);

                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const savedDBProduct = await res.json();

                // Reconcile ID
                setProducts(prev => prev.map(p => p.id === tempId ? savedDBProduct : p));
                showToast('Product created successfully.', 'success');
            }
            fetchProducts(); // Re-fetch to ensure data consistency and update total count
        } catch (err) {
            console.error("Error saving product:", err);
            showToast('Error saving product.', 'error');
            fetchProducts(); // Revert back optimistic update by refetching
        }
    };

    const handleDeleteProduct = async () => {
        if (productToDelete) {
            try {
                // Optimistic UI Update
                const targetId = productToDelete.id;
                setProducts(products.filter(p => p.id !== targetId));
                setProductToDelete(null);

                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';
                const res = await fetch(`${API_URL}/${targetId}`, {
                    method: 'DELETE'
                });
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                showToast(`Product deleted.`, 'success');
                fetchProducts(); // Re-fetch to ensure data consistency and update total count
            } catch (err) {
                console.error("Error deleting product:", err);
                showToast('Error deleting product.', 'error');
                fetchProducts(); // Revert optimistic update by refetching
            }
        }
    };

    const SkeletonLoader = () => (
        <div className="skeleton-wrapper">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="skeleton-row">
                    <div className="skeleton-col w-30"></div>
                    <div className="skeleton-col w-20"></div>
                    <div className="skeleton-col w-15"></div>
                    <div className="skeleton-col w-10"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="product-list-container glass-card">
            <div className="product-list-header flex-between">
                <h2>All Products</h2>
                <div className="product-actions">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={16} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button className="btn btn-gradient" onClick={() => { setProductToEdit(null); setIsAddModalOpen(true); }}>
                        <Plus size={18} /> Add Product
                    </button>
                </div>
            </div>

            <div className="product-list-content">
                {isLoading ? (
                    <SkeletonLoader />
                ) : filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <PackageOpen size={48} className="empty-icon text-muted" />
                        <h3>No products found</h3>
                        <p>Try adjusting your search criteria or add a new product.</p>
                    </div>
                ) : (
                    <ProductTable
                        products={currentProducts}
                        onEdit={(p) => { setProductToEdit(p); setIsAddModalOpen(true); }}
                        onDelete={setProductToDelete}
                    />
                )}
            </div>

            {!isLoading && filteredProducts.length > 0 && (
                <div className="product-list-footer">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* Modals & Toasts */}
            <AddProductModal
                isOpen={isAddModalOpen}
                initialData={productToEdit || undefined}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveProduct}
            />

            {productToDelete && (
                <DeleteConfirmationModal
                    productName={productToDelete.name}
                    onClose={() => setProductToDelete(null)}
                    onConfirm={handleDeleteProduct}
                />
            )}

            <div className="toast-container">
                {toastMsg && <Toast message={toastMsg.msg} type={toastMsg.type} />}
            </div>
        </div>
    );
}
