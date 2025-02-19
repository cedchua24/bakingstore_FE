import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button, Form, Alert } from 'react-bootstrap';

import CreditCardInstallmentDtailsService from "../OtherService/CreditCardInstallmentDtailsService";
import CreditCardDueService from "../OtherService/CreditCardDueService";
import CreditCardPayService from "../OtherService/CreditCardPayService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import FormControl from '@mui/material/FormControl';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import PaymentIcon from '@mui/icons-material/Payment';
import Tooltip from '@mui/material/Tooltip';

import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const PromoInstallment = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchCreditCardDue(id);
        fetchCreditCardDetail(id);
        fetchCreditCardInstallmentDetail(id);
        fetchPaymentTerm();
    }, []);

    const [formErrors, setFormErrors] = useState({});
    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [paymentHistoryList, setPaymentHistoryList] = useState([]);
    const [creditCardDueDetails, setCreditCardDueDetails] = useState({
        id: 0,
        payment_term_id: 0,
        account_number: 0,
        account_name: 0,
        account_description: '',
        payment_term: '',
        due_date: '',
        bank_name: '',
        amount: 0,
        interest_amount: 0,
        payment_due_date: '',
        status: 0,
        date: ''
    });


    const [creditCardDue, setCreditCardDue] = useState({
        id: 0,
        payment_term_id: 0,
        payment_type_po_id: 0,
        constant_amount: 0,
        credit_card_due_id: id,
        number_of_months: 0,
        total_interest: 0,
        interest: 0,
        interest_monthly: 0,
        amount: 0,
        start_date: '',
        status: 0,
        date: ''
    });

    const [installmentDetails, setInstallmentDetails] = useState({
        id: 0,
        credit_card_due_id: 0,
        number_of_months: 0,
        total_interest: 0,
        interest_amount: id,
        interest_monthly: 0,
        amount: 0,
        start_date: '',
        status: 0,
        start_date: ''
    });

    const [message, setMessage] = useState(false);
    const [deleteOpenModal, setDeleteOpenModal] = React.useState(false);
    const [deleteId, setDeleteId] = useState(0)
    const [submitLoading, setSubmitLoading] = useState(false);


    const onChangecreditCardDue = (e) => {
        setCreditCardDue({ ...creditCardDue, [e.target.name]: e.target.value });
    }

    const handlePaymentTermChange = (e, value) => {
        e.persist();
        console.log(value)

        setCreditCardDue({
            ...creditCardDue,
            payment_term_id: value.id,

        });

        if (value.id == 1) {
            setCreditCardDue({
                ...creditCardDue,
                payment_type_po_id: 1,
            });
        }
        fetchPaymentTypePo(value.id);
    }

    const handlePaymentTypeChange = (e, value) => {
        e.persist();
        console.log('handlePaymentTypeChange', value)
        setCreditCardDue({
            ...creditCardDue,
            payment_type_po_id: value.id,
        });
    }

    const onChangeInput = (e) => {
        setCreditCardDue({ ...creditCardDue, [e.target.name]: e.target.value });
        console.log('creditCardDue', creditCardDue);
    }

    const onchangeInterest = (e) => {
        console.log('number_of_months', e.target.value)
        setCreditCardDue({
            ...creditCardDue,
            credit_card_due_id: id,
            total_interest: e.target.value - creditCardDue.constant_amount,
            interest_amount: e.target.value,
            interest_monthly: e.target.value / creditCardDue.number_of_months
        });
    }

    const fetchPaymentTypePo = ($id) => {
        PaymentTypePoService.findByCategory($id)
            .then(response => {
                setPaymentTypePoList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchPaymentTerm = () => {
        PaymentTermService.fetchCashAndOnline()
            .then(response => {
                setPaymentTermList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    const savecreditCardDue = () => {
        CreditCardInstallmentDtailsService.create(creditCardDue)
            .then(response => {
                // fetchCreditCardDue(id);
                // fetchCreditCardDetail(id);
                // fetchPaymentHistory(id);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchPaymentHistory = (installmentId) => {
        CreditCardPayService.fetchCreditCardDueByInstallment(installmentId)
            .then(response => {
                setPaymentHistoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }





    const fetchCreditCardDue = (id) => {
        CreditCardDueService.get(id)
            .then(response => {
                setCreditCardDue(response.data);
                setCreditCardDue({
                    id: response.data.id,
                    credit_card_due_id: response.data.credit_card_due_id,
                    payment_term_id: response.data.payment_term_id,
                    payment_type_po_id: response.data.payment_type_po_id,
                    min_amount: response.data.min_amount,
                    amount: response.data.amount - response.data.amount_paid,
                    // amount_paid: response.data.amount_paid,
                    // interest_amount: response.data.interest_amount,
                    // is_installment: response.data.is_installment,
                    start_date: response.data.due_date,
                    status: response.data.status,
                    constant_amount: response.data.amount - response.data.amount_paid,
                });
            })

            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCreditCardDetail = (id) => {
        CreditCardDueService.fetchCreditCardDetail(id)
            .then(response => {
                setCreditCardDueDetails(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCreditCardInstallmentDetail = (id) => {
        CreditCardInstallmentDtailsService.fetchCreditCardInstallmentDetail(id)
            .then(response => {
                setInstallmentDetails(response.data)
                fetchPaymentHistory(response.data.id)
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const openDelete = (id) => {
        console.log('delete', id);
        setDeleteId(id)
        setDeleteOpenModal(true);
    }

    const handleDeleteCloseModal = () => {
        setDeleteOpenModal(false);
    };

    const deletepaymentHistory = (deleteId, e) => {
        setSubmitLoading(true);
        CreditCardPayService.delete(deleteId)
            .then(response => {
                // setValidator({
                //     severity: 'success',
                //     message: 'Deleted Successfully',
                //     isShow: true,
                // });

                // fetchCreditCardDue(id);
                fetchCreditCardDue(id);
                fetchCreditCardDetail(id);
                fetchPaymentHistory(id);
                fetchPaymentTerm();

                setSubmitLoading(false);
                setDeleteOpenModal(false);
            })
            .catch(e => {
                setSubmitLoading(false);
                setDeleteOpenModal(false);
                console.log('error', e);
            });
    }



    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');



    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Updated!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }
            <TableContainer component={Paper}>
                <legend>Account Details</legend>
                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                    <TableBody>
                        <TableRow >
                            <TableCell style={{ fontWeight: 'bold' }}>Type</TableCell>
                            <TableCell align="right">{creditCardDueDetails.payment_term}</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Bank</TableCell>
                            <TableCell align="right">{creditCardDueDetails.bank_name}</TableCell>


                            <TableCell style={{ fontWeight: 'bold' }}>Account Name:</TableCell>
                            <TableCell align="right">{creditCardDueDetails.account_name}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Details:</TableCell>
                            <TableCell align="right">{creditCardDueDetails.account_description}</TableCell>

                            <TableCell style={{ fontWeight: 'bold' }}>Account Number:</TableCell>
                            <TableCell align="right">{creditCardDueDetails.account_number}</TableCell>


                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br></br>
            {creditCardDueDetails.payment_term_id == 4 ? (<>
                <TableContainer component={Paper}>
                    <legend>Payment Details</legend>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableBody>
                            <TableRow >
                                <TableCell style={{ fontWeight: 'bold' }}>Due Date</TableCell>
                                <TableCell align="right">{creditCardDueDetails.payment_due_date}</TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}>Due Amount:</TableCell>
                                <TableCell align="right">{creditCardDue.constant_amount}</TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}>Minimum Amount:</TableCell>
                                <TableCell align="right">{creditCardDueDetails.min_amount}</TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}>Penalty:</TableCell>
                                <TableCell align="right">{creditCardDueDetails.interest_amount}</TableCell>


                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>) : <>
            </>}
            <br></br>
            {installmentDetails.length != 0 ? (<>
                <TableContainer component={Paper}>
                    <legend>Installment Details</legend>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableBody>
                            <TableRow >
                                <TableCell style={{ fontWeight: 'bold' }}>Number of Months </TableCell>
                                <TableCell align="right">{installmentDetails.number_of_months}</TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}>Amount Loan</TableCell>
                                <TableCell align="right">{installmentDetails.amount}</TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}>Amount With Interest:</TableCell>
                                <TableCell align="right">{installmentDetails.interest_amount}</TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}>Interest:</TableCell>
                                <TableCell align="right">{installmentDetails.total_interest}</TableCell>

                                <TableCell style={{ fontWeight: 'bold' }}>Monthly Payment:</TableCell>
                                <TableCell align="right">{installmentDetails.interest_monthly}</TableCell>


                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </>) : <>
            </>}
            <br></br>
            {installmentDetails.length == 0 &&
                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                // onSubmit={saveOrderSupplier}
                >
                    <Form>


                        {creditCardDueDetails.payment_term_id == 4 &&
                            <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Minimum Amount</Form.Label>
                                    <Form.Control type="text" value={creditCardDue.min_amount} name="min_amount" onChange={onChangecreditCardDue} disabled />
                                </Form.Group>
                            </FormControl>

                        }
                        <br></br>
                        <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Due Date</Form.Label>
                                <Form.Control type="date" value={creditCardDue.due_date} name="details" onChange={onChangecreditCardDue} disabled />
                            </Form.Group>
                        </FormControl>
                        <br></br>
                        <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Due Amount</Form.Label>
                                <Form.Control type="text" value={creditCardDue.constant_amount} name="amount" onChange={onChangecreditCardDue} disabled />
                            </Form.Group>
                        </FormControl>

                        <br></br>


                        {formErrors.number_of_months && <p style={{ color: "red" }}>{formErrors.number_of_months}</p>}
                        <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Number of Months *</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Number of Months"
                                name="number_of_months"
                                onChange={onChangeInput}
                            >
                                {Array(37).fill(1).map((el, i) =>
                                    <MenuItem value={i}>{i}</MenuItem>
                                )}

                            </Select>
                        </FormControl>

                        <br></br>
                        <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                            <Form.Group className="mb-3" controlId="formBasicEmail" >
                                {formErrors.interest_amount && <p style={{ color: "red" }}>{formErrors.interest_amount}</p>}
                                <Form.Label>Enter Amount with interest*</Form.Label>
                                <Form.Control type="number" name="interest_amount" onChange={onchangeInterest} />
                            </Form.Group>
                        </FormControl>
                        <br></br>

                        <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Interest</Form.Label>
                                <Form.Control type="number" value={creditCardDue.total_interest} disabled />
                            </Form.Group>
                        </FormControl>
                        <br></br>

                        <FormControl sx={{ m: 0, minWidth: 230, minHeight: 70 }}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Monthly Payment</Form.Label>
                                <Form.Control
                                    type='number'
                                    id="filled-required"
                                    label="amount"
                                    variant="filled"
                                    name='interest_monthly'
                                    disabled
                                    value={creditCardDue.interest_monthly} />
                            </Form.Group>
                        </FormControl>

                        <br></br>

                        <Button variant="primary" onClick={savecreditCardDue}>
                            Submit
                        </Button>
                    </Form>
                </Box>
            }
            <br></br>
            {
                paymentHistoryList.length != 0 &&
                <>
                    <legend>Credit Card Due</legend>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="table-secondary">
                                <th>ID</th>
                                <th> Min Amount</th>
                                <th> Amount</th>
                                <th> Amount Paid</th>
                                <th> Interest</th>
                                <th> Due Date</th>
                                <th>Payment Status</th>



                            </tr>
                        </thead>
                        <tbody>

                            {
                                paymentHistoryList.map((paymentHistory, index) => (
                                    <tr key={paymentHistory.id} >
                                        <td>{paymentHistory.id}</td>
                                        <td>{numberFormat(paymentHistory.min_amount)} </td>
                                        <td>{numberFormat(paymentHistory.amount)} </td>
                                        <td>{paymentHistory.amount_paid}</td>
                                        <td>{paymentHistory.interest_amount}</td>
                                        <td>{paymentHistory.due_date}</td>
                                        <td>{paymentHistory.status == 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>




                                    </tr>
                                )
                                )
                            }
                        </tbody>
                    </table>
                    <br></br>
                </>
            }

            <Dialog
                open={deleteOpenModal}
                onClose={handleDeleteCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >

                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to Delete?"}
                </DialogTitle>
                {submitLoading &&
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </div>
                }
                <DialogActions>
                    <Button onClick={handleDeleteCloseModal}>Cancel</Button>
                    <Button onClick={(e) => deletepaymentHistory(deleteId, e)} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default PromoInstallment
