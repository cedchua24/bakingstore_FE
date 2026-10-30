import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Button, Form } from 'react-bootstrap';
import ExpensesTypeV2Service from "./ExpensesTypeV2Service";
import ExpensesCategoryV2Service from "./ExpensesCategoryV2Service";
import ExpensesV2Service from "./ExpensesV2Service";
import ExpenseTransactionService from "./ExpenseTransactionService";
import CentralExpenseService from "../Accounting/CentralExpenseService";
import { centralCustomerPaymentLabel } from "../Accounting/useCentralCustomerPaymentSummaries";
import ShopService from "../Shop/ShopService";
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
        fetchPaymentAccounts();
        fetchCurrentShop();
        fetchRequestor();
    }, []);

    const [paymentTermList, setPaymentTermList] = useState([]);
    const [paymentTypePoList, setPaymentTypePoList] = useState([]);
    const [shop, setShop] = useState({ id: 0, shop_name: '' });
    const [centralSummary, setCentralSummary] = useState(null);
    const [installmentCount, setInstallmentCount] = useState(1);
    const [accountingIdempotencyKey, setAccountingIdempotencyKey] = useState('');
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
                if (Number(response.data?.payment_type_po_id) === 0) {
                    CentralExpenseService.summaries([Number(id)])
                        .then(summaries => setCentralSummary(summaries[String(id)] || null))
                        .catch(e => {
                            setCentralSummary(null);
                            console.log("error", e);
                        });
                }
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
        CentralExpenseService.paymentMethods()
            .then(methods => setPaymentTermList(methods))
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchPaymentAccounts = () => {
        CentralExpenseService.accounts()
            .then(accounts => setPaymentTypePoList(accounts))
            .catch(e => {
                setPaymentTypePoList([]);
                console.log("error", e);
            });
    }

    const fetchCurrentShop = () => {
        ShopService.fetchShopCurrent()
            .then(response => setShop(response.data || {}))
            .catch(e => console.log("error", e));
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
        const checked = e.target.checked;
        setExpenseTransaction((current) => ({
            ...current,
            is_received: checked ? 1 : 0,
            payment_term_id: checked ? current.payment_term_id : 0,
            payment_type_po_id: checked ? current.payment_type_po_id : 0,
        }));
        if (!checked) {
            setInstallmentCount(1);
            setAccountingIdempotencyKey('');
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






    const saveExpenseType = async () => {

        if (!canManageTransaction) {
            setValidator({
                severity: 'error',
                message: 'Only the assigned approver can update this transaction.',
                isShow: true,
            });
            return;
        }

        const validationErrors = {};
        const hasLegacyPayment = Number(expenseTransactionFixed.payment_type_po_id) > 0;
        const hasCentralPayment = Array.isArray(centralSummary?.data)
            && centralSummary.data.some((payment) => payment.status === 'posted');
        const shouldAddCentralPayment = !hasLegacyPayment
            && !hasCentralPayment
            && Number(expenseTransaction.is_received) === 1;
        const chartAccountId = Number(
            expenseTransaction.chart_of_account_id || expenseTransactionFixed.chart_of_account_id
        );
        const chartAccountName = (
            expenseTransaction.chart_of_account_name || expenseTransactionFixed.chart_of_account_name || ''
        ).trim();

        if (!hasLegacyPayment && (!chartAccountId || !chartAccountName)) {
            validationErrors.accounting = 'The expense chart of account could not be identified. Refresh the page and try again.';
        }
        if (shouldAddCentralPayment) {
            if (!Number(expenseTransaction.payment_term_id)) {
                validationErrors.payment_term_id = "Payment method is required when Pay now is checked!";
            }
            if (!Number(expenseTransaction.payment_type_po_id)) {
                validationErrors.payment_type_po_id = "Financial account is required when Pay now is checked!";
            }
            if (!shop.id || !shop.shop_name) {
                validationErrors.payment_term_id = "Current branch could not be identified.";
            }
        }

        setFormErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            if (validationErrors.accounting) {
                setValidator({
                    severity: 'error',
                    message: validationErrors.accounting,
                    isShow: true,
                });
            }
            return;
        }

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        const updatePayload = {
            ...expenseTransaction,
            payment_type_po_id: hasLegacyPayment ? expenseTransactionFixed.payment_type_po_id : 0,
            is_received: hasLegacyPayment
                ? Number(expenseTransaction.is_received)
                : (hasCentralPayment || shouldAddCentralPayment ? 1 : 0),
        };
        console.log(updatePayload);
        try {
            await ExpenseTransactionService.sanctum();
            await ExpenseTransactionService.update(expenseTransaction.id, updatePayload);

            if (!hasLegacyPayment) {
                const key = shouldAddCentralPayment
                    ? (accountingIdempotencyKey || CentralExpenseService.newIdempotencyKey())
                    : undefined;
                if (key && !accountingIdempotencyKey) setAccountingIdempotencyKey(key);

                const summary = await CentralExpenseService.record({
                    external_branch_id: Number(shop.id || expenseTransaction.shop_id),
                    branch_name: shop.shop_name || `Branch ${expenseTransaction.shop_id}`,
                    external_expense_id: Number(expenseTransaction.id),
                    external_chart_account_id: chartAccountId,
                    chart_account_name: chartAccountName,
                    expense_name: expenseTransaction.expense_name,
                    expense_date: String(expenseTransaction.expense_date).split('T')[0],
                    amount: Number(expenseTransaction.amount),
                    description: expenseTransaction.details || null,
                    currency: 'PHP',
                    record_payment: shouldAddCentralPayment,
                    financial_account_id: shouldAddCentralPayment ? Number(expenseTransaction.payment_type_po_id) : null,
                    payment_method_id: shouldAddCentralPayment ? Number(expenseTransaction.payment_term_id) : null,
                    payment_date: shouldAddCentralPayment ? String(expenseTransaction.expense_date).split('T')[0] : null,
                    installment_count: Number(installmentCount || 1),
                    idempotency_key: key,
                });
                setCentralSummary(summary);
            }

            fetchExpenseTransactionList();
            setSubmitLoadingAdd(false);
            setIsAddDisabled(false);
            setValidator({
                severity: 'success',
                message: shouldAddCentralPayment
                    ? 'Expense updated and payment posted to Central Accounting.'
                    : 'Expense updated successfully.',
                isShow: true,
            });
            navigate('/expensesV2/viewExpenseTransaction');
        } catch (e) {
            setSubmitLoadingAdd(false);
            setIsAddDisabled(false);
            console.log(e);
            setValidator({
                severity: 'error',
                message: e.response?.data?.message
                    || Object.values(e.response?.data?.errors || {})?.[0]?.[0]
                    || 'Unable to update the expense or post its Accounting payment.',
                isShow: true,
            });
        }

    }

    const handlePaymentTermChange = (e, value) => {
        const paymentTermId = Number(value?.id || 0);
        setExpenseTransaction((current) => ({
            ...current,
            payment_term_id: paymentTermId,
            payment_type_po_id: 0,
        }));
        if (value?.type !== 'credit_card') setInstallmentCount(1);
    }

    const handlePaymentTypeChange = (e, value) => {
        setExpenseTransaction((current) => ({
            ...current,
            payment_type_po_id: Number(value?.id || 0),
        }));


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
    const hasLegacyPayment = Number(expenseTransactionFixed.payment_type_po_id) > 0;
    const centralPaymentLines = Array.isArray(centralSummary?.data)
        ? centralSummary.data
            .filter((payment) => payment.status === 'posted')
            .flatMap((payment) => (payment.lines || []).map((line) => ({
                ...line,
                paymentId: payment.id,
            })))
        : [];
    const hasCentralPayment = centralPaymentLines.length > 0;
    const canAddCentralPayment = !hasLegacyPayment && !hasCentralPayment && canManageTransaction;
    const selectedPaymentMethod = paymentTermList.find((method) =>
        Number(method.id) === Number(expenseTransaction.payment_term_id)
    );
    const accountKindsByMethod = {
        cash: ['cash'],
        bank_transfer: ['bank_account', 'checking_account'],
        cheque: ['checking_account'],
        credit_card: ['credit_card'],
        e_wallet: ['e_wallet'],
    };
    const availablePaymentAccounts = paymentTypePoList.filter((account) =>
        (accountKindsByMethod[selectedPaymentMethod?.type] || []).includes(account.kind)
    );
    const paymentAccountLabel = (account) => [
        account.institution?.name,
        account.name,
        account.masked_account_number || account.account_number,
    ].filter(Boolean).filter((value, index, values) =>
        values.findIndex((candidate) => String(candidate).trim().toLowerCase() === String(value).trim().toLowerCase()) === index
    ).join(' · ');

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
                                disabled={hasLegacyPayment || hasCentralPayment || isFinalized}
                            />
                        </FormControl>
                    </Box>

                    {hasLegacyPayment ?
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
                        : hasCentralPayment ?
                        <>
                            <TextField
                                fullWidth
                                label="Central Accounting payment"
                                value={centralPaymentLines.map((line) =>
                                    `${centralCustomerPaymentLabel(line)} · ${numberFormat(line.amount)}`
                                ).join(' / ')}
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </>
                        : <>
                            <Form.Group className="mb-3" controlId="payExpenseNow">
                                <Form.Label>Pay now through Central Accounting?</Form.Label>
                                <Checkbox
                                    checked={Number(expenseTransaction.is_received) === 1}
                                    onChange={onChangePaymentTypedisabled}
                                    inputProps={{ 'aria-label': 'Pay expense now' }}
                                    disabled={!canAddCentralPayment}
                                />
                            </Form.Group>

                            {Number(expenseTransaction.is_received) === 1 && <>
                                {formErrors.payment_term_id && <p style={{ color: "red" }}>{formErrors.payment_term_id}</p>}
                                <FormControl variant="standard" sx={{ width: '100%', mb: 2 }}>
                                    <Autocomplete
                                        options={paymentTermList}
                                        value={selectedPaymentMethod || null}
                                        onChange={handlePaymentTermChange}
                                        getOptionLabel={(method) => method.name || ''}
                                        renderInput={(params) => (
                                            <TextField {...params} required label="Payment method" variant="standard" />
                                        )}
                                    />
                                </FormControl>

                                {Number(expenseTransaction.payment_term_id) !== 0 && <>
                                    {formErrors.payment_type_po_id && <p style={{ color: "red" }}>{formErrors.payment_type_po_id}</p>}
                                    <FormControl variant="standard" sx={{ width: '100%', mb: 2 }}>
                                        <Autocomplete
                                            options={availablePaymentAccounts}
                                            value={availablePaymentAccounts.find((account) =>
                                                Number(account.id) === Number(expenseTransaction.payment_type_po_id)
                                            ) || null}
                                            onChange={handlePaymentTypeChange}
                                            getOptionLabel={paymentAccountLabel}
                                            renderInput={(params) => (
                                                <TextField {...params} required label="Financial account" variant="standard" />
                                            )}
                                        />
                                    </FormControl>
                                </>}

                                {selectedPaymentMethod?.type === 'credit_card' && (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Installments"
                                        value={installmentCount}
                                        onChange={(event) => setInstallmentCount(Math.max(1, Number(event.target.value || 1)))}
                                        inputProps={{ min: 1, max: 60, step: 1 }}
                                        helperText="Accounting will create the monthly statement due dates."
                                        sx={{ mb: 2 }}
                                    />
                                )}
                            </>}
                        </>
                    }
                    {canManageTransaction && (!isFinalized || canAddCentralPayment) &&
                        <div className="eet-submit-area">
                            <Button className="eet-submit-button" variant="primary"
                                disabled={isAddDisabled}
                                onClick={saveExpenseType}>
                                {submitLoadingAdd
                                    ? (isFinalized ? 'Adding payment…' : 'Saving changes…')
                                    : (isFinalized ? 'Add payment' : 'Save changes')}
                            </Button>
                            {submitLoadingAdd &&
                                <LinearProgress color="warning" />
                            }
                        </div>
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
