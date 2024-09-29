import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import ModeOfPaymentService from "../OtherService/ModeOfPaymentService"
import { Form } from 'react-bootstrap';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';

const PaymentTypeSales = () => {

    const { id } = useParams();


    useEffect(() => {
        fetchShopOrderTransactionList();
    }, []);

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

    const [date, setDate] = useState({
        id: 0,
        newDate: ''
    });

    const [count, setCount] = useState(0);

    const [open, setOpen] = React.useState(false);
    const [openPickUp, setOpenPickUp] = React.useState(false);
    const handleClosePickUp = () => setOpen(false);

    const [shopOrderTransaction, setShopOrderTransaction] = useState({
        data: [],
        payment: [],
        code: '',
        message: '',
        total_price: 0,
        total_profit: 0
    });

    const [shopOrderTransactionUpdateModal, setShopOrderTransactionUpdateModal] = useState({
        id: 0,
        payment_type_id: 0,
        shop_order_transaction_id: 0,
        amount: 0,
        is_paid: 0
    });


    const onChangePaymentTypeStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_paid: 1 });
            } else {
                setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_paid: 0 });
            }
        } else {
            setShopOrderTransactionUpdateModal({ ...shopOrderTransactionUpdateModal, is_paid: e.target.value });
        }
    }

    const fetchTransaction = async (id) => {
        await ModeOfPaymentService.get(id)
            .then(response => {
                console.log("fetchTransaction", response.data);
                setShopOrderTransactionUpdateModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }



    const fetchShopOrderTransactionList = () => {
        var valueParam = id.split("+");
        console.log('pieces', valueParam);
        console.log('date', valueParam[1]);

        if (valueParam[1] === '') {
            console.log('empty');
            valueParam[1] = 0;
        } else {
            console.log('non empty');
        }

        ShopOrderTransactionService.fetchOnlineShopOrderTransactionListByIdDate(valueParam[0], valueParam[1])
            .then(response => {
                // setShopOrderTransactionList(response.data);
                setShopOrderTransaction(response.data);
                setCount(filterByPaid(response.data.data).length)
            })
            .catch(e => {
                console.log("error", e)

            });
    }

    const filterByPaid = (shopOrderTransaction2) => {
        return shopOrderTransaction2.filter(s => s.is_paid == 1);
    };

    const handleOpenPickUp = (id, e) => {
        console.log('e', id);
        fetchTransaction(id);
        setOpenPickUp(true);
    }

    const updateDate = () => {
        ModeOfPaymentService.updatePaidStatus(shopOrderTransactionUpdateModal.id, shopOrderTransactionUpdateModal)
            .then(response => {
                fetchShopOrderTransactionList();
                setOpen(false);
                setOpenPickUp(false);
            })
            .catch(e => {
                console.log(e);
            });
    }



    return (
        <div>
            <div style={{ width: 300 }}>

                {
                    shopOrderTransaction.payment.map((payment, index) => (
                        <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label style={{ fontWeight: 'bold' }}> {payment.payment_type} {payment.payment_type_description}</Form.Label>
                            <Form.Control type="text" value={"₱ " + payment.total_amount} />
                        </Form.Group>
                    )
                    )
                }

                <Form.Group className="mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label style={{ fontWeight: 'bold' }}> Count</Form.Label>
                    <Form.Control type="text" value={filterByPaid(shopOrderTransaction.data).length + "/" + shopOrderTransaction.data.length} />
                </Form.Group>

            </div>

            <div>
            </div>

            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Shop Name</th>
                        <th>Customer Type</th>
                        <th>Customer</th>
                        <th>Total Quantity</th>
                        <th>Total Cash</th>
                        <th>Total Online</th>
                        <th>Total Amount</th>
                        <th>Profit</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Payment Record</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        shopOrderTransaction.data.map((shopOrderTransaction, index) => (
                            <tr key={shopOrderTransaction.id} >
                                <td>{shopOrderTransaction.id}</td>
                                <td>{shopOrderTransaction.shop_name}</td>
                                <td>{shopOrderTransaction.customer_type}</td>
                                <td>{shopOrderTransaction.requestor_name}</td>
                                <td>{shopOrderTransaction.shop_order_transaction_total_quantity}</td>
                                <td>{shopOrderTransaction.total_cash}</td>
                                <td>{shopOrderTransaction.total_online}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.shop_order_transaction_total_price}</td>
                                <td style={{ fontWeight: 'bold', }}>{shopOrderTransaction.profit}</td>
                                <td>{shopOrderTransaction.date}</td>
                                <td>{shopOrderTransaction.status === 1 ? <p style={{ fontWeight: 'bold', color: 'green', }}>COMPLETED</p>
                                    : shopOrderTransaction.status === 2 ? <p style={{ fontWeight: 'bold', color: 'orange', }}>PENDING</p> :
                                        <p style={{ fontWeight: 'bold', color: 'red', }}>CANCELLED</p>}</td>
                                <td>
                                    {shopOrderTransaction.is_paid === 1 ? <CheckIcon style={{ color: 'green', }} /> :
                                        <CloseIcon style={{ color: 'red', }} />}
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpenPickUp(shopOrderTransaction.id, e)} />
                                    </IconButton>
                                </td>
                                <td>
                                    <Link variant="primary" to={"../shopOrderTransaction/completedShopOrderTransaction/" + shopOrderTransaction.shop_order_transaction_id}   >
                                        <Button variant="primary" >
                                            View
                                        </Button>
                                    </Link>
                                </td>
                            </tr>

                        )
                        )
                    }
                </tbody>
            </table>

            <Modal
                keepMounted
                open={openPickUp}
                onClose={handleClosePickUp}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Status
                    </Typography>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Payment confirm ? </Form.Label>

                        <Checkbox
                            checked={shopOrderTransactionUpdateModal.is_paid === 0 ? false : true}
                            onChange={onChangePaymentTypeStatus}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Form.Group>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary" onClick={updateDate}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </div >
    )
}

export default PaymentTypeSales
