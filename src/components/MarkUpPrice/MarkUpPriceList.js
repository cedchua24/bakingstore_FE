import React, { useState } from "react";
// import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import MarkUpPriceService from "./MarkUpPriceService.service";

import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress';

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


const MarkUpPriceList = (props) => {

    const markupPriceList = props.markupPriceList;
    const deleteMarkUpPrice = props.deleteMarkUpPrice;

    const [submitLoading, setSubmitLoading] = useState(false);
    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

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
    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchMarkUp(id);
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const [markUpModal, setMarkUpModal] = useState({
        id: 0,
        product_id: 0,
        branch_stock_transaction_id: 0,
        price: 0,
        product_name: '',
        mark_up_option: '',
        mark_up_price: 0,
        new_price: 0,
        profit: 0,
        status: 0,
        business_type: ''
    });

    const onChangeInputQuantityModal = (e) => {
        e.persist();
        setMarkUpModal({
            ...markUpModal,
            user_id: localStorage.getItem('auth_user_id'),
            shop_order_quantity: e.target.value,
        });
    }
    const onChangeInput = (e) => {
        console.log(e.target.value);
        setMarkUpModal({ ...markUpModal, [e.target.name]: e.target.value });
    }

    const onChangeMarkUpPrice = (e) => {
        setMarkUpModal({
            ...markUpModal,
            mark_up_price: Number(e.target.value),
            new_price: Number(markUpModal.price) + Number(e.target.value),
            profit: Number(e.target.value)
        });
    }

    const onChangeMarkUpPercentage = (e) => {
        const divisible = (markUpModal.price / 100) * e.target.value;
        setMarkUpModal({
            ...markUpModal,
            mark_up_price: Number(e.target.value),
            new_price: markUpModal.price + divisible,
            profit: divisible
        });
    }

    const fetchMarkUp = async (id) => {
        await MarkUpPriceService.get(id)
            .then(response => {
                setMarkUpModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const updateOrderSupplier = () => {
        setSubmitLoading(true);
        MarkUpPriceService.update(markUpModal.id, markUpModal)
            .then(response => {
                if (response.data.code == 200) {
                    setSubmitLoading(false);
                    setOpen(false);
                    window.scrollTo(0, 0);
                    setValidator({
                        severity: 'success',
                        message: 'Successfuly Added!',
                        isShow: true,
                    });
                    // fetchProductList();
                } else if (response.data.code == 400) {
                    setSubmitLoading(false);
                    setOpen(false);
                    window.scrollTo(0, 0);
                    setValidator({
                        severity: 'error',
                        message: response.data.message,
                        isShow: true,
                    });
                } else {
                    setSubmitLoading(false);
                    setOpen(false);
                    setValidator({
                        severity: 'error',
                        message: "Unknown Error",
                        isShow: true,
                    });
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product Name </th>
                        <th>Warehouse Name </th>
                        <th>Supplier Price </th>
                        {/* <th>Mark Up Type</th> */}
                        <th>Mark Up Price</th>
                        {/* <th>Descrepancy</th> */}
                        <th>New Price</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {
                        markupPriceList.map((mark_up, index) => (
                            <tr key={mark_up.id} >
                                <td>{mark_up.id}</td>
                                <td>{mark_up.product_name}</td>
                                <td>{mark_up.warehouse_name}</td>
                                <td>{'₱ ' + mark_up.price + '.00'}</td>
                                {/* <td>{mark_up.mark_up_option}</td> */}
                                <td>{mark_up.mark_up_option === 'PERCENTAGE' ? mark_up.mark_up_price + '% / ' + '₱ ' + (Number(mark_up.new_price) - Number(mark_up.price)) + '.00' : '₱ ' + mark_up.mark_up_price + '.00'}</td>
                                {/* <td>{'₱ ' + (Number(mark_up.new_price) - Number(mark_up.price)) + '.00'}</td> */}
                                <td style={{ fontWeight: 'bold' }}>{'₱ ' + mark_up.new_price}{mark_up.new_price % 1 === 0 ? '.00' : ''}</td>
                                <td>
                                    <Tooltip title="Update">
                                        <IconButton>
                                            <UpdateIcon color="primary" onClick={(e) => handleOpen(mark_up.id, e)} />
                                        </IconButton>
                                    </Tooltip>
                                </td>
                                <td>
                                    <Link variant="primary" to={"/editMarkUp/" + mark_up.id}   >
                                        <Button variant="primary" >
                                            Update
                                        </Button>
                                    </Link>
                                </td>
                                <td>
                                    <Button variant="danger" onClick={(e) => deleteMarkUpPrice(mark_up.id, e)} >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

            <br></br>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Update Mark Up Price
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
                        value={markUpModal.product_name}
                    />

                    <TextField
                        disabled
                        id="filled-required"
                        label="Supplier Price"
                        variant="filled"
                        name='price'
                        value={markUpModal.price}
                    />
                    <br></br>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Mark Up Option</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            className="mb-3"
                            id="demo-simple-select"
                            value={markUpModal.mark_up_option}
                            name='mark_up_option'
                            label="Mark Up Option"
                            onChange={onChangeInput}
                        >
                            <MenuItem value='PERCENTAGE'>PERCENTAGE</MenuItem>
                            <MenuItem value='AMOUNT'>AMOUNT</MenuItem>
                        </Select>
                    </FormControl>
                    <br></br>
                    {/* <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-amount">Mark Up Price</InputLabel>
                        <Input
                            type='number'
                            id="filled-required"
                            label="Quantity"
                            variant="filled"
                            name='mark_up_price'
                            value={markUpModal.mark_up_price}
                            onChange={onChangeInputQuantityModal}
                        />
                    </FormControl> */}


                    {markUpModal.mark_up_option === 'AMOUNT' ? (
                        <FormControl variant="standard" >
                            <InputLabel htmlFor="standard-adornment-amount">Mark Up Adjustment Price</InputLabel>
                            <Input
                                className="mb-3"
                                id="filled-required"
                                label="Mark Up Price"
                                variant="filled"
                                name='mark_up_price'
                                // value={markUpPrice.mark_up_price}
                                onChange={onChangeMarkUpPrice}
                                startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                            />
                        </FormControl>
                    ) : markUpModal.mark_up_option === 'PERCENTAGE' ? (
                        <FormControl variant="standard" >
                            <InputLabel htmlFor="standard-adornment-amount">Mark Up Adjustment Percentage</InputLabel>
                            <Input
                                className="mb-3"
                                id="filled-required"
                                label="Mark Up Price"
                                variant="filled"
                                name='mark_up_percentage'
                                // value={markUpPrice.mark_up_price}
                                onChange={onChangeMarkUpPercentage}
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                            />
                        </FormControl>
                    ) : (
                        <div></div>
                    )}
                    <br></br>
                    <FormControl variant="standard" >
                        <InputLabel htmlFor="standard-adornment-amount">Mark Up Price</InputLabel>
                        <Input
                            className="mb-3"
                            id="filled-required"
                            label="Mark Up Price"
                            variant="filled"
                            name='new_price'
                            value={markUpModal.new_price}
                            onChange={onChangeInput}
                            disabled
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>

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
                            onClick={updateOrderSupplier}
                            size="large" >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default MarkUpPriceList
