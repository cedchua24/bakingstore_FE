import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const SupplierList = (props) => {

    const supplierList = props.supplierList;
    const deleteSupplier = props.deleteSupplier;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Supplier Name</th>
                        <th>Address Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        supplierList.map((supplier, index) => (
                            <tr key={supplier.id} >
                                <td>{supplier.id}</td>
                                <td>{supplier.supplier_name}</td>
                                <td>{supplier.address}</td>
                                <td>{supplier.contact_number}</td>
                                <td>{supplier.email}</td>
                                <td>
                                    <Link variant="primary" to={"/editSupplier/" + supplier.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteSupplier(supplier.id, e)} >
                                        Delete
                                    </Button>
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

export default SupplierList
