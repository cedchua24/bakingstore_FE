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
        <Box sx={{ bgcolor: '#f6f7f9', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
            <Box sx={{ width: 'min(960px, calc(100% - 32px))', mx: 'auto' }}>
                <Paper elevation={0} sx={{ borderRadius: 1, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <Box sx={{ bgcolor: '#2f201b', color: '#fff', px: { xs: 2, md: 3 }, py: 2.5 }}>
                        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ bgcolor: 'rgba(255,255,255,.14)', borderRadius: 1, p: 1, display: 'flex' }}>
                                    <StorefrontIcon />
                                </Box>
                                <Box>
                                    <Typography variant="overline" sx={{ color: '#f3c58b', letterSpacing: 0 }}>Shop Order</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
                                        Create Transaction
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ px: { xs: 2, md: 3 }, py: 3 }}>
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
                                sx={{ fontWeight: 800, minWidth: 140 }}
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
