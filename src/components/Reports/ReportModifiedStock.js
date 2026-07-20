import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';
import ProductServiceService from "../Product/ProductService.service";
import CategoryServiceService from "../Category/CategoryService.service";

import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import UpdateIcon from '@mui/icons-material/Update';


import { Form } from 'react-bootstrap';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

import './ReportModifiedStock.css';

const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getCurrentMonthRange = () => {
    const today = new Date();
    return {
        dateFrom: formatDateInput(new Date(today.getFullYear(), today.getMonth(), 1)),
        dateTo: formatDateInput(new Date(today.getFullYear(), today.getMonth() + 1, 0))
    };
};




const ReportModifiedStock = (props) => {

    // const productList = props.productList;
    useEffect(() => {
        ProductServiceService.fetchModifiedReportList(getCurrentMonthRange())
            .then(response => setProductList(response.data))
            .catch(e => console.log("error", e));
        fetchCategoryList();
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [productList, setProductList] = useState({
        data: [],
        total_amount: [],
        code: '',
        message: '',
    });

    const [categoryId, setCategoryId] = useState(0);
    const [categeryList, setCategoryList] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        '& .MuiTextField-root': { m: 1, width: '25ch' },
    };

    const [open, setOpen] = React.useState(false);

    const [customerOrderDate, setCustomerOrderDate] = useState({
        ...getCurrentMonthRange(),
        typeList: []
    });

    const stockTypeOptions = [
        'INVENTORY',
        'REPACK',
        'ADJUSTMENT',
        'SPOILAGE',
        'RETURN',
        'RECEIVED_TO_WAREHOUSE'
    ];

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchByProductId(id);
        setOpen(true);
    }

    const handleClose = () => setOpen(false);

    const [product, setProduct] = useState({
        id: 0,
        product_name: '',
        stock: 0,
        newStocks: 0,
        pack: ''
    });

    const [realStock, setRealStock] = useState(0);
    const [errorStock, setErrorStock] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });
        setCategoryId(e.target.value)
        // setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }

    const onChangeDate = (e) => {
        setCustomerOrderDate({ ...customerOrderDate, [e.target.name]: e.target.value });
    }

    const onChangeTypeList = (e) => {
        const value = e.target.value;
        setCustomerOrderDate({
            ...customerOrderDate,
            typeList: typeof value === 'string' ? value.split(',') : value
        });
    }

    const onChangePackaging = (e) => {
        console.log(e.target.value)
        setProduct({
            ...product,
            pack: e.target.value,
        });
    }

    const onChangeStock = (e) => {
        // const realStock = product.stock;
        // const totalStock = Number(realStock) + Number(e.target.value);
        setProduct({
            ...product,
            newStocks: e.target.value,
        });

        if (Number(e.target.value) < 1) {
            setErrorStock(true);
        } else {
            setErrorStock(false);
        }
    }

    const fetchByProductId = async (id) => {
        await ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
                setRealStock(response.data.stock);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCategoryList = () => {
        CategoryServiceService.getAll()
            .then(response => {
                setCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateProduct = () => {
        setSubmitLoading(true);
        ProductServiceService.update(product.id, product)
            .then(response => {
                fetchProductList();
                setSubmitLoading(false);
                setOpen(false);
                // updateOrderTransaction();
            })
            .catch(e => {
                console.log(e);
                setSubmitLoading(false);
                setOpen(false);
            });

    }


    const fetchProductList = () => {
        ProductServiceService.fetchModifiedReportList()
            .then(response => {
                setProductList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const validate = (values) => {
        const errors = {};
        if (customerOrderDate.dateFrom.length == 0) {
            errors.dateFrom = "Date From Required!";
        }
        if (customerOrderDate.dateTo.length == 0) {
            errors.dateTo = "Date To Required!";
        }

        return errors;
    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction: ', customerOrderDate.date);
        console.log("count: ", Object.keys(validate(customerOrderDate)).length);
        console.log("validate: ", validate(customerOrderDate));
        setFormErrors(validate(customerOrderDate));
        if (Object.keys(validate(customerOrderDate)).length > 0) {
            console.log("Has Validation: ");

        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            const requestData = {
                dateFrom: customerOrderDate.dateFrom,
                dateTo: customerOrderDate.dateTo,
                ...(customerOrderDate.typeList.length > 0 && { typeList: customerOrderDate.typeList })
            };
            ProductServiceService.fetchModifiedReportList(requestData)
                .then(response => {
                    setProductList(response.data);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        }
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

    const totalSum = (numbers) => {
        var result;
        result = numbers.filter(d => d.stock > 0)
        return (result.reduce((acc, { total_cost }) => acc + total_cost, 0));
    }

    const totalDiff = (numbers) => {
        var result;
        result = numbers.filter(d => d.stock < 0)
        return (result.reduce((acc, { total_cost }) => acc + total_cost, 0));
    }

    return (
        <div className="modified-report-page">
            <section className="modified-report-hero">
                <div className="modified-report-hero__icon"><TuneRoundedIcon /></div>
                <div><span>Inventory audit</span><h1>Modified Stock Report</h1><p>Review stock adjustments by date range and transaction type.</p></div>
            </section>

            <section className="modified-report-summary">
                <div><span className="modified-report-summary__icon modified-report-summary__icon--green"><AddCircleOutlineRoundedIcon /></span><div><small>Total added</small><strong>{numberFormat(totalSum(productList.data))}</strong></div></div>
                <div><span className="modified-report-summary__icon modified-report-summary__icon--red"><RemoveCircleOutlineRoundedIcon /></span><div><small>Total reduced</small><strong>{numberFormat(totalDiff(productList.data))}</strong></div></div>
                <div><span className="modified-report-summary__icon modified-report-summary__icon--blue"><AccountBalanceWalletOutlinedIcon /></span><div><small>Net adjustment</small><strong>{numberFormat(totalSum(productList.data) + totalDiff(productList.data))}</strong></div></div>
            </section>

            <Form className="modified-report-filter">
                <div className="modified-report-filter__header"><div><strong>Report filters</strong><span>Choose a date range and optionally limit the transaction types.</span></div></div>
                <div className="modified-report-filter__fields">
                <Form.Group>
                    <Form.Label>Date from *</Form.Label>
                    <Form.Control type="date" name="dateFrom" value={customerOrderDate.dateFrom} onChange={onChangeDate} isInvalid={Boolean(formErrors.dateFrom)} />
                    <Form.Control.Feedback type="invalid">{formErrors.dateFrom}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date to *</Form.Label>
                    <Form.Control type="date" name="dateTo" value={customerOrderDate.dateTo} onChange={onChangeDate} isInvalid={Boolean(formErrors.dateTo)} />
                    <Form.Control.Feedback type="invalid">{formErrors.dateTo}</Form.Control.Feedback>
                </Form.Group>
                <div className="modified-report-filter__field">
                    <label id="modified-report-type-list-label">Types</label>
                    <FormControl size="small" className="modified-report-type-select">
                        <Select
                            aria-labelledby="modified-report-type-list-label"
                            multiple
                            displayEmpty
                            value={customerOrderDate.typeList}
                            onChange={onChangeTypeList}
                            renderValue={(selected) => selected.length ? (
                                <Box className="modified-report-type-chips">
                                    {selected.map(type => <Chip key={type} label={type} size="small" />)}
                                </Box>
                            ) : 'All types'}
                        >
                            {stockTypeOptions.map(type => (
                                <MenuItem key={type} value={type}>
                                    <Checkbox checked={customerOrderDate.typeList.includes(type)} />
                                    <ListItemText primary={type} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <small>Leave empty to include all types.</small>
                </div>
                <Button variant="primary" className="modified-report-find"
                    onClick={saveOrderTransaction}
                    disabled={isAddDisabled}
                >
                    <SearchIcon />{isAddDisabled ? 'Loading...' : 'Find records'}
                </Button>
                </div>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" className="modified-report-progress" />
                }
            </Form >

            <section className="modified-report-card">
                <div className="modified-report-card__header"><div><h2>Adjustment records</h2><p>{productList.data.length} {productList.data.length === 1 ? 'record' : 'records'} found.</p></div><span><Inventory2OutlinedIcon />Stock history</span></div>
                <div className="table-responsive">
            <table className="modified-report-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Brand</th>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Reason</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Cost</th>
                        <th>Date</th>
                        {/* <th>Transaction</th> */}
                    </tr>
                </thead>
                <tbody>
                    {productList.data.length > 0 ?
                        productList.data.map((product, index) => (
                            <tr key={product.id} >
                                <td>{product.id}</td>
                                <td>{product.brand_name}</td>
                                <td>{product.product_name}</td>
                                <td>{product.type || 'Not specified'}</td>
                                <td>{product.stock_reason}</td>
                                <td>{numberFormat(product.price)}</td>
                                <td>{product.stock + " " + product.pack}</td>
                                <td>{numberFormat(product.total_cost)}</td>
                                <td>{formatStatementDate(product.updated_at)}</td>
                                {/* <td>
                                    <Link variant="primary" to={"/viewTransaction/" + product.id}   >
                                        <Button variant="contained" >
                                            View
                                        </Button>
                                    </Link>
                                </td> */}
                            </tr>
                        )) : (
                            <tr><td colSpan="9"><div className="modified-report-empty"><Inventory2OutlinedIcon /><strong>No modified stock records</strong><span>Adjust the filters or choose another date range.</span></div></td></tr>
                        )
                    }
                </tbody>
            </table>
                </div>
            </section>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update Stock
                    </Typography>

                    {submitLoading &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </div>
                    }

                    <TextField
                        disabled
                        id="filled-required"
                        label="Product Name"
                        variant="filled"
                        name='product_name'
                        value={product.product_name}
                    />
                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel id="demo-simple-select-label">Packaging</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={product.packaging}
                            label="Packaging"
                            name="pack"
                            onChange={onChangePackaging}
                        >
                            <MenuItem value={product.packaging}>{product.packaging}</MenuItem>
                            <MenuItem value="Pc">Pc</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Add Stocks</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='newStocks'
                            errorText='{this.state.password_error_text}'
                            min='1'
                            // value={product.stock}
                            onChange={onChangeStock}
                            // helperText="Incorrect entry."
                            error={errorStock}
                        />
                    </FormControl>

                    {/* <FormControl fullWidth sx={{ m: 0 }} variant="standard">
                        <TextField
                            disabled
                            id="filled-required"
                            label="Stock"
                            variant="filled"
                            name='product_name'
                            value={product.stock}
                        />
                    </FormControl> */}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant="contained"
                            type="submit"
                            onClick={updateProduct}
                            disabled={errorStock}
                            size="large" >
                            Submits
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ReportModifiedStock
