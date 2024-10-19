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

import LinearProgress from '@mui/material/LinearProgress';

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

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});


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

    const validate = (values) => {
        const errors = {};
        if (markUpPrice.product_id == 0) {
            errors.product_id = "Product is Required!";
        }
        if (markUpPrice.branch_stock_transaction_id == 0) {
            errors.branch_stock_transaction_id = "Warehouse is Required!";
        }
        if (markUpPrice.mark_up_option.length == 0) {
            errors.mark_up_option = "Mark Up Wholesale is Required!";
        }
        if (markUpPrice.mark_up_price == 0) {
            errors.mark_up_price = "Mark Up Price is Required!";
        }

        if (markUpPrice.quantity > 1) {
            if (markUpPriceRetail.mark_up_option.length == 0) {
                errors.mark_up_option_retail = "Mark Up Option is Required!";
            }
            if (markUpPriceRetail.mark_up_price == 0) {
                errors.mark_up_price_retail = "Mark Up Price is Required!";
            }

        }

        return errors;
    }


    const saveMarkUpPrice = (event) => {
        event.preventDefault();

        console.log("count: ", Object.keys(validate(markUpPrice)).length);
        console.log("validate: ", validate(markUpPrice));
        setFormErrors(validate(markUpPrice));
        if (Object.keys(validate(markUpPrice)).length > 0) {
            console.log("Has Validation: ");

        } else {
            console.log("Ready for saving: ");
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);

            MarkUpPriceServiceService.sanctum().then(response => {
                MarkUpPriceServiceService.create(markUpPrice)
                    .then(response => {
                        props.onSaveMarkUpPriceData(markUpPrice);
                        console.log('markUpPrice', markUpPrice);

                        // setMarkUpPrice({
                        //     product_name: ''
                        // });
                        if (markUpPrice.quantity > 1) {
                            MarkUpPriceServiceService.saveMarkUp(markUpPriceRetail)
                                .then(response => {

                                    props.onSaveMarkUpPriceData(markUpPriceRetail);
                                    console.log('markUpPriceRetail', markUpPriceRetail);
                                    setMessage(true);
                                    // setMarkUpPrice({
                                    //     product_name: ''
                                    // });
                                    setSubmitLoadingAdd(false);
                                    setIsAddDisabled(false);
                                    window.scrollTo(0, 0);
                                })
                                .catch(e => {
                                    console.log(e);
                                    setSubmitLoadingAdd(false);
                                    setIsAddDisabled(false);
                                    window.scrollTo(0, 0);
                                });
                        } else {
                            setMessage(true);
                            setSubmitLoadingAdd(false);
                            setIsAddDisabled(false);
                            window.scrollTo(0, 0);
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        window.scrollTo(0, 0);
                    });

            });
        }

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
                    {formErrors.product_id && <p style={{ color: "red" }}>{formErrors.product_id}</p>}
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

                    {formErrors.branch_stock_transaction_id && <p style={{ color: "red" }}>{formErrors.branch_stock_transaction_id}</p>}
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
                    {formErrors.mark_up_option && <p style={{ color: "red" }}>{formErrors.mark_up_option}</p>}
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
                    {formErrors.mark_up_price && <p style={{ color: "red" }}>{formErrors.mark_up_price}</p>}
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
                                    value={markUpPriceRetail.price}
                                    onChange={onChangeInputRetail}
                                    startAdornment={<InputAdornment position="start">₱</InputAdornment>}
                                />
                            </FormControl>
                            <br></br>
                            {formErrors.mark_up_option_retail && <p style={{ color: "red" }}>{formErrors.mark_up_option_retail}</p>}
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
                            {formErrors.mark_up_price_retail && <p style={{ color: "red" }}>{formErrors.mark_up_price_retail}</p>}
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
                            disabled={isAddDisabled}
                        >
                            Submit
                        </Button>
                    </div>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                </form>
            </Box>
            <br></br>

        </div >
    )
}

export default AddMarkUpPrice
