import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "./ShopOrderTransactionService";
import { styled } from '@mui/material/styles';
import { Form } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';

import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import PageviewIcon from '@mui/icons-material/Pageview';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

import LinearProgress from '@mui/material/LinearProgress';

const QuantitySorted = () => {


    useEffect(() => {
        fetchsortedQuantityList();
    }, []);

    const [status, setStatus] = useState(0);

    const [sortedQuantity, setSortedQuantity] = useState({
        data: [],
        code: '',
        message: '',
        id: 0
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
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
            ShopOrderTransactionService.fetchSortedProduct(status)
                .then(response => {
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
        ShopOrderTransactionService.fetchSortedProduct(status)
            .then(response => {
                console.log("response.data", response.data)
                // setsortedQuantityList(response.data);
                setSortedQuantity(response.data);
            })
            .catch(e => {
                console.log("error", e)

            });

    }

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));



    return (
        <div>
            <Div>{"Product Sorted"}
            </Div>
            <Form>
                {formErrors.status && <p style={{ color: "red" }}>{formErrors.status}</p>}
                {/* <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeInput} />
                    </Form.Group> */}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Choose</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            label="Status"
                            name="status"
                            onChange={onChangeInput}
                        >
                            <MenuItem disabled value="" style={{ fontWeight: 'bold' }}>
                                <em>Quantity</em>
                            </MenuItem>
                            <MenuItem value="1" style={{ fontWeight: 'bold', color: 'green', }}>Highest to Lowest</MenuItem>
                            <MenuItem value="2" style={{ color: 'red', }}>Lowest to Highest</MenuItem>
                            <MenuItem disabled value="" style={{ fontWeight: 'bold' }}>
                                <em>Amount</em>
                            </MenuItem>
                            <MenuItem value="3" style={{ color: 'green', }}>Highest to Lowest</MenuItem>
                            <MenuItem value="4" style={{ color: 'red', }}>Lowest to Highest</MenuItem>

                        </Select>
                    </FormControl>
                </Box>

                <Button variant="primary"
                    onClick={submitSortedQuantityList}
                    disabled={isAddDisabled}
                >
                    Find
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
                <br></br>
            </Form>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Type</th>
                        <th>Product Name</th>
                        <th>Profit</th>
                        <th>Amount</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                {sortedQuantity.data.length == 0 ?
                    (<tr style={{ color: "red" }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>
                            {
                                sortedQuantity.data.map((data, index) => (
                                    <tr key={data.mark_up_product_id} >
                                        <td>{data.id}</td>
                                        <td>{data.business_type}</td>
                                        <td>{data.product_name}</td>
                                        <td>{data.total_profit}</td>
                                        {sortedQuantity.id == 3 || sortedQuantity.id == 4 ? <td style={{ fontWeight: 'bold', }}>{data.total_price}</td> : <td >{data.total_price}</td>}
                                        {/* <td style={{ fontWeight: 'bold', }}>{sortedQuantity.total_quantity}</td> */}
                                        {sortedQuantity.id == 0 || sortedQuantity.id == 1 || sortedQuantity.id == 2 ? <td style={{ fontWeight: 'bold', }}>{data.total_quantity}</td> : <td >{data.total_quantity}</td>}
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>

        </div >
    )
}

export default QuantitySorted
