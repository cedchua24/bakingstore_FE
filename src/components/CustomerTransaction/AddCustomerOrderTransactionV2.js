import React, { useState, useEffect } from "react";
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
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import moment from "moment";
import LinearProgress from '@mui/material/LinearProgress';
import CustomerService from "../Customer/CustomerService";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StorefrontIcon from '@mui/icons-material/Storefront';



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

    const getSelectedShopName = () => {
        const selectedShop = shopList.find(shop => shop.id === shopOrderTransaction.shop_id);
        return selectedShop ? selectedShop.shop_name : 'Not selected';
    }

    const getSelectedCustomerType = () => {
        const selectedCustomerType = customerTypeList.find(customerType => customerType.id === shopOrderTransaction.customer_type_id);
        return selectedCustomerType ? selectedCustomerType.customer_type : 'Not selected';
    }

    const getSelectedSalesRep = () => {
        const selectedSalesRep = salesRepList.find(salesRep => salesRep.id === shopOrderTransaction.sales_rep_id);
        return selectedSalesRep ? selectedSalesRep.first_name : 'Not selected';
    }

    const validate = (values) => {
        const errors = {};
        if (shopOrderTransaction.shop_id === 0) {
            errors.shop_id = "Shop is Required!";
        }
        if (shopOrderTransaction.sales_rep_id === 0) {
            errors.sales_rep_id = "Sales Representative is Required!";
        }
        if (shopOrderTransaction.customer_type_id === 0) {
            errors.customer_type_id = "Customer Type is Required!";
        }
        if (shopOrderTransaction.requestor === 0) {
            errors.requestor = "Customer Name is Required!";
        }
        if (shopOrderTransaction.date.length === 0) {
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
        <Box sx={{ bgcolor: '#f6f7f9', minHeight: '100vh', p: { xs: 2, md: 3 } }}>
            <Box sx={{ maxWidth: 1180, mx: 'auto' }}>
                <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb', mb: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                        <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, flexWrap: 'wrap', rowGap: 1 }}>
                                <ReceiptLongIcon color="primary" />
                                <Chip size="small" color="success" label="Customer Order" />
                                <Chip size="small" variant="outlined" label={moment(shopOrderTransaction.date).format("MMM DD, YYYY")} />
                            </Stack>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, letterSpacing: 0 }}>
                                Create Customer Order
                            </Typography>
                            <Typography color="text.secondary">
                                Set the shop, customer, sales representative, and order date before adding products.
                            </Typography>
                        </Box>

                    </Stack>

                    <Box sx={{ mt: 3 }}>
                        <Stepper activeStep={0} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Box>
                </Paper>

                {dailySessionUpdate === '' ? (
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <LinearProgress color="warning" />
                    </Paper>
                ) : dailySessionUpdate === false ? (
                    <Alert variant="filled" severity="error" sx={{ mb: 2 }}>Submit start of day first.</Alert>
                ) : (
                    <>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.25fr) minmax(320px, .75fr)' }, gap: 2, mb: 2 }}>
                            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Transaction Details</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Required fields are checked before creating the order.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                                        <FormControl fullWidth error={Boolean(formErrors.shop_id)}>
                                            <InputLabel id="shop-select-label">Shop Name</InputLabel>
                                            <Select
                                                labelId="shop-select-label"
                                                id="shop-select"
                                                value={shopOrderTransaction.shop_id}
                                                label="Shop Name"
                                                name="shop_id"
                                                onChange={onChangeInput}
                                            >
                                                {shopList.map((shop) => (
                                                    <MenuItem key={shop.id} value={shop.id}>{shop.shop_name}</MenuItem>
                                                ))}
                                            </Select>
                                            {formErrors.shop_id &&
                                                <Typography variant="caption" color="error" sx={{ mt: .5 }}>{formErrors.shop_id}</Typography>
                                            }
                                        </FormControl>

                                        <FormControl fullWidth error={Boolean(formErrors.customer_type_id)}>
                                            <InputLabel id="customer-type-select-label">Customer Type</InputLabel>
                                            <Select
                                                labelId="customer-type-select-label"
                                                id="customer-type-select"
                                                value={shopOrderTransaction.customer_type_id}
                                                label="Customer Type"
                                                name="customer_type_id"
                                                onChange={onChangeInput}
                                            >
                                                {customerTypeList.map((customerType) => (
                                                    <MenuItem key={customerType.id} value={customerType.id}>{customerType.customer_type}</MenuItem>
                                                ))}
                                            </Select>
                                            {formErrors.customer_type_id &&
                                                <Typography variant="caption" color="error" sx={{ mt: .5 }}>{formErrors.customer_type_id}</Typography>
                                            }
                                        </FormControl>

                                        <FormControl fullWidth error={Boolean(formErrors.sales_rep_id)}>
                                            <InputLabel id="sales-rep-select-label">Sales Representative</InputLabel>
                                            <Select
                                                labelId="sales-rep-select-label"
                                                id="sales-rep-select"
                                                value={shopOrderTransaction.sales_rep_id}
                                                label="Sales Representative"
                                                name="sales_rep_id"
                                                onChange={onChangeInput}
                                            >
                                                {salesRepList.map((salesRep) => (
                                                    <MenuItem key={salesRep.id} value={salesRep.id}>{salesRep.first_name}</MenuItem>
                                                ))}
                                            </Select>
                                            {formErrors.sales_rep_id &&
                                                <Typography variant="caption" color="error" sx={{ mt: .5 }}>{formErrors.sales_rep_id}</Typography>
                                            }
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            type="date"
                                            label="Date"
                                            name="date"
                                            value={shopOrderTransaction.date}
                                            onChange={onChangeInput}
                                            error={Boolean(formErrors.date)}
                                            helperText={formErrors.date}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                            <PersonSearchIcon color="primary" />
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Customer</Typography>
                                        </Stack>
                                        <Autocomplete
                                            fullWidth
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
                                                    error={Boolean(formErrors.requestor)}
                                                    helperText={formErrors.requestor}
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
                                    </Box>

                                    {submitLoadingAdd && <LinearProgress color="warning" />}

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            disabled={isAddDisabled}
                                            onClick={saveOrderTransaction}
                                            size="large"
                                            startIcon={<AddShoppingCartIcon />}
                                        >
                                            Next
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>

                            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #e5e7eb' }}>
                                <Stack spacing={2}>
                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <StorefrontIcon color="primary" />
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Order Summary</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">
                                            Quick review before moving to products.
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Shop</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{getSelectedShopName()}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Customer Type</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{getSelectedCustomerType()}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Sales Representative</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{getSelectedSalesRep()}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Customer</Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: .25 }}>
                                            <Typography sx={{ fontWeight: 700 }}>{selectedCustomer ? getCustomerName(selectedCustomer) : 'Not selected'}</Typography>
                                            {selectedCustomer && getVipCustomerColors(selectedCustomer).length > 0 &&
                                                <Stack direction="row" spacing={0.75} alignItems="center">
                                                    {renderVipColorDots(selectedCustomer)}
                                                    <Typography variant="caption" sx={{ color: '#495057', fontWeight: 700 }}>VIP</Typography>
                                                </Stack>
                                            }
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Date</Typography>
                                        <Typography sx={{ fontWeight: 700 }}>{moment(shopOrderTransaction.date).format("MMMM DD, YYYY")}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default AddCustomerOrderTransactionV2
