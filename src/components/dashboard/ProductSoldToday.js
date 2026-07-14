import React, { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';

import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import ProductSoldDailyService from "../OtherService/ProductSoldDailyService";
import CheckListTransactionService from "../CheckList/CheckListTransactionService";
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import LinearProgress from '@mui/material/LinearProgress';
import moment from "moment";

const ProductSoldToday = () => {


    useEffect(() => {
        fetchsortedQuantityList();
    }, []);

    const [status, setStatus] = useState(0);

    const [date, setDate] = useState({
        today: moment().format("YYYY-MM-DD")
    });

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });


    const [sortedQuantity, setSortedQuantity] = useState({
        data: [],
        code: '',
        message: '',
        id: 0
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [isRejectPendingLoading, setIsRejectPendingLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const onChangeInput = (e) => {
        console.log("status", e.target.value);
        setStatus(e.target.value);
    }


    const validate = (values) => {
        const errors = {};
        if (status == 0) {
            errors.status = "Status Type is Required!";
        }

        return errors;
    }



    const submitSortedQuantityList = () => {
        console.log('status: ', status);
        console.log("count: ", Object.keys(validate(status)).length);
        console.log("validate: ", validate(status));
        setFormErrors(validate(status));
        if (Object.keys(validate(status)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ShopOrderTransactionService.fetchProductSoldToday(date)
                .then(response => {
                    setValidator({
                        severity: 'success',
                        message: 'Product Sold Submitted!',
                        isShow: true,
                    });
                    console.log("response.data", response.data)
                    // setsortedQuantityList(response.data);
                    setSortedQuantity(response.data);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    console.log("sortedQuantity", sortedQuantity)
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);

                });
        }
    }

    const fetchsortedQuantityList = () => {
        ShopOrderTransactionService.fetchProductSoldToday(date)
            .then(response => {
                console.log("response.data", response.data)
                // setsortedQuantityList(response.data);
                setSortedQuantity(response.data);

            })
            .catch(e => {
                console.log("error", e)

            });

    }

    const submitEndofDay = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        ProductSoldDailyService.sanctum().then(response => {
            ProductSoldDailyService.create(date)
                .then(response => {
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                    setValidator({
                        severity: 'success',
                        message: 'Product Sold Submitted!',
                        isShow: true,
                    });
                })
                .catch(e => {
                    console.log(e);
                });
        });
    }

    const endOfDayCheckList = async () => {
        const shouldRejectPending = window.confirm(
            "End the day checklist and reject all pending checklist transactions?"
        );

        if (!shouldRejectPending) {
            return;
        }

        setIsRejectPendingLoading(true);
        setValidator(previous => ({ ...previous, isShow: false }));

        try {
            await CheckListTransactionService.sanctum();
            const response = await CheckListTransactionService.rejectPending();
            setValidator({
                severity: 'success',
                message: response.data?.message || 'End of day checklist completed successfully!',
                isShow: true,
            });
        } catch (error) {
            console.error("Reject pending checklist transactions error:", error);
            setValidator({
                severity: 'error',
                message: error.response?.data?.message || 'Unable to end the day checklist. Please try again.',
                isShow: true,
            });
        } finally {
            setIsRejectPendingLoading(false);
        }
    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
        textAlign: "center",
    }));
    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const productSales = Array.isArray(sortedQuantity.data) ? sortedQuantity.data : [];


    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>

            <Paper
                elevation={0}
                sx={{
                    maxWidth: 1100,
                    mx: 'auto',
                    overflow: 'hidden',
                    border: '1px solid #e6e0da',
                    borderRadius: 3,
                    bgcolor: '#fff',
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ sm: 'center' }}
                    justifyContent="space-between"
                    sx={{ px: { xs: 2.5, md: 3.5 }, py: 2.75, borderBottom: '1px solid #eee7e0' }}
                >
                    <Stack direction="row" spacing={1.75} alignItems="center">
                        <Box sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 2.25, bgcolor: '#f6eadf', color: '#8a573a' }}>
                            <Inventory2RoundedIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#3f332d' }}>
                                Product Sales
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Products sold for {moment(date.today).format('MMMM D, YYYY')}
                            </Typography>
                        </Box>
                    </Stack>
                    <Chip
                        label={`${productSales.length} product${productSales.length === 1 ? '' : 's'}`}
                        sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, bgcolor: '#f4eee8', color: '#6d4937', fontWeight: 700 }}
                    />
                </Stack>

                <Box sx={{ overflowX: 'auto' }}>
                    <Box
                        component="table"
                        sx={{
                            width: '100%',
                            minWidth: 720,
                            borderCollapse: 'collapse',
                            '& th': {
                                px: 2.5,
                                py: 1.6,
                                bgcolor: '#4e342e',
                                color: '#fff',
                                fontSize: 13,
                                fontWeight: 700,
                                textAlign: 'left',
                                whiteSpace: 'nowrap',
                            },
                            '& td': {
                                px: 2.5,
                                py: 1.75,
                                borderBottom: '1px solid #f0ebe6',
                                color: '#403833',
                            },
                            '& tbody tr:last-of-type td': { borderBottom: 0 },
                            '& tbody tr:hover': { bgcolor: '#fcfaf7' },
                        }}
                    >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product Name</th>
                                <th>Discrepancy (PC)</th>
                                <th>Sold (WS/BOX)</th>
                                <th>Sold (PC)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productSales.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <Stack alignItems="center" spacing={1} sx={{ py: 5, color: 'text.secondary' }}>
                                            <Inventory2RoundedIcon sx={{ fontSize: 36, color: '#c9bcb1' }} />
                                            <Typography sx={{ fontWeight: 700, color: '#4b403a' }}>No product sales available</Typography>
                                            <Typography variant="body2">Sales will appear here once records are available.</Typography>
                                        </Stack>
                                    </td>
                                </tr>
                            ) : productSales.map((product) => {
                                const discrepancy = Number(product.discrepancy) || 0;
                                return (
                                    <tr key={product.mark_up_product_id || product.id}>
                                        <td><Typography component="span" sx={{ fontWeight: 700 }}>#{product.id}</Typography></td>
                                        <td><Typography component="span" sx={{ fontWeight: 650 }}>{product.product_name}</Typography></td>
                                        <td>
                                            <Chip
                                                size="small"
                                                label={discrepancy}
                                                sx={{
                                                    minWidth: 42,
                                                    fontWeight: 750,
                                                    color: discrepancy > 0 ? '#a33f34' : '#397047',
                                                    bgcolor: discrepancy > 0 ? '#fdecea' : '#eaf4ec',
                                                }}
                                            />
                                        </td>
                                        <td>{Math.floor(product.total_quantity / product.quantity)}</td>
                                        <td><Typography component="span" sx={{ fontWeight: 750, color: '#7b4f35' }}>{product.total_quantity}</Typography></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    maxWidth: 900,
                    mx: 'auto',
                    mt: 4,
                    overflow: 'hidden',
                    border: '1px solid #e6e0da',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #fffdf9 0%, #f8f4ee 100%)',
                }}
            >
                {(submitLoadingAdd || isRejectPendingLoading) && <LinearProgress color="warning" />}
                <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#4e342e' }}>
                        End of Day Actions
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, mb: 3, color: 'text.secondary' }}>
                        Complete product sales first, then close any pending checklist transactions.
                    </Typography>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1, p: 2.25, bgcolor: '#fff', border: '1px solid #eee5dc', borderRadius: 2.5 }}>
                            <Typography sx={{ fontWeight: 750, color: '#3f332d' }}>Product sales</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', minHeight: 40, mt: 0.5, mb: 2 }}>
                                Save today&apos;s sold-product totals and finish the sales record.
                            </Typography>
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                disabled={isAddDisabled || isRejectPendingLoading}
                                onClick={submitEndofDay}
                                startIcon={submitLoadingAdd ? <CircularProgress size={18} color="inherit" /> : <EventAvailableRoundedIcon />}
                                sx={{ py: 1.15, bgcolor: '#7b4f35', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#65402b' } }}
                            >
                                {submitLoadingAdd ? 'Ending Day...' : 'End of Day'}
                            </Button>
                        </Box>

                        <Box sx={{ flex: 1, p: 2.25, bgcolor: '#fff', border: '1px solid #f0d8d5', borderRadius: 2.5 }}>
                            <Typography sx={{ fontWeight: 750, color: '#3f332d' }}>Daily checklist</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', minHeight: 40, mt: 0.5, mb: 2 }}>
                                Close the checklist and reject all transactions still marked pending.
                            </Typography>
                            <Button
                                fullWidth
                                size="large"
                                variant="outlined"
                                color="error"
                                disabled={isRejectPendingLoading || isAddDisabled}
                                onClick={endOfDayCheckList}
                                startIcon={isRejectPendingLoading ? <CircularProgress size={18} color="inherit" /> : <FactCheckRoundedIcon />}
                                sx={{ py: 1.15, fontWeight: 700, textTransform: 'none' }}
                            >
                                {isRejectPendingLoading ? 'Ending Checklist...' : 'End of Day Checklist'}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Paper>
            <br></br>


        </div >
    )
}

export default ProductSoldToday
