import React, { useState, useEffect } from "react";
import CustomerService from "./CustomerService";
import CustomerUpdateService from "../OtherService/CustomerUpdateService";

import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Button, Form, Alert } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import UpdateIcon from '@mui/icons-material/Update';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material/styles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const CustomerHistory = () => {

    useEffect(() => {
        fetchCustomerList();
    }, []);

    const Div = styled('div')(({ theme }) => ({
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        fontSize: "2rem",
        padding: theme.spacing(1),
    }));

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

    const [customerSupport, setCustomerSupport] = useState({
        id: 0,
        customer_id: 0,
        user_id: localStorage.getItem('auth_user_id'),
        first_name: '',
        last_name: '',
        chat: 0,
        promo: 0,
        status: 0,
        created_at: '',
        updated_at: ''
    });


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
        setSubmitLoadingAdd(true);
        CustomerService.customerLastOrderList(1, customerTransaction)
            .then(response => {
                setCustomerList(response.data);
                setSubmitLoadingAdd(false);
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


    const handleOpenModal = () => {
        setOpen(false);
    };

    const [open, setOpen] = React.useState(false);

    const handleOpen = (id, e) => {
        console.log('e', id);
        fetchCustomerSupport(id);
        setOpen(true);
    }

    const fetchCustomerSupport = async (id) => {
        await CustomerService.get(id)
            .then(response => {
                setCustomerSupport({
                    ...customerSupport,
                    customer_id: response.data.id,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    status: 0,
                    promo: 0,
                    chat: 0,
                });
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const onChangeCustomerSupport = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setCustomerSupport({ ...customerSupport, chat: 1 });
            } else {
                setCustomerSupport({ ...customerSupport, chat: 0 });
            }
        } else {
            setCustomerSupport({ ...customerSupport, chat: e.target.value });
        }
    }

    const onChangeCustomerPromo = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setCustomerSupport({ ...customerSupport, promo: 1 });
            } else {
                setCustomerSupport({ ...customerSupport, promo: 0 });
            }
        } else {
            setCustomerSupport({ ...customerSupport, promo: e.target.value });
        }
    }

    const submitCustomerSupport = () => {
        CustomerUpdateService.create(customerSupport)
            .then(response => {
                fetchCustomerList();
                setOpen(false);
            })
            .catch(e => {
                console.log(e);
            });
    }



    const sortList = ($data) => {
        return $data.sort((a, b) => (a.last_order > b.last_order) ? 1 : -1)
    }


    const covertDateString = (day) => {
        var d = new Date(day);
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(d);
    }

    const steps = [
        'Customer Need to Follow up',
        'Customer Done Following up',
        'Customer Successfully Reordered',
    ];



    return (
        <div>
            <Stepper activeStep={0} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>


                    </Step>
                ))}
            </Stepper>
            <br></br>
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

            <legend align="center" style={{ fontWeight: 'bold' }} > Customer Need to Follow Up </legend>
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
                        <th>Action</th>
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
                                <td>{covertDateString(customer.date)}</td>
                                <td>Last {customer.last_order} {customer.last_order <= 1 ? 'Day' : 'Days'}</td>
                                <td>
                                    <IconButton>
                                        <UpdateIcon color="primary" onClick={(e) => handleOpen(customer.id, e)} />
                                    </IconButton>
                                </td>
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
            <Stack spacing={2}>
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
            </Stack>

            <br></br>
            <br></br>

            <Modal
                keepMounted
                open={open}
                onClose={handleOpenModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        Customer Order Status
                    </Typography>
                    <Form.Group className="w-45 mb-3" controlId="formBasicEmail">
                        <Form.Label></Form.Label>
                        <Form.Control type="text" value={customerSupport.first_name + " " + customerSupport.last_name} disabled />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Follow Up Customer ? </Form.Label>

                        <Checkbox
                            checked={customerSupport.chat == 1 ? true : false}
                            onChange={onChangeCustomerSupport}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Offer Promo ? </Form.Label>

                        <Checkbox
                            checked={customerSupport.promo == 1 ? true : false}
                            onChange={onChangeCustomerPromo}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Form.Group>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Button variant="primary" onClick={submitCustomerSupport}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </div>
    )
}

export default CustomerHistory
