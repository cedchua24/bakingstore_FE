import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
const SupplierTransactionList = (props) => {

    const orderTransactionList = props.orderTransactionList;
    const deleteOrderTransaction = props.deleteOrderTransaction;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Supplier Name</th>
                        <th>With Tax</th>
                        <th>Total Amount</th>
                        <th>Date</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        orderTransactionList.map((orderTransaction, index) => (
                            <tr key={orderTransaction.id} >
                                <td>{orderTransaction.id}</td>
                                <td>{orderTransaction.supplier_name}</td>
                                <td>{orderTransaction.withTax === 1 ? <CheckIcon /> : <CloseIcon />}</td>
                                <td>{orderTransaction.total_transaction_price}</td>
                                <td>{orderTransaction.order_date}</td>
                                <td>
                                    <Link variant="primary" to={"/addProductOrderSupplierTransaction/" + orderTransaction.id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/editOrderSupplierTransaction/" + orderTransaction.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteOrderTransaction(orderTransaction.id, e)} >
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

export default SupplierTransactionList
