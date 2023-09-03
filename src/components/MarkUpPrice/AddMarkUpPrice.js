import React, { useState } from "react";
import { Alert } from 'react-bootstrap';
import MarkUpPriceServiceService from "./MarkUpPriceService.service";
import BranchStockTransactionService from "../OtherService/BranchStockTransactionService";

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
const AddMarkUpPrice = (props) => {

    const products = props.products;
    const [branchStockTransactionList, setBranchStockTransactionList] = useState([]);

    const [markUpPrice, setMarkUpPrice] = useState({
        id: 0,
        product_id: 0,
        product_name: '',
        quantity: 0,
        price: 0,
        mark_up_option: '',
        mark_up_price: 0,
        new_price: 0,
        status: 0,
        branch_stock_transaction_id: 0
    });

    const [markUpPriceRetail, setMarkUpPriceRetail] = useState({
        id: 0,
        product_id: 0,
        product_name: '',
        quantity: 0,
        price: 0,
        mark_up_option: '',
        mark_up_price: 0,
        new_price: 0,
        status: 0,
        branch_stock_transaction_id: 0
    });

    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        console.log(e.target.value);
        setMarkUpPrice({ ...markUpPrice, [e.target.name]: e.target.value });
    }

    const onChangeMarkUpPrice = (e) => {
        setMarkUpPrice({
            ...markUpPrice,
            mark_up_price: Number(e.target.value),
            new_price: Number(markUpPrice.price) + Number(e.target.value),
            profit: Number(e.target.value)
        });
    }

    const onChangeMarkUpPercentage = (e) => {
        const divisible = (markUpPrice.price / 100) * e.target.value;
        setMarkUpPrice({
            ...markUpPrice,
            mark_up_price: Number(e.target.value),
            new_price: markUpPrice.price + divisible,
            profit: divisible
        });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        fetchBranchStockWarehouseList(value.id);
        console.log('ey', value);
        setMarkUpPrice({
            ...markUpPrice,
            product_id: value.id,
            product_name: value.product_name,
            quantity: value.quantity,
            price: value.price,
            business_type: "WHOLESALE"
        });

        setMarkUpPriceRetail({
            ...markUpPriceRetail,
            product_id: value.id,
            product_name: value.product_name,
            quantity: value.quantity,
            price: Math.ceil(value.price / value.quantity)

        });
    }

    const handleWarehouseChange = (e, value) => {
        e.persist();
        console.log(value);
        setMarkUpPrice({
            ...markUpPrice,
            branch_stock_transaction_id: value.id,
        });

        setMarkUpPriceRetail({
            ...markUpPriceRetail,
            branch_stock_transaction_id: value.id,
            business_type: "RETAIL"
        });
    }

    const onChangeInputRetail = (e) => {
        console.log(e.target.value);
        setMarkUpPriceRetail({ ...markUpPriceRetail, [e.target.name]: e.target.value });
    }

    const onChangeMarkUpPriceRetail = (e) => {
        setMarkUpPriceRetail({
            ...markUpPriceRetail,
            mark_up_price: Number(e.target.value),
            new_price: Number(markUpPriceRetail.price) + Number(e.target.value),
            profit: Number(e.target.value)
        });
    }

    const onChangeMarkUpPercentageRetail = (e) => {
        const divisible = (markUpPriceRetail.price / 100) * e.target.value;
        setMarkUpPriceRetail({
            ...markUpPriceRetail,
            mark_up_price: Number(e.target.value),
            new_price: Math.ceil(markUpPriceRetail.price + divisible),
            profit: divisible
        });
    }




    const fetchBranchStockWarehouseList = ($id) => {
        BranchStockTransactionService.fetchBranchStockWarehouseList($id)
            .then(response => {
                console.log(response.data);
                setBranchStockTransactionList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const saveMarkUpPrice = (event) => {
        event.preventDefault();
        MarkUpPriceServiceService.sanctum().then(response => {
            MarkUpPriceServiceService.create(markUpPrice)
                .then(response => {
                    props.onSaveMarkUpPriceData(markUpPrice);
                    console.log('markUpPrice', markUpPrice);
                    setMessage(true);
                    // setMarkUpPrice({
                    //     product_name: ''
                    // });
                })
                .catch(e => {
                    console.log(e);
                });
            if (markUpPrice.quantity > 1) {
                MarkUpPriceServiceService.saveMarkUp(markUpPriceRetail)
                    .then(response => {
                        props.onSaveMarkUpPriceData(markUpPriceRetail);
                        console.log('markUpPriceRetail', markUpPriceRetail);
                        setMessage(true);
                        // setMarkUpPrice({
                        //     product_name: ''
                        // });
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        });
    }

    return (
        <div>
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
            <Box
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            // onSubmit={saveOrderSupplier}
            >
                <br></br>
                <h1>Wholesale</h1>
                <form onSubmit={saveMarkUpPrice} >
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={products}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(products) => products.product_name + ' - ' + (products.weight) + 'kg' + ' (₱' + (products.price) + ')'}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Product" variant="standard" />
                            )}
                        />
                    </FormControl>
                    <br></br>
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={branchStockTransactionList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleWarehouseChange}
                            // getOptionLabel={(branchStockTransactionList) => branchStockTransactionList.warehouse_name + ' - ' + ' (Stock : ' + (branchStockTransactionList.branch_stock_transaction) + ')'}
                            getOptionLabel={(branchStockTransactionList) => branchStockTransactionList.warehouse_name}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Warehouse" variant="standard" />
                            )}
                        />
                    </FormControl>
                    <br></br>
                    <FormControl variant="standard" >
                        <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                        <Input
                            className="mb-3"
                            id="filled-required"
                            label="Price"
                            variant="filled"
                            name='price'
                            disabled
                            value={markUpPrice.price}
                            onChange={onChangeInput}
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>
                    <br></br>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Mark Up Option</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            className="mb-3"
                            id="demo-simple-select"
                            value={markUpPrice.mark_up_option}
                            name='mark_up_option'
                            label="Mark Up Option"
                            onChange={onChangeInput}
                        >
                            <MenuItem value='PERCENTAGE'>PERCENTAGE</MenuItem>
                            <MenuItem value='AMOUNT'>AMOUNT</MenuItem>
                        </Select>
                    </FormControl>
                    <br></br>

                    {markUpPrice.mark_up_option === 'AMOUNT' ? (
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
                    ) : markUpPrice.mark_up_option === 'PERCENTAGE' ? (
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
                            value={markUpPrice.new_price}
                            onChange={onChangeInput}
                            disabled
                            startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                        />
                    </FormControl>
                    <br></br>
                    {/* retail */}
                    {markUpPrice.quantity > 1 ? (
                        <div>
                            <h1>Retail</h1>
                            <FormControl variant="standard" >
                                <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                                <Input
                                    className="mb-3"
                                    id="filled-required"
                                    label="Price"
                                    variant="filled"
                                    name='price'
                                    disabled
                                    value={markUpPriceRetail.price}
                                    onChange={onChangeInputRetail}
                                    startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                                />
                            </FormControl>
                            <br></br>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Mark Up Option</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    className="mb-3"
                                    id="demo-simple-select"
                                    value={markUpPriceRetail.mark_up_option}
                                    name='mark_up_option'
                                    label="Mark Up Option"
                                    onChange={onChangeInputRetail}
                                >
                                    <MenuItem value='PERCENTAGE'>PERCENTAGE</MenuItem>
                                    <MenuItem value='AMOUNT'>AMOUNT</MenuItem>
                                </Select>
                            </FormControl>
                            <br></br>

                            {markUpPriceRetail.mark_up_option === 'AMOUNT' ? (
                                <FormControl variant="standard" >
                                    <InputLabel htmlFor="standard-adornment-amount">Mark Up Adjustment Price</InputLabel>
                                    <Input
                                        className="mb-3"
                                        id="filled-required"
                                        label="Mark Up Price"
                                        variant="filled"
                                        name='mark_up_price'
                                        // value={markUpPriceRetail.mark_up_price}
                                        onChange={onChangeMarkUpPriceRetail}
                                        startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                                    />
                                </FormControl>
                            ) : markUpPriceRetail.mark_up_option === 'PERCENTAGE' ? (
                                <FormControl variant="standard" >
                                    <InputLabel htmlFor="standard-adornment-amount">Mark Up Adjustment Percentage</InputLabel>
                                    <Input
                                        className="mb-3"
                                        id="filled-required"
                                        label="Mark Up Price"
                                        variant="filled"
                                        name='mark_up_percentage'
                                        // value={markUpPriceRetail.mark_up_price}
                                        onChange={onChangeMarkUpPercentageRetail}
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
                                    value={markUpPriceRetail.new_price}
                                    onChange={onChangeInputRetail}
                                    disabled
                                    startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                                />
                            </FormControl>

                            <br></br>
                        </div>

                    ) : (
                        <div></div>
                    )}

                    <br></br>
                    <div>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </div>
                    <br></br>
                </form>
            </Box>
            <br></br>

        </div >
    )
}

export default AddMarkUpPrice
