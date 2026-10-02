import React from 'react';
import ProductServiceService from './ProductService.service';
import ProductManagementList from './ProductManagementList';

const ProductExpirationList = () => (
    <ProductManagementList
        eyebrow="Shelf-life monitoring"
        title="Product Expirations"
        description="Monitor product expiration dates and quickly identify items needing attention."
        fetchProducts={filters => ProductServiceService.fetchProductListExpiration(filters)}
        mode="expiration"
        serverFilters
    />
);

export default ProductExpirationList;
