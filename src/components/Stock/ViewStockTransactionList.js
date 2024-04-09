import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import ProductServiceService from "../Product/ProductService.service";


const ViewStockTransactionList = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id);
    }, []);

    const [productList, setProductList] = useState([]);

    const fetchProduct = (id) => {
        ProductServiceService.fetchById(id)
            .then(response => {
                setProductList(response.data);

            })
            .catch(e => {
                console.log("error", e)
            });
    }

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Packaging</th>
                        <th>Restock Type</th>
                        <th>Stock</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        productList.map((product, index) => (
                            <tr key={product.id} >
                                <td>{product.id}</td>
                                <td> {product.product_name}</td>
                                <td> {product.stock_type}</td>
                                <td>{product.pack}</td>
                                <td>{product.stock}</td>
                                <td>{product.updated_at}</td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div >
    )
}

export default ViewStockTransactionList
