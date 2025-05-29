import React from 'react'
import { Button, Form, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const PoPaymentTypeList = (props) => {

    const paymentTypeList = props.paymentTypeList;
    const deletePaymentType = props.deletePaymentType;

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > Payment Type  Supplier </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Type</th>
                        <th>Account Number</th>
                        <th>Bank Name</th>
                        <th>Account Name</th>
                        <th>Account Description</th>
                        <th>Due Date</th>
                        <th>Credit Limit</th>
                        <th>Stement Date</th>
                        <th>Total Due Balance</th>
                        <th>Enable</th>
                        <th></th>
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
                                <td>{paymentType.account_number}</td>
                                <td>{paymentType.bank_name}</td>
                                <td>{paymentType.account_name}</td>
                                <td>{paymentType.account_description}</td>
                                {paymentType.payment_term_id == 4 ?
                                    <>
                                        <td>{paymentType.due_date}</td>
                                        <td>{numberFormat(paymentType.credit_limit)}</td>
                                        <td>{paymentType.statement_date}</td>
                                        <td>{numberFormat(paymentType.total_balance_due)}</td>
                                    </>
                                    : <>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </>}

                                <td>{paymentType.status === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
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
