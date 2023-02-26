import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const WarehouseList = (props) => {

    const warehouseList = props.warehouseList;
    const deleteWarehouse = props.deleteWarehouse;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Warehouse Name</th>
                        <th>View Stock</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        warehouseList.map((warehouse, index) => (
                            <tr key={warehouse.id} >
                                <td>{warehouse.id}</td>
                                <td>{warehouse.warehouse_name}</td>
                                <td>
                                    <Link variant="primary" to={"/warehouseStock/" + warehouse.id}   >
                                        <Button variant="primary" >
                                            Show
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/editWarehouse/" + warehouse.id}   >
                                        <Button variant="primary" >
                                            Update
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

export default WarehouseList
