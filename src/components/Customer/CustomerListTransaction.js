import React, { useState, useEffect } from "react";
import CustomerService from "./CustomerService";
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Form, Alert } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';

const CustomerListTransaction = () => {

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const [sortedCustomer, setSortedCustomer] = useState({
        data: [],
        code: '',
        message: '',
        id: 0
    });

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [customerList, setCustomerList] = useState({
        data: [],
    });

    const saveCustomerDataHandler = (customer) => {
        setCustomerList([...customerList, customer]);
    }

    const onChangeInput = (e) => {
        console.log("status", e.target.value);
        console.log("status", e.target.name);
        setSortedCustomer({ ...sortedCustomer, [e.target.name]: e.target.value });

    }

    const submitSortedCustomerList = () => {

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        CustomerService.fetchCustomerTransactionListByDate(sortedCustomer)
            .then(response => {
                console.log("response.data", response.data)
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



    const fetchCustomerList = () => {
        // setSubmitLoadingAdd(true);
        // CustomerService.fetchCustomerTransactionListByDate()
        //     .then(response => {
        //         setCustomerList(response.data);
        //         setSubmitLoadingAdd(false);
        //     })
        //     .catch(e => {
        //         console.log("error", e)
        //     });
    }
    const numberFormat = (value) =>
        new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'PHP'
        }).format(value).replace(/(\.|,)00$/g, '');

    const totalSum = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { total_balance }) => acc + total_balance, 0));
    }

    const totalProfit = (numbers) => {
        // numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        return numberFormat(numbers.reduce((acc, { total_profit }) => acc + total_profit, 0));
    }

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }




    return (
        <div>
            <div style={{ float: 'right', marginRight: 300 }}>
                <Form.Group controlId="formBasicEmail" disabled>
                    <Form.Label>Total Amount: </Form.Label>
                    <Form.Control type="text" value={totalSum(customerList.data)} />
                </Form.Group>
                <br></br>
                <Form.Group controlId="formBasicEmail" disabled>
                    <Form.Label>Total Profit: </Form.Label>
                    <Form.Control type="text" value={totalProfit(customerList.data)} />
                </Form.Group>


            </div>

            <Form>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date From:</Form.Label>
                    <Form.Control type="date" name="dateFrom" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Date To:</Form.Label>
                    <Form.Control type="date" name="dateTo" onChange={onChangeInput} />
                </Form.Group>
                <Form.Group className="w-25 mb-3" controlId="formBasicEmail">
                    <Form.Label>Total Count:</Form.Label>
                    <Form.Control type="text" value={customerList.data.length} disabled />
                </Form.Group>
                <br></br>
                <Button variant="primary"
                    onClick={submitSortedCustomerList}
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
                <br></br>


                <br></br>
            </Form>
            <legend align="center" style={{ fontWeight: 'bold' }} > Customer List Transaction </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Store Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>FB Ads</th>
                        <th>Sales</th>
                        <th>Profit</th>
                        <th>Active</th>
                        <th>Date Created</th>
                        <th></th>
                        <th></th>

                        {/* <th></th> */}
                    </tr>
                </thead>
                {customerList.data.length == 0 ?
                    (<tr style={{ color: "red" }}>{"No Data Available"}</tr>)
                    :
                    (
                        <tbody>

                            {

                                customerList.data.map((customer, index) => (
                                    <tr key={customer.id} >
                                        <td>{customer.id}</td>
                                        <td>{customer.first_name}</td>
                                        <td>{customer.last_name}</td>
                                        <td>{customer.contact_number}</td>
                                        <td>{customer.store_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.ads === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                        <td>{numberFormat(customer.total_balance)}</td>
                                        <td>{numberFormat(customer.total_profit)}</td>
                                        <td>{customer.disabled === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                        <td>{formatStatementDate(customer.created_at)}</td>
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
                        </tbody>)}
            </table>
        </div>
    )
}

export default CustomerListTransaction
