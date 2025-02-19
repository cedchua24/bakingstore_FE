
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import PaymentTermService from "../OtherService/PaymentTermService";

const ViewPaymentTermTransaction = () => {

    const { id } = useParams();
    useEffect(() => {
        fetchPaymentTerm(id);
    }, []);

    const [paymentTermList, setPaymentTermList] = useState([]);

    const fetchPaymentTerm = (id) => {
        PaymentTermService.fetchByPaymentTerm(id)
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
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Type</th>
                        <th>Bank name</th>
                        <th>Account Name</th>
                        <th>Description</th>
                        <th>Account Number</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        paymentTermList.map((paymentTerm, index) => (
                            <tr key={paymentTerm.id}  >
                                <td >{paymentTerm.id}</td>
                                <td>{paymentTerm.payment_term}</td>
                                <td>{paymentTerm.bank_name}</td>
                                <td>{paymentTerm.account_name}</td>
                                <td>{paymentTerm.account_description}</td>
                                <td>{paymentTerm.account_number}</td>

                                <td>
                                    <Link variant="primary" to={"/viewBankTransactionList/" + paymentTerm.id}   >
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

export default ViewPaymentTermTransaction
