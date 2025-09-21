import React, { useState, useEffect } from "react";
import CustomerService from "./CustomerService";
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Button, Form, Alert } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';

const CustomerHistory = () => {

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const [customerList, setCustomerList] = useState({
        data: [],
        day_count: 0,
        total_page: 0,
        page: 0,
        request: ''
    });
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const [customerTransaction, setCustomerTransaction] = useState({
        dateFrom: '',
        page: 1
    });

    const [submitLoadingPage, setSubmitLoadingPage] = useState(false);
    const [isAddDisabledPage, setIsAddDisabledPage] = useState(false);



    const validate = (values) => {
        const errors = {};
        if (customerTransaction.dateFrom.length == 0) {
            errors.dateFrom = "Date From Required!";
        }


        return errors;
    }

    const fetchByDate = () => {
        console.log('status: ', customerTransaction);
        console.log("count: ", Object.keys(validate(customerTransaction)).length);
        console.log("validate: ", validate(customerTransaction));
        setFormErrors(validate(customerTransaction));
        if (Object.keys(validate(customerTransaction)).length > 0) {
            console.log("Has Validation: ");
        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            CustomerService.customerLastOrderList(1, customerTransaction)
                .then(response => {
                    setCustomerList(response.data);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log("error", e)
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        }
    }


    const fetchCustomerList = () => {
        CustomerService.customerLastOrderList(1, customerTransaction)
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeInput = (e) => {
        console.log(e.target.value);
        setCustomerTransaction({ ...customerTransaction, [e.target.name]: e.target.value });
    }

    const onChangeInputPagination = async (e, value) => {
        e.preventDefault();
        console.log('value', value);
        setCustomerTransaction({ ...customerTransaction, page: value });
        // customerLastOrderList();
        setSubmitLoadingPage(true);
        setIsAddDisabledPage(true);
        CustomerService.customerLastOrderList(value, customerTransaction)
            .then(response => {
                setCustomerList(response.data);
                setSubmitLoadingPage(false);
                setIsAddDisabledPage(false);
                window.scrollTo(0, 0);
            })
            .catch(e => {
                console.log("error", e)
                setSubmitLoadingPage(false);
                setIsAddDisabledPage(false);
                window.scrollTo(0, 0);
            });
    }

    const sortList = ($data) => {
        return $data.sort((a, b) => (a.last_order > b.last_order) ? 1 : -1)
    }








    return (
        <div>
            <Form>
                {formErrors.dateFrom && <p style={{ color: "red" }}>{formErrors.dateFrom}</p>}
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date Below:</Form.Label>
                    <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                </Form.Group>

                {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Days</Form.Label>
                    <Form.Control type="number" name="dateFrom" placeholder="Enter Category" onChange={onChangeInput} />
                </Form.Group> */}
                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={fetchByDate}>
                    Search
                </Button>
                <br></br>
                {customerList.day_count != 0 &&
                    <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                        <Form.Label>Days Ago:</Form.Label>
                        <Form.Control type="text" value={customerList.day_count} disabled />
                    </Form.Group>
                }
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
                <br></br>
            </Form >

            <legend align="center" style={{ fontWeight: 'bold' }} > Customer History List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Last Date</th>
                        <th>Last Order</th>
                        <th></th>
                        <th></th>

                        {/* <th></th> */}
                    </tr>
                </thead>
                <tbody>

                    {
                        sortList(customerList.data).map((customer, index) => (
                            <tr key={customer.id} >
                                <td>{customer.id}</td>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.contact_number}</td>
                                <td>{customer.email}</td>
                                <td>{customer.address}</td>
                                <td>{customer.date}</td>
                                <td>Last {customer.last_order} {customer.last_order <= 1 ? 'Day' : 'Days'}</td>
                                <td>

                                    <Link variant="primary" to={"/customers/customerTransactionList/" + customer.id}   >
                                        <Button variant="primary" >
                                            View Transaction
                                        </Button>
                                    </Link>
                                </td>
                                <td>

                                    <Link variant="primary" to={"/customers/customerProductList/" + customer.id}   >
                                        <Button variant="primary" >
                                            View Products
                                        </Button>
                                    </Link>
                                </td>
                                {/* <td>
                                    <Button variant="danger" onClick={(e) => deleteCustomermr(customer.id, e)} >
                                        Delete
                                    </Button>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
            {/* <Stack spacing={2}>
                <Typography>Page: {customerTransaction.page}</Typography>

                <Pagination
                    count={Number.isInteger(customerList.total_page / 100) ? customerList.total_page / 100 : Math.floor(customerList.total_page / 100 + 1)}
                    page={customerTransaction.page}
                    onChange={onChangeInputPagination}
                    disabled={submitLoadingPage}
                />

                {submitLoadingPage &&
                    <LinearProgress color="warning" />
                }
            </Stack> */}

            <br></br>
            <br></br>

        </div>
    )
}

export default CustomerHistory
