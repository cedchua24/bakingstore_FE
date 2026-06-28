import React, { useState, useEffect } from "react";
import CustomerService from "../Customer/CustomerService";
import { Button, Form } from 'react-bootstrap';
import CustomerServiceService from "./CustomerService";
import LinearProgress from '@mui/material/LinearProgress';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const AddCustomer = (props) => {

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const [validator, setValidator] = useState({
        severity: '',
        message: '',
        isShow: false
    });

    const [customerList, setCustomerList] = useState([]);
    const [customer, setCustomer] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        store_name: '',
        contact_number: '',
        email: '',
        ads: 0,
        user_id: localStorage.getItem('auth_user_id'),
        address: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const onChangeCustomer = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    }

    const fetchCustomerList = () => {
        CustomerService.getAll()
            .then(response => {
                setCustomerList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }


    const onChangeAds = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setCustomer({ ...customer, ads: 1 });
            } else {
                setCustomer({ ...customer, ads: 0 });
            }
        } else {
            setCustomer({ ...customer, ads: e.target.value });
        }
    }


    const validate = (values) => {
        const errors = {};
        if (customer.first_name == 0) {
            errors.first_name = "First Name is Required!";
        }
        if (customer.last_name == 0) {
            errors.last_name = "Last Name is Required!";
        }



        return errors;
    }


    const saveCustomer = () => {

        console.log('customer', customer);

        console.log("count: ", Object.keys(validate(customer)).length);
        console.log("validate: ", validate(customer));
        setFormErrors(validate(customer));
        if (Object.keys(validate(customer)).length > 0) {
            console.log("Has Validation: ");

        } else {
            setSubmitLoadingAdd(true);
            setIsAddDisabled(true);
            console.log(customer);
            CustomerServiceService.sanctum().then(response => {
                CustomerServiceService.create(customer)
                    .then(response => {
                        fetchCustomerList();
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setValidator({
                            severity: 'success',
                            message: response.data.message,
                            isShow: true,
                        });
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        console.log(e);
                        setValidator({
                            severity: 'error',
                            message: "Customer Already Exists",
                            isShow: true,
                        });
                    });
            });
        }
    }

    const formatStatementDate = (date) => {
        var d = new Date(date);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }


    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                {validator.isShow &&
                    <Alert variant="filled" severity={validator.severity}>{validator.message}</Alert>
                }
            </Stack>
            <br></br>
            <Form>
                {formErrors.first_name && <p style={{ color: "red" }}>{formErrors.first_name}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control type="text" value={customer.first_name} name="first_name" placeholder="Enter First Name" onChange={onChangeCustomer} />

                </Form.Group>

                {formErrors.last_name && <p style={{ color: "red" }}>{formErrors.last_name}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control type="text" value={customer.last_name} name="last_name" placeholder="Enter Last Name" onChange={onChangeCustomer} />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Store Name</Form.Label>
                    <Form.Control type="text" value={customer.store_name} name="store_name" placeholder="Enter Store Name" onChange={onChangeCustomer} />

                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control type="text" value={customer.contact_number} name="contact_number" placeholder="Enter Contact Number" onChange={onChangeCustomer} />

                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email </Form.Label>
                    <Form.Control type="text" value={customer.email} name="email" placeholder="Enter Email" onChange={onChangeCustomer} />

                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" value={customer.address} name="address" placeholder="Enter Address" onChange={onChangeCustomer} />

                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Facebook Ads ? </Form.Label>

                    <Checkbox
                        checked={customer.ads === 0 ? false : true}
                        onChange={onChangeAds}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Form.Group>

                <Button variant="primary"
                    disabled={isAddDisabled}
                    onClick={saveCustomer}>
                    Submit
                </Button>
                <br></br>
                <br></br>
                {submitLoadingAdd &&
                    <LinearProgress color="warning" />
                }
            </Form>
            <br></br>

            <legend align="center" style={{ fontWeight: 'bold' }} > Customer List </legend>
            <table class="table table-bordered">
                <thead class="table-dark">
                    <tr class="table-secondary">
                        <th>#</th>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Store Name</th>
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
                                <td>{customer.store_name}</td>
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

export default AddCustomer
