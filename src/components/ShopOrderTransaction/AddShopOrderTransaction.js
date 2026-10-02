import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShopOrderTransactionService from "./ShopOrderTransactionService";

const AddShopOrderTransaction = (props) => {
    const navigate = useNavigate();
    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        id: 0,
        shop_id: 0,
        shop_order_transaction_total_quantity: 0,
        shop_order_transaction_total_price: 0,
        customer_type_id: 0,
        date: '',
        requestor: 0,
        checker: 0,
        type: 1,
        sales_rep_id: 0,
        user_id: localStorage.getItem('auth_user_id'),
        created_at: '',
        updated_at: ''
    });

    const shopList = props.shopList;
    const userList = props.userList;

    const steps = [
        'Create Transaction Details',
        'Add Product Orders',
        'Finalize Orders',
    ];

    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        setShopOrderTransaction({ ...shopOrderTransaction, [e.target.name]: e.target.value });
    }

    const saveOrderTransaction = () => {
        console.log('orderTransaction test', shopOrderTransaction);
        ShopOrderTransactionService.sanctum().then(response => {
            ShopOrderTransactionService.create(shopOrderTransaction)
                .then(response => {
                    navigate('/shopOrderTransaction/addProductShopOrderTransaction/' + response.data.id);
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    return (
        <Box sx={{ bgcolor: '#f6f7f9', minHeight: '100vh', p: { xs: 1.5, md: 3 } }}>
            <Box sx={{ width: '100%', mx: 'auto' }}>
                <Paper elevation={0} sx={{ bgcolor: 'transparent', borderRadius: 0, overflow: 'visible' }}>
                    <Box sx={{ color: '#fff', px: { xs: 2.5, md: 3.5 }, py: 3.125, background: 'linear-gradient(125deg, #7f2828, #c94f4f)', borderRadius: '18px', boxShadow: '0 14px 30px rgba(127,40,40,.16)' }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,.12)', borderRadius: '14px', display: 'flex' }}>
                                    <StorefrontIcon />
                                </Box>
                                <Box>
                                    <Typography variant="overline" sx={{ color: '#ffd9d8', fontSize: '.7rem', fontWeight: 400, letterSpacing: '.12em', lineHeight: 1.2 }}>Inter Branch Order</Typography>
                                    <Typography component="h1" sx={{ mt: '3px', mb: '5px', fontSize: '1.55rem', fontWeight: 500, lineHeight: 1.15 }}>
                                        Add Inter Branch Order
                                    </Typography>
                                    <Typography sx={{ color: 'rgba(255,255,255,.78)', fontSize: '.84rem' }}>Create the branch transaction details before adding its products.</Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ mt: 2, px: { xs: 2, md: 3 }, py: 3, bgcolor: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px' }}>
                        {message &&
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Successfully added.
                            </Alert>
                        }

                        <Stepper activeStep={0} alternativeLabel sx={{ mb: 3 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                                gap: 2,
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="shop-order-shop-label">Shop Name</InputLabel>
                                <Select
                                    labelId="shop-order-shop-label"
                                    value={shopOrderTransaction.shop_id}
                                    label="Shop Name"
                                    name="shop_id"
                                    onChange={onChangeInput}
                                >
                                    {shopList.map((shop) => (
                                        <MenuItem key={shop.id} value={shop.id}>{shop.shop_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                type="date"
                                name="date"
                                label="Date"
                                value={shopOrderTransaction.date}
                                onChange={onChangeInput}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />

                            <FormControl fullWidth>
                                <InputLabel id="shop-order-requestor-label">Requestor</InputLabel>
                                <Select
                                    labelId="shop-order-requestor-label"
                                    value={shopOrderTransaction.requestor}
                                    label="Requestor"
                                    name="requestor"
                                    onChange={onChangeInput}
                                >
                                    {userList.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="shop-order-checker-label">Checker</InputLabel>
                                <Select
                                    labelId="shop-order-checker-label"
                                    value={shopOrderTransaction.checker}
                                    label="Checker"
                                    name="checker"
                                    onChange={onChangeInput}
                                >
                                    {userList.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                onClick={saveOrderTransaction}
                                sx={{ bgcolor: '#ef6f6c', '&:hover': { bgcolor: '#c94f4f' }, fontWeight: 700, minWidth: 140 }}
                            >
                                Next
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default AddShopOrderTransaction
