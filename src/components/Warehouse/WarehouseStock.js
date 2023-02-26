import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import WarehouseService from "../Warehouse/WarehouseService";

const WarehouseStock = () => {
    const { id } = useParams();

    useEffect(() => {
        fetchWarehouseStock(id);
    }, []);

    const [warehouseStockList, setWarehouseStockList] = useState([]);
    const [warehouseName, setWarehouseName] = useState('');


    const fetchWarehouseStock = async (id) => {
        await WarehouseService.fetchWarehouseStock(id)
            .then(response => {
                setWarehouseName(response.data[0].warehouse_name);
                setWarehouseStockList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    return (
        <div>
            <h1>{warehouseName}</h1>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Category Name</th>
                        <th>Quantity / Weight</th>
                        <th>Stock</th>
                        <th>View Transaction</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        warehouseStockList.map((warehouseStock, index) => (
                            <tr key={warehouseStock.id} >
                                <td>{warehouseStock.id}</td>
                                <td>{warehouseStock.product_name}</td>
                                <td>{warehouseStock.category_name}</td>
                                <td>{warehouseStock.weight}x{warehouseStock.quantity}kg</td>
                                <td>{warehouseStock.branch_stock_transaction}</td>
                                <td>
                                    <Link variant="primary" to={"/showTransaction/" + warehouseStock.id}   >
                                        <Button variant="primary" >
                                            Show
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default WarehouseStock
