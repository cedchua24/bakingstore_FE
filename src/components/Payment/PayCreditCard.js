import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Button, Form, Alert } from 'react-bootstrap';
import CreditCardDueService from "../OtherService/CreditCardDueService";
import CreditCardPayService from "../OtherService/CreditCardPayService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const PayCreditCard = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchCreditCardDue(id);
        fetchCreditCardDetail(id);
        fetchPaymentHistory(id);
        fetchPaymentTerm();
    }, []);

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
        min_amount: 0,
        amount: 0,
        amount_paid: 0,
        constant_amount: 0,
        interest_amount: 0,
        is_installment: 0,
        due_date: '',
        status: 0,
        action: 'pay',
        date: ''
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
        CreditCardDueService.saveCreditCardPay(creditCardDue)
            .then(response => {
                fetchCreditCardDue(id);
                fetchCreditCardDetail(id);
                fetchPaymentHistory(id);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchPaymentHistory = (id) => {
        CreditCardPayService.fetchCreditCardPayById(id)
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
                console.log("fetchCreditCardDue", response.data)
                setCreditCardDue({
                    id: response.data.id,
                    payment_term_id: response.data.payment_term_id,
                    payment_type_po_id: response.data.payment_type_po_id,
                    min_amount: response.data.min_amount,
                    amount: response.data.amount,
                    amount_paid: response.data.amount_paid,
                    interest_amount: response.data.interest_amount,
                    is_installment: response.data.is_installment,
                    due_date: response.data.due_date,
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
                {/* <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                        <TableBody>
                            <TableRow >
                                <TableCell style={{ fontWeight: 'bold' }}>Due Amount:</TableCell>
                                <TableCell align="right">{creditCardDue.amount - creditCardDue.amount_paid}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer> */}
            </>}
            <br></br>
            {creditCardDue.status == 0 &&
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
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Minimum Amount</Form.Label>
                                <Form.Control type="text" value={creditCardDue.min_amount} name="min_amount" onChange={onChangecreditCardDue} disabled />
                            </Form.Group>
                        }

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control type="date" value={creditCardDue.due_date} name="details" onChange={onChangecreditCardDue} disabled />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Due Amount</Form.Label>
                            <Form.Control type="text" value={creditCardDue.constant_amount} name="amount" onChange={onChangecreditCardDue} disabled />
                        </Form.Group>

                        {/* {formErrors.payment_term_id && <p style={{ color: "red" }}>{formErrors.payment_term_id}</p>} */}


                        {creditCardDueDetails.payment_term_id != 3 ? (<>
                            <FormControl variant="standard" >
                                <Autocomplete
                                    // {...defaultProps}
                                    options={paymentTermList}
                                    className="mb-3"
                                    id="disable-close-on-select"
                                    onChange={handlePaymentTermChange}
                                    getOptionLabel={(paymentTermList) => paymentTermList.payment_term}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose Payment Term" variant="standard" />
                                    )}
                                />
                            </FormControl>
                            <Form.Control type="text" value={creditCardDue.due_date} name="details" onChange={onChangecreditCardDue} disabled />
                        </>) : <>
                            {/* <FormControl variant="standard" >
                                <Autocomplete
                                    // {...defaultProps}
                                    options={paymentTermList}
                                    className="mb-3"
                                    id="disable-close-on-select"
                                    onChange={handlePaymentTermChange}
                                    getOptionLabel={(paymentTermList) => paymentTermList.payment_term}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose Payment Term" variant="standard" />
                                    )}
                                />
                            </FormControl> */}
                        </>}
                        <br></br>
                        {creditCardDue.payment_term_id == 2 ? (<>
                            {/* {formErrors.payment_type_po_id && <p style={{ color: "red" }}>{formErrors.payment_type_po_id}</p>} */}
                            <Box
                                sx={{
                                    '& .MuiTextField-root': { m: 1, width: '65ch' },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <FormControl variant="standard" >
                                    <Autocomplete
                                        // {...defaultProps}
                                        options={paymentTypePoList}
                                        className="mb-3"
                                        id="disable-close-on-select"
                                        onChange={handlePaymentTypeChange}
                                        getOptionLabel={(paymentTypePoList) => paymentTypePoList.bank_name + " " + paymentTypePoList.account_name + "  " + paymentTypePoList.account_description + " - " + paymentTypePoList.account_number}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Choose Bank" variant="standard" />
                                        )}
                                    />
                                </FormControl>
                            </Box>
                        </>) : ""}

                        {creditCardDueDetails.payment_term_id != 3 ? (<>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" name="amount_paid" placeholder="Enter Amount" onChange={onChangecreditCardDue} />
                            </Form.Group>
                        </>) :
                            <>

                            </>

                        }
                        {creditCardDueDetails.payment_term_id != 3 ? (<>

                            <Button variant="primary" onClick={savecreditCardDue}>
                                Submit
                            </Button>
                        </>) :
                            <>

                                <Button variant="primary" onClick={savecreditCardDue}>
                                    Pay
                                </Button>
                            </>

                        }


                    </Form>
                </Box>
            }
            <br></br>
            {paymentHistoryList.length != 0 &&
                <>
                    <legend align="center" style={{ fontWeight: 'bold' }} > Payment History </legend>
                    <table class="table table-bordered">
                        <thead class="table-dark">
                            <tr class="table-secondary">
                                <th>ID</th>
                                <th> Amount</th>
                                <th> Bank</th>
                                <th> Account Name</th>
                                <th> Account Nuumber</th>
                                <th> Date</th>
                                <th></th>
                                <th></th>


                            </tr>
                        </thead>
                        <tbody>

                            {
                                paymentHistoryList.map((paymentHistory, index) => (
                                    <tr key={paymentHistory.id} >
                                        <td>{paymentHistory.id}</td>
                                        <td>{numberFormat(paymentHistory.amount)} </td>
                                        <td>{paymentHistory.bank_name + " " + paymentHistory.account_description}</td>
                                        <td>{paymentHistory.account_name}</td>
                                        <td>{paymentHistory.account_number}</td>
                                        <td>{paymentHistory.updated_at}</td>
                                        <td>
                                            <Link variant="primary" to={"/payCreditCardHistory/" + paymentHistory.id}   >
                                                <Button  >
                                                    Update
                                                </Button>
                                            </Link>
                                        </td>
                                        <td>
                                            <Tooltip title="Payment">
                                                <IconButton>
                                                    <DeleteIcon color="error" onClick={(e) => openDelete(paymentHistory.id, e)} />

                                                </IconButton>
                                            </Tooltip>
                                        </td>



                                    </tr>
                                )
                                )
                            }
                        </tbody>
                    </table>
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
        </div>
    )
}

export default PayCreditCard
