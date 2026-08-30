import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import ExpensesCategoryV2Service from "./ExpensesCategoryV2Service";
import ExpensesV2Service from "./ExpensesV2Service";
import ExpenseTransactionService from "./ExpenseTransactionService";
import PaymentTypePoService from "../OtherService/PaymentTypePoService";
import PaymentTermService from "../OtherService/PaymentTermService";
import UserService from '../User/UserService.service'
import LinearProgress from '@mui/material/LinearProgress';
import { Link } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Checkbox from '@mui/material/Checkbox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import './EditExpenseTransaction.css';

const getCookieValue = (name) => {
    const cookie = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.substring(name.length + 1)) : '';
};

const EditExpenseTransaction = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchExpenseTransaction(id);
        fetchExpenseType();
        fetchExpenseTransactionList();
        fetchPaymentTerm();
        fetchRequestor();
    }, []);

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [expenseTypeList, setExpenseTypeList] = useState([]);
    const [expenseCategoryList, setExpenseCategoryList] = useState([]);
    const [expenseList, setExpenseList] = useState([]);
    const [expenseTransactionList, setExpenseTransactionList] = useState([]);
    const [requestorList, setRequestorList] = useState([]);
    const [role] = useState(localStorage.getItem('role_as'));
    const [authUserId] = useState(() => Number(getCookieValue('auth_user_id')));
    const [showHiddenExpenses, setShowHiddenExpenses] = useState(false);

    const [expenseTransaction, setExpenseTransaction] = useState({
        id: 0,
        shop_id: 0,
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        user_id: 0,
        requestor_name: '',
        approver_id: 0,
        approval_status: '',
        payment_type_po_id: 0,
        amount: 0,
        balance_type_id: 3,
        is_received: 0,
        name: 'Expense Transaction',
        details: '',
        expense_date: '',
        status: 0,
        updated_at: ''
    });

    const [expenseTransactionFixed, setExpenseTransactionFixed] = useState({
        id: 0,
        shop_id: 0,
        expense_type_id: 0,
        expense_category_id: 0,
        expense_id: 0,
        user_id: 0,
        requestor_name: '',
        approver_id: 0,
        approval_status: '',
        payment_type_po_id: 0,
        amount: 0,
        balance_type_id: 3,
        is_received: 0,
        name: '',
        details: '',
        expense_date: '',
        status: 0,
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const fetchExpenseTransaction = (id) => {
        ExpenseTransactionService.fetchExpenseTransactionById(id)
            .then(response => {
                // setExpenseTransaction(response.data);
                setExpenseTransaction(prev => ({
                    ...prev,
                    ...response.data
                }));
                setExpenseTransactionFixed(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchRequestor = () => {
        UserService.fetchUserList()
            .then(response => {
                setRequestorList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseType = () => {
        ExpensesTypeV2Service.getAll()
            .then(response => {
                setExpenseTypeList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchPaymentTerm = () => {
        PaymentTermService.getAll()
            .then(response => {
                setPaymentTermList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseTransactionList = () => {
        ExpenseTransactionService.fetchExpenseTransactionList(1)
            .then(response => {
                setExpenseTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeType = (e) => {
        setExpenseTransaction({
            ...expenseTransaction,
            expense_type_id: e.target.value,
            expense_id: 0,
            expense_category_id: 0
        });
        fetchCategoryExpenseList(e.target.value);
    }



    const onChangePaymentTypedisabled = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setExpenseTransaction({ ...expenseTransaction, is_received: 1 });
            } else {
                setExpenseTransaction({ ...expenseTransaction, is_received: 0 });
            }
        } else {
            setExpenseTransaction({ ...expenseTransaction, is_received: e.target.value });
        }
    }

    const onChangeInput = (e) => {
        setExpenseTransaction({ ...expenseTransaction, [e.target.name]: e.target.value });
    }

    const onChangeApprovalStatus = (e) => {
        const approvalStatus = e.target.value;
        setExpenseTransaction((current) => ({
            ...current,
            approval_status: approvalStatus,
            // Approval confirms receipt automatically; pending may be changed manually.
            is_received: approvalStatus === 'APPROVED' ? 1 : current.is_received,
        }));
    }


    const fetchCategoryExpenseList = (typeId) => {
        ExpensesCategoryV2Service.fetchExpenseCategoryById(typeId)
            .then(response => {
                setExpenseCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchExpenseList = (typeId) => {
        ExpensesV2Service.fetchExpenseV2ById(typeId)
            .then(response => {
                setExpenseList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }






    const saveExpenseType = () => {

        if (!canManageTransaction) {
            setValidator({
                severity: 'error',
                message: 'Only the assigned approver can update this transaction.',
                isShow: true,
            });
            return;
        }

        const validationErrors = {};
        const hasSavedPaymentDetails = Number(expenseTransactionFixed.payment_type_po_id) > 0;
        if (Number(expenseTransaction.is_received) === 1 && !hasSavedPaymentDetails) {
            if (!Number(expenseTransaction.payment_term_id)) {
                validationErrors.payment_term_id = "Payment Term is required when Amount Received is checked!";
            }
            if (!Number(expenseTransaction.payment_type_po_id)) {
                validationErrors.payment_type_po_id = "Choose Bank is required when Amount Received is checked!";
            }
        }

        setFormErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        const updatePayload = {
            ...expenseTransaction,
            is_received: expenseTransaction.approval_status === 'APPROVED'
                ? 1
                : Number(expenseTransaction.is_received),
        };
        console.log(updatePayload);
        ExpenseTransactionService.sanctum().then(response => {
            ExpenseTransactionService.update(expenseTransaction.id, updatePayload)
                .then(response => {
                    fetchExpenseTransactionList();
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    setValidator({
                        severity: 'success',
                        message: response.data.message,
                        isShow: true,
                    });
                    navigate('/expensesV2/viewExpenseTransaction');
                })
                .catch(e => {
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    console.log(e);
                    setValidator({
                        severity: 'error',
                        message: "expenseTransaction Already Exists",
                        isShow: true,
                    });
                });
        });

    }

    const handlePaymentTermChange = (e, value) => {
        const paymentTermId = Number(value?.id || 0);
        setExpenseTransaction((current) => ({
            ...current,
            payment_term_id: paymentTermId,
            payment_type_po_id: paymentTermId === 1 ? 1 : paymentTermId === 5 ? 2 : 0,
        }));
        setPaymentTypePoList([]);
        if (paymentTermId) fetchPaymentTypePo(paymentTermId);
    }

    const handlePaymentTypeChange = (e, value) => {
        setExpenseTransaction((current) => ({
            ...current,
            payment_type_po_id: Number(value?.id || 0),
        }));


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

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const statusColor = {
        PENDING: 'warning.main',
        APPROVED: 'success.main',
        REJECTED: 'error.main',
    };
    const statusColorTd = {
        PENDING: 'orange',
        APPROVED: 'green',
        REJECTED: 'red',
    };

    // Approval status controls whether the transaction is editable.
    const isFinalized = expenseTransactionFixed.approval_status === 'APPROVED';
    const isAdmin = Number(role) === 2;
    const canManageTransaction = isAdmin
        || (Number(expenseTransactionFixed.id) > 0
            && Number(expenseTransaction.approver_id) === authUserId);
    const isReadOnly = isFinalized || !canManageTransaction;
    const hasPaymentDetails = Number(expenseTransaction.payment_term_id) > 0
        || Number(expenseTransaction.payment_type_po_id) > 0;
    const requiresPaymentReceipt = ['PENDING', 'REJECTED'].includes(expenseTransaction.approval_status)
        && hasPaymentDetails;
    const isPaymentReceiptMissing = requiresPaymentReceipt && Number(expenseTransaction.is_received) !== 1;

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            {Number(expenseTransactionFixed.id) > 0 && !canManageTransaction &&
                <Alert severity="warning" sx={{ width: 'min(100% - 32px, 1040px)', margin: '16px auto 0' }}>
                    Select the appropriate approver. Only the selected approver or an administrator can submit this transaction.
                </Alert>
            }
            <br></br>
            <Form>
                <legend align="center" style={{ fontWeight: 'bold' }} > {isReadOnly ? "View" : "Update"} Expense Transaction </legend>
                <br></br>
                <br></br>
                <div className="eet-form-grid">
                <section className="eet-form-column eet-form-actions">
                    <div className="eet-section-heading"><span>02</span><div><strong>Approval & payment</strong><small>Update the approval, amount, and optional payment details.</small></div></div>

                    {formErrors.approver_id && <p style={{ color: "red" }}>{formErrors.approver_id}</p>}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                            <InputLabel id="demo-simple-select-label">Approver</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Approver"
                                name="approver_id"
                                value={expenseTransaction.approver_id}
                                onChange={onChangeInput}
                                disabled={isFinalized}
                            >
                                {
                                    requestorList.map((requestor, index) => (
                                        <MenuItem value={requestor.id}>{requestor.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Box>


                    <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"

                        id="demo-simple-select"
                        name="approval_status"
                        label="Stock Warning Type"
                        value={expenseTransaction.approval_status}
                        sx={{
                            color: statusColor[expenseTransaction.approval_status],
                            '& .MuiSelect-icon': {
                                color: statusColor[expenseTransaction.approval_status],
                            },
                        }}
                        onChange={onChangeApprovalStatus}
                        displayEmpty
                        disabled={isReadOnly}
                    // disabled={orderSupplierTransaction.status == 'COMPLETED'}
                    >
                        <MenuItem value="PENDING" sx={{ color: "orange" }}>PENDING</MenuItem>
                        <MenuItem value="APPROVED" sx={{ color: "green" }}>APPROVED</MenuItem>
                        <MenuItem value="REJECTED" sx={{ color: "red" }}>REJECTED</MenuItem>
                    </Select>
                    <br></br>
                    <br></br>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ m: 0, minWidth: 420, minHeight: 70 }}>
                            <TextField
                                id="outlined-basic"
                                label="Details"
                                variant="outlined"
                                name="details"
                                value={expenseTransaction.details}
                                placeholder="Enter Details"
                                InputLabelProps={{ shrink: true }}
                                onChange={onChangeInput}
                                disabled={isReadOnly}
                            />
                        </FormControl>
                    </Box>




                    {formErrors.amount && <p style={{ color: "red" }}>{formErrors.amount}</p>}
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                            <TextField
                                id="outlined-basic"
                                label="Amount"
                                variant="outlined"
                                name="amount"
                                placeholder="Enter Amount"
                                value={expenseTransaction.amount}
                                onChange={onChangeInput}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ₱
                                        </InputAdornment>
                                    ),
                                }}
                                disabled={expenseTransactionFixed.payment_type_po_id != 0}
                            />
                        </FormControl>
                    </Box>

                    {expenseTransactionFixed.payment_type_po_id != 0 ?
                        <>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl sx={{ m: 0, minWidth: 420, minHeight: 70 }}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Payment Details"
                                        variant="outlined"
                                        name="Payment Type"
                                        value={expenseTransaction.payment_type_po_id == 1 ? expenseTransaction.bank_name : expenseTransaction.payment_term + " - " + expenseTransaction.bank_name + " " + expenseTransaction.account_name + " " + expenseTransaction.account_description + " " + expenseTransaction.account_number}
                                        placeholder="Enter Details"
                                        InputLabelProps={{ shrink: true }}
                                        disabled
                                    />
                                </FormControl>
                            </Box>
                        </>
                        :
                        <>

                            {formErrors.payment_term_id && <p style={{ color: "red" }}>{formErrors.payment_term_id}</p>}
                            <FormControl variant="standard"  >
                                <Autocomplete
                                    sx={{
                                        width: 300
                                    }}
                                    // {...defaultProps}
                                    options={paymentTermList}
                                    name="payment_term_id"
                                    className="mb-3"
                                    id="disable-close-on-select"
                                    onChange={handlePaymentTermChange}
                                    getOptionLabel={(paymentTermList) => paymentTermList.payment_term}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose Payment Term" variant="standard" />
                                    )}
                                />
                            </FormControl>
                            <br></br>
                        </>
                    }


                    {expenseTransaction.payment_term_id != 0 ? (<>

                        {expenseTransaction.payment_term_id == 2 || expenseTransaction.payment_term_id == 3 || expenseTransaction.payment_term_id == 4 ? (<>
                            {formErrors.payment_type_po_id && <p style={{ color: "red" }}>{formErrors.payment_type_po_id}</p>}
                            <Box
                                sx={{
                                    '& .MuiTextField-root': { width: '65ch' },
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
                        </>) :
                            ""}






                    </>) : ""}


                    {expenseTransaction.payment_term_id == 3 &&
                        <>
                            {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>{expenseTransaction.payment_term_id == 3 ? "Due Date" : "Date"}</Form.Label>
                                <Form.Control type="date" name="expense_date" onChange={onChangeInput} />
                            </Form.Group>
                        </>
                    }



                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount Received? {requiresPaymentReceipt && <span style={{ color: 'red' }}>*</span>}</Form.Label>
                        <Checkbox
                            checked={Number(expenseTransaction.is_received) === 1}
                            onChange={onChangePaymentTypedisabled}
                            inputProps={{ 'aria-label': 'controlled' }}
                            disabled={Number(expenseTransactionFixed.is_received) === 1 || isReadOnly}
                        />
                        {isPaymentReceiptMissing && <small style={{ display: 'block', color: '#a05d12' }}>Required because payment details are already provided.</small>}
                    </Form.Group>
                    {!isFinalized && canManageTransaction &&
                        <>
                            <Button variant="primary"
                                disabled={isAddDisabled || isPaymentReceiptMissing}
                                onClick={saveExpenseType}>
                                Submit
                            </Button>
                            <br></br>
                            <br></br>
                            {submitLoadingAdd &&
                                <LinearProgress color="warning" />
                            }
                        </>
                    }
                </section>

                <section className="eet-form-column eet-form-summary">
                    <div className="eet-section-heading"><span>01</span><div><strong>Expense information</strong><small>Review the transaction classification and request details.</small></div><FormControlLabel className="eet-confidential" control={<Checkbox checked={showHiddenExpenses} disabled={Number(role) !== 2} onChange={(event) => setShowHiddenExpenses(event.target.checked)} />} label="Confidential" /></div>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Expense Type"
                            value={expenseTransaction.expense_type}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>



                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Expense Category"
                            value={expenseTransaction.expense_category_name}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Expense"
                            value={Number(expenseTransaction.is_hidden) === 1 && !showHiddenExpenses ? "***" : expenseTransaction.expense_name || ''}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>






                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Requestor"
                            value={expenseTransaction.requestor_name}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <TextField
                            id="outlined-basic"
                            label="Date"
                            value={expenseTransaction.expense_date}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            disabled
                        />
                    </FormControl>
                </Box>
                </section>
                </div>
            </Form>
            <br></br>



        </div >
    )
}

export default EditExpenseTransaction
