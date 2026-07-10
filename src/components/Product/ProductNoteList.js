import React from 'react';
import ProductServiceService from './ProductService.service';
import ProductManagementList from './ProductManagementList';

const ProductNoteList = () => (
    <ProductManagementList
        eyebrow="Product management"
        title="Product Notes"
        description="Review inventory notes and keep product information up to date."
        fetchProducts={categoryId => ProductServiceService.fetchProductListNote(categoryId)}
        mode="notes"
    />
);

export default ProductNoteList;
