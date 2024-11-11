import React from 'react'
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const PoPaymentTypeList = (props) => {

    const paymentTypeList = props.paymentTypeList;
    const deletePaymentType = props.deletePaymentType;

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Type</th>
                        <th>Bank Name</th>
                        <th>Account Number</th>
                        <th>Enable</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        paymentTypeList.map((paymentType, index) => (
                            <tr key={paymentType.id}  >
                                <td >{paymentType.id}</td>
                                <td>{paymentType.payment_term}</td>
                                <td>{paymentType.payment_type}</td>
                                <td>{paymentType.payment_type_description}</td>
                                <td>{paymentType.status === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>
                                    <Link variant="primary" to={"/poEditPaymentType/" + paymentType.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deletePaymentType(paymentType.id, e)} >
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

export default PoPaymentTypeList
