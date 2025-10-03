import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import CustomerService from "../Customer/CustomerService";
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';



const CustomerList = (props) => {

    useEffect(() => {
        fetchCustomerList();
    }, []);


    const [customerList, setCustomerList] = useState([]);

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [sortedCustomer, setSortedCustomer] = useState({
        data: [],
        code: '',
        message: '',
        id: 0
    });

    const fetchCustomerList = () => {
        CustomerService.fetchCustomerByDate()
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeInput = (e) => {
        console.log("status", e.target.value);
        console.log("status", e.target.name);
        setSortedCustomer({ ...sortedCustomer, [e.target.name]: e.target.value });

    }

    const submitSortedCustomerList = () => {

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        CustomerService.fetchCustomerByDate(sortedCustomer)
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


    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }


    return (
        <div>

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
                    <Form.Control type="text" value={customerList.length} disabled />
                </Form.Group>
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
            </Form>

            <legend align="center" style={{ fontWeight: 'bold' }} > Customer List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>#</th>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Facebook Ads</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        {/* <th></th> */}
                    </tr>
                </thead>
                <tbody>

                    {
                        customerList.map((customer, index) => (
                            <tr key={customer.id} >
                                <td>{index}</td>
                                <td>{customer.id}</td>
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.contact_number}</td>
                                <td>{customer.email}</td>
                                <td>{customer.address}</td>
                                <td>{customer.ads === 1 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>{customer.disabled === 0 ? <CheckIcon style={{ color: 'green', }} /> : <CloseIcon style={{ color: 'red', }} />}</td>
                                <td>      {formatStatementDate(customer.created_at)}</td>
                                <td>

                                    <Link variant="primary" to={"/customers/" + customer.id}   >
                                        <Button variant="primary" >
                                            Update
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
        </div>
    )
}

export default CustomerList
