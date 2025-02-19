
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LoanTransactionService from "../OtherService/LoanTransactionService";
import LoanService from "../OtherService/LoanService";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import PaymentIcon from '@mui/icons-material/Payment';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import UpdateIcon from '@mui/icons-material/Update';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography'

const UpcomingLoanList = () => {


    useEffect(() => {
        fetchCreditCardPaymentList(2);
    }, []);

    const [paymentTermList, setPaymentTermList] = useState({
        data: [],
        details: {}
    });

    const [installment, setInstallment] = useState({
        number_of_months: 0,
        total_interest: 0,
        interest: 0,
        interest_monthly: 0,
        amount: 0,
        amount_monthly: 0,
        status: 0,
        new_amount: 0,
        borrower: '',
        details: '',
        bank_id: 0,
        payment_type_po_id: 0,
        start_date: '',
        created_at: '',
        updated_at: ''
    });

    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const deleteOrderTransaction = (deleteId, e) => {
        setSubmitLoading(true);
        console.log("test", deleteId);
        LoanTransactionService.delete(deleteId)
            .then(response => {
                setSubmitLoading(false);
                setOpen(false);
                setDeleteOpenModal(false);
                fetchCreditCardPaymentList(2);
                window.scrollTo(0, 0);

                // window.location.reload();
            })
            .catch(e => {
                console.log('error', e);
            });
    }


    const fetchCreditCardPaymentList = (id) => {
        LoanService.getAll(2)
            .then(response => {
                setPaymentTermList(response.data);
                console.log('log', response.data)
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const openPayment = (installmentId, e) => {
        console.log('e', installmentId);
        fetchInstallmentPaymentById(installmentId);
        setDeleteOpenModal(true);
    }

    const fetchInstallmentPaymentById = async (installmentId) => {
        await LoanTransactionService.get(installmentId)
            .then(response => {
                console.log('get', response.data);
                setInstallment(response.data);
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
            <br></br>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Due Date</th>
                        <th>Bank</th>
                        <th>Details</th>
                        <th>Amount Due</th>
                        <th>Amount Paid</th>
                        <th>Penalty</th>
                        <th>Payment Status</th>
                        <th>Action</th>

                    </tr>
                </thead>
                <tbody>

                    {
                        paymentTermList.data.map((paymentTerm, index) => (
                            <tr key={paymentTerm.id}  >
                                <td >{paymentTerm.id}</td>
                                <td >{paymentTerm.due_date}</td>
                                <td >{paymentTerm.amount_due}</td>
                                <td >{paymentTerm.amount}</td>
                                <td >{paymentTerm.penalty}</td>
                                <td >{paymentTerm.status == 1 ? <><CheckIcon style={{ color: 'green', }} /></> : <><CloseIcon style={{ color: 'red', }} /></>}</td>
                                <td>
                                    <Link variant="primary" to={"/installmentDetails/" + paymentTerm.loan_transaction_id}   >
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

export default UpcomingLoanList
