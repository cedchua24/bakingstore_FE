import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ProductSupplierList = (props) => {

    const productSupplierList = props.productSupplierList;
    const deleteProductSupplier = props.deleteProductSupplier;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Supplier Name</th>
                        <th>Product Name</th>
                        {/* <th>Status</th> */}
                        {/* <th></th>
                        <th></th> */}
                    </tr>
                </thead>
                <tbody>

                    {
                        productSupplierList.map((productSupplier, index) => (
                            <tr key={productSupplier.id} >
                                <td>{productSupplier.id == 0 ? '' : productSupplier.id}</td>
                                <td>{productSupplier.supplier_name}</td>
                                <td>{productSupplier.product_name}</td>
                                {/* <td>{productSupplier.status}</td> */}
                                {/* <td>
                                    <Link variant="primary" to={"/editProductSupplier/" + productSupplier.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteProductSupplier(productSupplier.id, e)} >
                                        Delete
                                    </Button>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ProductSupplierList
