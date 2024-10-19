import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import CustomerServiceService from "./CustomerService";
import LinearProgress from '@mui/material/LinearProgress';

const AddCustomer = (props) => {

    const [customer, setCustomer] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        contact_number: '',
        email: '',
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
                        props.onSaveCustomerData(response.data);
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        setMessage(true);
                    })
                    .catch(e => {
                        setSubmitLoadingAdd(false);
                        setIsAddDisabled(false);
                        console.log(e);
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

        </div>
    )
}

export default AddCustomer
