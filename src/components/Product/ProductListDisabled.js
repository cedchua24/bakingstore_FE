import React from 'react';
import ProductServiceService from './ProductService.service';
import ProductManagementList from './ProductManagementList';

const ProductListDisabled = () => (
    <ProductManagementList
        eyebrow="Product management"
        title="Disabled Products"
        description="Review inactive catalog items and restore or update their information."
        fetchProducts={categoryId => ProductServiceService.fetchProductListDisabled(categoryId)}
        mode="disabled"
    />
);

export default ProductListDisabled;
