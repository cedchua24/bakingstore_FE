import React, { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import ProductService from "../Product/ProductService.service";
import SupplierServiceService from "../Supplier/SupplierService.service";
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

const ReportProductUnsold = () => {


    useEffect(() => {
        fetchsortedQuantityList();
        fetchSupplierList();
        fetchCategoryList();
    }, []);

    const [role] = useState(localStorage.getItem('role_as'));
    const [productSortedDate, setProductSortedDate] = useState({
        supplier_id: '',
        category_id: '',
        dateFrom: "",
        dateTo: ""
    });

    const [supplierList, setSupplierList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);

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
        console.log("status", e.target.name);
        setProductSortedDate({ ...productSortedDate, [e.target.name]: e.target.value });

    }


    const validate = (values) => {
        const errors = {};
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
            ProductService.getUnsoldProducts(productSortedDate)
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

    const fetchSupplierList = () => {
        SupplierServiceService.getAll()
            .then(response => {
                setSupplierList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCategoryList = () => {
        CategoryServiceService.getAll()
            .then(response => {
                setCategoryList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchsortedQuantityList = () => {
        ProductService.getUnsoldProducts(productSortedDate)
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
        return numberFormat(numbers.reduce((acc, { total_value }) => acc + total_value, 0));
    }

    // formatDate
    const covertDateString = (day) => {
        var d = new Date(day);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }



    return (
        <div>
            <div style={{ float: 'right', minWidth: 800 }}>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Count: </Form.Label>
                    <Form.Control type="text" value={sortedQuantity.data.length} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail" disabled>
                    <Form.Label>Total Value: </Form.Label>
                    <Form.Control type="text" value={totalSum(sortedQuantity.data)} />
                </Form.Group>
            </div>
            <Form>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="supplier-select-label">Supplier</InputLabel>
                        <Select
                            labelId="supplier-select-label"
                            id="supplier-select"
                            label="Supplier"
                            name="supplier_id"
                            value={productSortedDate.supplier_id}
                            onChange={onChangeInput}
                        >
                            <MenuItem value="">All Suppliers</MenuItem>
                            {
                                supplierList.map((supplier, index) => (
                                    <MenuItem key={supplier.id} value={supplier.id}>{supplier.supplier_name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl sx={{ m: 0, minWidth: 320, minHeight: 70 }}>
                        <InputLabel id="category-select-label">Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="Category"
                            name="category_id"
                            value={productSortedDate.category_id}
                            onChange={onChangeInput}
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            {
                                categoryList.map((category, index) => (
                                    <MenuItem key={category.id} value={category.id}>{category.category_name}</MenuItem>
                                ))
                            }
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
            <legend align="center" style={{ fontWeight: 'bold' }} > Product UnSold </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity / Weight</th>
                        <th>Stock WS</th>
                        <th>Stock RTL</th>
                        <th>Total Value</th>
                        <th>Last Sold</th>
                    </tr>
                </thead>
                {sortedQuantity.data.length == 0 ?
                    (<tr style={{ color: "red" }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>
                            {
                                sortedQuantity.data.map((data, index) => (
                                    <tr key={data.id} >
                                        <td>{data.id}</td>
                                        <td>{data.product_name}</td>
                                        <td>{numberFormat(data.price)}</td>
                                        <td>{data.quantity === 1 ? <p >{data.weight}kg</p>
                                            : <p >{data.quantity}x{Number.isInteger(data.weight / data.quantity) ? (data.weight / data.quantity) : (data.weight / data.quantity).toPrecision(2)}{data.variation}</p>}
                                        </td>
                                        <td>{data.stock}</td>
                                        <td>{data.stock_pc}</td>
                                        <td>{numberFormat(data.total_value)}</td>
                                        <td>
                                            {data.last_sold_at ? (
                                                covertDateString(data.last_sold_at)
                                            ) : (
                                                <span style={{ color: 'red', fontWeight: 'bold' }}>
                                                    No Sales Ever!
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                                )
                            }
                        </tbody>)}
            </table>

        </div >
    )
}

export default ReportProductUnsold
