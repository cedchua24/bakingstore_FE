import React, { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import moment from "moment";
import LinearProgress from '@mui/material/LinearProgress';
import CustomerService from "../Customer/CustomerService";



const AddCustomerOrderTransactionV2 = (props) => {

    const navigate = useNavigate();
    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        requestor: 0,
        checker: 0,
        customer_type_id: 0,
        sales_rep_id: 0,
        user_id: localStorage.getItem('auth_user_id'),
        date: moment().format("YYYY-MM-DD"),
        type: 0,
        created_at: '',
        updated_at: ''
    });
    const shopList = props.shopList;
    const customerTypeList = props.customerTypeList;
    const salesRepList = props.salesRepList;
    const dailySessionUpdate = props.dailySessionUpdate;

    useEffect(() => {
        searchCustomerList('');
    }, []);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [customerList, setCustomerList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);



    const steps = [
        'Create Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }

    const searchCustomerList = (search) => {
        CustomerService.searchVipCustomerList({
            search: search,
            limit: 50
        })
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const getCustomerName = (customer) => {
        if (!customer) {
            return '';
        }

        return customer.customer_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
    }

    const getVipCustomerColors = (customer) => {
        if (!customer || !Array.isArray(customer.vip_customers)) {
            return [];
        }

        return customer.vip_customers
            .map(vipCustomer => vipCustomer.vip_color)
            .filter(vipColor => vipColor);
    }

    const renderVipColorDots = (customer) => {
        const vipColors = getVipCustomerColors(customer);

        if (vipColors.length === 0) {
            return null;
        }

        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {vipColors.map((vipColor, index) => (
                    <span
                        key={index}
                        title="VIP Customer"
                        style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '999px',
                            backgroundColor: vipColor,
                            border: '1px solid #ced4da',
                            display: 'inline-block',
                            flex: '0 0 auto'
                        }}
                    ></span>
                ))}
            </span>
        );
    }

    const validate = (values) => {
        const errors = {};
        if (shopOrderTransaction.shop_id == 0) {
            errors.shop_id = "Shop is Required!";
        }
        if (shopOrderTransaction.sales_rep_id == 0) {
            errors.sales_rep_id = "Sales Representative is Required!";
        }
        if (shopOrderTransaction.customer_type_id == 0) {
            errors.customer_type_id = "Customer Type is Required!";
        }
        if (shopOrderTransaction.requestor == 0) {
            errors.requestor = "Customer Name is Required!";
        }
        if (shopOrderTransaction.date.length == 0) {
            errors.date = "Date is Required!";
        }


        return errors;
    }


    const saveOrderTransaction = () => {
        console.log('orderTransaction', shopOrderTransaction);

        console.log("count: ", Object.keys(validate(shopOrderTransaction)).length);
        console.log("validate: ", validate(shopOrderTransaction));
        setFormErrors(validate(shopOrderTransaction));
        if (Object.keys(validate(shopOrderTransaction)).length > 0) {
            console.log("Has Validation: ");

        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ShopOrderTransactionService.sanctum().then(response => {
                ShopOrderTransactionService.create(shopOrderTransaction)
                    .then(response => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        navigate('/shopOrderTransaction/addProductShopOrderTransaction/' + response.data.id);
                        window.open(
                            '/customers/customerProductList/' + shopOrderTransaction.requestor,
                            '_blank'
                        );
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        console.log(e);
                    });
            });
        }
    }

    return (
        <div>
            <Stepper activeStep={0} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>


                    </Step>
                ))}
            </Stepper>
            <br></br>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Added!</Alert.Heading>
                    <p>
                        Change this and that and try again. Duis mollis, est non commodo
                        luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
                        Cras mattis consectetur purus sit amet fermentum.
                    </p>
                </Alert>
            }
            {dailySessionUpdate === '' ? <LinearProgress color="warning" /> : dailySessionUpdate == false ? <div align="center">
                <Alert variant="filled" severity="error">Submit start of day first.</Alert>
            </div>
                : <div>
                    <Form>
                        {formErrors.shop_id && <p style={{ color: "red" }}>{formErrors.shop_id}</p>}
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                                <InputLabel id="demo-simple-select-label">Shop Name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={shopOrderTransaction.shop_id}
                                    label="Shop Name"
                                    name="shop_id"
                                    onChange={onChangeInput}
                                >
                                    {
                                        shopList.map((shop, index) => (
                                            <MenuItem value={shop.id}>{shop.shop_name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        {formErrors.customer_type_id && <p style={{ color: "red" }}>{formErrors.customer_type_id}</p>}
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                                <InputLabel id="demo-simple-select-label">Customer Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={shopOrderTransaction.customer_type_id}
                                    label="Shop Name"
                                    name="customer_type_id"
                                    onChange={onChangeInput}
                                >
                                    {
                                        customerTypeList.map((customerType, index) => (
                                            <MenuItem value={customerType.id}>{customerType.customer_type}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Box>

                        <Box
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '35ch' },
                            }}
                            noValidate
                            autoComplete="off"
                        // onSubmit={saveOrderSupplier}
                        >
                            {/* <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Customer</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={shopOrderTransaction.user_id}
                            label="Requestor"
                            name="requestor"
                            onChange={onChangeInput}
                        >
                            {
                                customerList.map((user, index) => (
                                    <MenuItem value={user.id}>{user.first_name} {user.last_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl> */}
                            {formErrors.sales_rep_id && <p style={{ color: "red" }}>{formErrors.sales_rep_id}</p>}
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                                    <InputLabel id="demo-simple-select-label">Sales Representative</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Shop Name"
                                        name="sales_rep_id"
                                        onChange={onChangeInput}
                                    >
                                        {
                                            salesRepList.map((salesRep, index) => (
                                                <MenuItem value={salesRep.id}>{salesRep.first_name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                            {formErrors.requestor && <p style={{ color: "red" }}>{formErrors.requestor}</p>}
                            <Form.Group className="mb-3" style={{ maxWidth: '560px' }} controlId="formCustomer">
                                <Autocomplete
                                    sx={{
                                        width: 320,
                                        '& .MuiTextField-root': {
                                            m: 0,
                                            width: '100%'
                                        }
                                    }}
                                    options={customerList}
                                    value={selectedCustomer}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    getOptionLabel={(option) => getCustomerName(option)}
                                    renderOption={(props, option) => (
                                        <li {...props}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
                                                <span>{getCustomerName(option)}</span>
                                                {getVipCustomerColors(option).length > 0 &&
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                        {renderVipColorDots(option)}
                                                        <span style={{ color: '#6c757d', fontSize: '11px', fontWeight: '700' }}>VIP</span>
                                                    </span>
                                                }
                                            </span>
                                        </li>
                                    )}
                                    onInputChange={(event, value) => {
                                        searchCustomerList(value);
                                    }}
                                    onChange={(event, value) => {
                                        setSelectedCustomer(value);
                                        setShopOrderTransaction({
                                            ...shopOrderTransaction,
                                            requestor: value ? value.id : 0
                                        });
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search Customer"
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        {selectedCustomer &&
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginRight: '10px' }}>
                                                                {renderVipColorDots(selectedCustomer)}
                                                                {getVipCustomerColors(selectedCustomer).length > 0 &&
                                                                    <span style={{ color: '#495057', fontSize: '11px', fontWeight: '700' }}>VIP</span>
                                                                }
                                                            </span>
                                                        }
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Box>
                        {formErrors.date && <p style={{ color: "red" }}>{formErrors.date}</p>}
                        <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="date" value={shopOrderTransaction.date} onChange={onChangeInput} />
                        </Form.Group>

                        <Button variant="primary"
                            disabled={isAddDisabled}
                            onClick={saveOrderTransaction}>
                            Next
                        </Button>
                        <br></br>
                        <br></br>
                        {submitLoadingAdd &&
                            <LinearProgress color="warning" />
                        }
                        <br></br>

                    </Form>
                    <br></br>
                </div>
            }

        </div>
    )
}

export default AddCustomerOrderTransactionV2
