import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import CategoryServiceService from "../Category/CategoryService.service";
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

const ReportCategorySales = () => {


    useEffect(() => {
        fetchsortedQuantityList();
        fetchCategoryList();
    }, []);

    const [categeryList, setCategoryList] = useState([]);
    const [role] = useState(localStorage.getItem('role_as'));

    const [productSortedDate, setProductSortedDate] = useState({
        categoryId: 0,
        type: '',
        status: 0,
        limit: 0,
        dateFrom: "",
        dateTo: ""
    });


    const [sortedQuantity, setSortedQuantity] = useState({
        data: [],
        code: '',
        message: '',
        id: 0
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const fetchCategoryList = () => {
        CategoryServiceService.getAll()
            .then(response => {
                setCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeInput = (e) => {
        console.log("status", e.target.value);
        console.log("status", e.target.name);
        setProductSortedDate({ ...productSortedDate, [e.target.name]: e.target.value });

    }


    const validate = (values) => {
        const errors = {};

        if (productSortedDate.categoryId == 0) {
            errors.categoryId = "Category is Required!";
        }
        if (productSortedDate.status == 0) {
            errors.status = "Status Type is Required!";
        }
        if (productSortedDate.limit == 0) {
            errors.limit = "Limit is Required!";
        }
        if (productSortedDate.dateFrom.length == 0) {
            errors.dateFrom = "Date From Required!";
        }
        if (productSortedDate.dateTo.length == 0) {
            errors.dateTo = "Date To Required!";
        }

        return errors;
    }



    const submitSortedQuantityList = () => {
        console.log('status: ', productSortedDate);
        console.log("count: ", Object.keys(validate(productSortedDate)).length);
        console.log("validate: ", validate(productSortedDate));
        setFormErrors(validate(productSortedDate));
        if (Object.keys(validate(productSortedDate)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            ShopOrderTransactionService.fetchSalesByCategory(productSortedDate)
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
        ShopOrderTransactionService.fetchSalesByCategory(productSortedDate)
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
        textAlign: "center",
    }));

    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { total_price }) => acc + total_price, 0));
    }
    const totalProfit = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { total_profit }) => acc + total_profit, 0));
    }


    return (
        <div>
            <div style={{ float: 'right', minWidth: 800 }}>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Sales: </Form.Label>
                    <Form.Control type="text" value={totalSum(sortedQuantity.data)} />
                </Form.Group>
                {
                    role == 2 && (
                        <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                            <Form.Label>Total Profit: </Form.Label>
                            <Form.Control type="text" value={totalProfit(sortedQuantity.data)} />
                        </Form.Group>
                    )
                }
            </div>
            <Form>
                {formErrors.categoryId && <p style={{ color: "red" }}>{formErrors.categoryId}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Category*</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="categoryId"
                            onChange={onChangeInput}
                        >
                            {
                                categeryList.map((category, index) => (
                                    <MenuItem value={category.id}>{category.category_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="type"
                            onChange={onChangeInput}
                        >
                            <MenuItem value='All'>All</MenuItem>
                            <MenuItem value='WHOLESALE'>WHOLESALE</MenuItem>
                            <MenuItem value='RETAIL'>RETAIL</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {formErrors.status && <p style={{ color: "red" }}>{formErrors.status}</p>}
                {/* <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" name="date" onChange={onChangeInput} />
                    </Form.Group> */}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Order*</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
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
                {formErrors.limit && <p style={{ color: "red" }}>{formErrors.limit}</p>}
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="demo-simple-select-label">Limit*</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Limit"
                            name="limit"
                            onChange={onChangeInput}
                        >
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="50" >50</MenuItem>
                            <MenuItem value="100" >100</MenuItem>
                            <MenuItem value="200" >200</MenuItem>
                            <MenuItem value="500" >500</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {formErrors.dateFrom && <p style={{ color: "red" }}>{formErrors.dateFrom}</p>}
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From*:</Form.Label>
                    <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                </Form.Group>
                {formErrors.dateTo && <p style={{ color: "red" }}>{formErrors.dateTo}</p>}
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To*:</Form.Label>
                    <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                </Form.Group>
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
            <legend align="center" style={{ fontWeight: 'bold' }} > Category Sales List   </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Type</th>
                        <th>Product Name</th>
                        {
                            role == 2 && (
                                <th>Profit</th>
                            )
                        }
                        <th>Amount</th>
                        <th>Qty WS</th>
                        <th>Qty RTL</th>
                        <th>Sold</th>
                        <th>Current Stock</th>
                        <th>Diff</th>
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
                                        {
                                            role == 2 && (
                                                <td>{numberFormat(data.total_profit)}</td>
                                            )
                                        }
                                        {sortedQuantity.id == 3 || sortedQuantity.id == 4 ? <td style={{ fontWeight: 'bold', }}>{numberFormat(data.total_price)}</td> : <td >{numberFormat(data.total_price)}</td>}

                                        {sortedQuantity.id == 0 || sortedQuantity.id == 1 || sortedQuantity.id == 2 ? <td>{data.total_quantity < data.quantity ? "" : Math.floor(data.total_quantity / data.quantity)}</td> :
                                            <td >{data.total_quantity < data.quantity ? data.total_quantity + " Pc" : Math.floor(data.total_quantity / data.quantity) + " " + data.packaging + " / " + data.total_quantity + " Pc"}</td>}

                                        <td>{data.total_quantity}</td>
                                        {sortedQuantity.id == 0 || sortedQuantity.id == 1 || sortedQuantity.id == 2 ? <td style={{ fontWeight: 'bold', }}>{data.total_quantity < data.quantity ? data.total_quantity + " Pc" : Math.floor(data.total_quantity / data.quantity) + " " + data.packaging + " / " + data.total_quantity + " Pc"}</td> :
                                            <td >{data.total_quantity < data.quantity ? data.total_quantity + " Pc" : Math.floor(data.total_quantity / data.quantity) + " " + data.packaging + " / " + data.total_quantity + " Pc"}</td>}
                                        <td>{data.stock + " " + data.packaging}</td>
                                        {data.business_type === 'ALL' &&
                                            <td>{data.stock - Math.floor(data.total_quantity / data.quantity) > 0 ? <p> {data.stock - Math.floor(data.total_quantity / data.quantity)}</p> : <p style={{ color: "red" }}>{data.stock - Math.floor(data.total_quantity / data.quantity)}</p>}</td>
                                        }
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>

        </div >
    )
}

export default ReportCategorySales
