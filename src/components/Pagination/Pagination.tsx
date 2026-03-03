import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                Showing page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
            </div>
            <div className="pagination-controls">
                <button
                    className="btn-icon pagination-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={18} />
                </button>

                <div className="page-numbers">
                    {getPageNumbers().map(page => (
                        <button
                            key={page}
                            className={`page-number ${currentPage === page ? 'active' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className="btn-icon pagination-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
