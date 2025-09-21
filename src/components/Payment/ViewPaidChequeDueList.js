import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardDueService from "../OtherService/CreditCardDueService";
import { Form } from 'react-bootstrap';


import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


const ViewPaidChequeDueList = () => {


    useEffect(() => {
        fetchOrderTransactionList();
        fetchCreditCardDetail();
    }, []);

    const [orderTransactionList, setOrderTransactionList] = useState([]);

    const [creditCardDue, setCreditCardDue] = useState({
        id: 0,
        account_number: 0,
        payment_term: '',
        account_name: 0,
        account_description: '',
        due_date: '',
        bank_name: '',
        amount: 0,
        interest_amount: 0,
        payment_due_date: '',
        status: 0,
        date: ''
    });



    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });




    const fetchOrderTransactionList = (id) => {
        CreditCardDueService.fetchChequePaidList(3)
            .then(response => {
                setOrderTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const fetchCreditCardDetail = (id) => {
        CreditCardDueService.fetchPaymentTypeDetail(id)
            .then(response => {
                setCreditCardDue(response.data);
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

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { amount }) => acc + amount, 0));
    }


    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>


            <div style={{ minWidth: 800 }}>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Paid Amount: </Form.Label>
                    <Form.Control type="text" value={totalSum(orderTransactionList)} />
                </Form.Group>

            </div>
            <br></br>

            <br></br>
            <legend align="center" style={{ fontWeight: 'bold' }} > Paid Cheque  </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Due Date</th>
                        <th>Invoice Number</th>
                        <th>Supplier</th>
                        <th>Bank</th>
                        <th>Details</th>
                        <th>Account Number</th>
                        <th>Due Amount</th>
                        <th>Paid Amount</th>
                        <th>Interest / Penalty</th>
                        <th>Payment Status</th>
                        <th>Action</th>
                        <th></th>
                        <th></th>


                    </tr>
                </thead>
                <tbody>

                    {
                        orderTransactionList.map((orderTransaction, index) => (
                            <tr key={orderTransaction.id} >
                                <td>{orderTransaction.id}</td>
                                <td>{formatStatementDate(orderTransaction.due_date)}</td>
                                <td>{orderTransaction.invoice_number}</td>
                                <td>{orderTransaction.supplier_name}</td>
                                <td>{orderTransaction.bank_name}</td>
                                <td>{orderTransaction.account_name}</td>
                                <td>{orderTransaction.account_number}</td>
                                <td>{numberFormat(orderTransaction.amount)}</td>
                                <td>{numberFormat(orderTransaction.amount_paid)}</td>
                                <td>{orderTransaction.interest_amount}</td>
                                <td>{orderTransaction.status === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>

                                {orderTransaction.status != 1 &&
                                    <td>
                                        <Link variant="primary" to={"/updateCreditCardDue/" + orderTransaction.id}   >
                                            <Button variant="warning" >
                                                Update
                                            </Button>
                                        </Link>
                                    </td>
                                }

                                <td>
                                    <Link variant="primary" to={"/viewOrder/" + orderTransaction.transaction_id}   >
                                        <Button variant="primary" >
                                            Transaction
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    {orderTransaction.amount_paid != 0 &&
                                        <Link variant="primary" to={"/payCreditCardHistory/" + orderTransaction.id}   >
                                            <Button variant="secondary" >
                                                Payment History
                                            </Button>
                                        </Link>
                                    }
                                </td>



                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

        </div >
    )
}

export default ViewPaidChequeDueList
