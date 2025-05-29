import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import PaymentTermService from "../OtherService/PaymentTermService";

const PaymentTermTransaction = (props) => {

    const [paymentTermList, setPaymentTermList] = useState([]);

    useEffect(() => {
        fetchPaymentTermList();
    }, []);



    const fetchPaymentTermList = () => {
        PaymentTermService.getAll()
            .then(response => {
                setPaymentTermList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div>
            <legend align="center" style={{ fontWeight: 'bold' }} > Payment Term </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Type</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        paymentTermList.map((paymentTerm, index) => (
                            <tr key={paymentTerm.id}  >
                                <td >{paymentTerm.id}</td>
                                <td>{paymentTerm.payment_term}</td>
                                <td>
                                    <Link variant="primary" to={"/viewPaymentTermTransaction/" + paymentTerm.id}   >
                                        <Button variant="primary" >
                                            View
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

export default PaymentTermTransaction
