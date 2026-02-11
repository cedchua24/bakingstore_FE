import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import CustomerService from "../Customer/CustomerService";
import { Link } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import FormControl from '@mui/material/FormControl';



const CustomerList = (props) => {

    useEffect(() => {
        fetchCustomerList();
    }, []);

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

    const handleClosePickUp = () => setOpenPickUp(false);
    const [openPickUp, setOpenPickUp] = React.useState(false);

    const [customerList, setCustomerList] = useState([]);

    const [customerToDeleteList, setCustomerToDeleteList] = useState([]);
    const [formErrorsPickUp, setFormErrorsPickup] = useState({});

    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);

    const [sortedCustomer, setSortedCustomer] = useState({
        data: [],
        code: '',
        message: '',
        id: 0
    });

    const [customerModal, setCustomerModal] = useState({
        id: 0,
        customer_id: 0,
        first_name: '',
        last_name: ''
    });

    const onChangeCustomerModal = (e) => {
        setCustomerModal({ ...customerModal, [e.target.name]: e.target.value });
    }

    const handleInputChange = (e, value) => {
        e.persist();
        setCustomerModal({
            ...customerModal,
            customer_id: value.id,
        });
    }

    const validateCustomer = (values) => {
        const errors = {};
        if (customerModal.customer_id == 0 || customerModal.customer_id == null) {
            errors.customer_id = "Choose Customer Id!";
        }
        return errors;
    }


    const deleteCustomer = () => {
        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);
        console.log('status: ', customerModal);
        console.log("count: ", Object.keys(validateCustomer(customerModal)).length);
        console.log("validate: ", validateCustomer(customerModal));
        setFormErrorsPickup(validateCustomer(customerModal));
        if (Object.keys(validateCustomer(customerModal)).length > 0) {
            console.log("Has Validation: ");
        } else {
            CustomerService.updateAndDeleteCustomer(customerModal)
                .then(response => {
                    setSubmitLoadingAdd(false);
                    setOpenPickUp(false);
                    setIsAddDisabled(false);
                    fetchCustomerList();
                })
                .catch(e => {
                    console.log(e);
                });
        }

    }

    const handleOpenPickUp = (id, e) => {
        console.log('e', id);
        CustomerService.get(id)
            .then(response => {
                setCustomerModal(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        CustomerService.fetchCustomerToDelete(id)
            .then(response => {
                setCustomerToDeleteList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });

        setOpenPickUp(true);
    }




    const fetchCustomerList = () => {
        setSubmitLoadingAdd(true);
        CustomerService.fetchCustomerByDate()
            .then(response => {
                setCustomerList(response.data);
                setSubmitLoadingAdd(false);
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


    const submitCustomerDelete = () => {

        setSubmitLoadingAdd(true);
        setIsAddDisabled(true);


        CustomerService.fetchCustomerByDate(customerModal)
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
                    onClick={submitCustomerDelete}
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
                        {/* <th>#</th> */}
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Store Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Facebook Ads</th>
                        <th>Active</th>
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
                                {/* <td>{index}</td> */}
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

                                <td>
                                    <Button variant="danger" onClick={(e) => handleOpenPickUp(customer.id, e)} >
                                        Delete
                                    </Button>
                                </td>

                                {/* <td>
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpenPickUp(customer.id, e)} />
                                    </IconButton>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

            <Modal
                keepMounted
                open={openPickUp}
                onClose={handleClosePickUp}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Delete and Transfer Customer
                    </Typography>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={customerModal.first_name} name="first_name" placeholder="Enter First Name" disabled />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Last Name*</Form.Label>
                        <Form.Control type="text" value={customerModal.last_name} name="last_name" placeholder="Enter Last Name" onChange={onChangeCustomerModal} disabled />
                    </Form.Group>
                    {formErrorsPickUp.customer_id && <p style={{ color: "red" }}>{formErrorsPickUp.customer_id}</p>}
                    <FormControl variant="standard" >
                        <Autocomplete
                            // {...defaultProps}
                            options={customerToDeleteList}
                            className="mb-3"
                            id="disable-close-on-select"
                            onChange={handleInputChange}
                            getOptionLabel={(customerToDeleteList) => customerToDeleteList.id}
                            renderInput={(params) => (
                                <TextField {...params} label="Choose Customer Id" variant="standard" />
                            )}
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
                        <Button variant="primary" onClick={deleteCustomer} disabled={isAddDisabled}>
                            Delete
                        </Button>

                    </Box>
                    <br></br>
                    {submitLoadingAdd &&
                        <LinearProgress color="warning" />
                    }
                    <br></br>
                </Box>
            </Modal>
        </div>
    )
}

export default CustomerList
