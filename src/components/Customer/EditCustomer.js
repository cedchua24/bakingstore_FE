import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import CustomerService from "./CustomerService";
import Checkbox from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';

const EditCustomer = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchCustomer(id);
    }, []);

    const [customer, setCustomer] = useState({
        id: 0,
        customer_name: '',
        created_at: '',
        updated_at: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitLoadingAdd, setSubmitLoadingAdd] = useState(false);
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [message, setMessage] = useState(false);

    const onChangeCustomer = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    }

    const onChangePaymentTypedisabled = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setCustomer({ ...customer, disabled: 1 });
            } else {
                setCustomer({ ...customer, disabled: 0 });
            }
        } else {
            setCustomer({ ...customer, disabled: e.target.value });
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
            CustomerService.update(customer.id, customer)
                .then(response => {
                    setCustomer(response.data);
                    setMessage(true);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                })
                .catch(e => {
                    console.log(e);
                    setSubmitLoadingAdd(false);
                    setIsAddDisabled(false);
                });
        }
    }

    const fetchCustomer = (id) => {
        CustomerService.get(id)
            .then(response => {
                setCustomer(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    return (
        <div>
            {message &&
                <Alert variant="success" dismissible>
                    <Alert.Heading>Successfully Updated!</Alert.Heading>
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
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" value={customer.first_name} name="first_name" placeholder="Enter First Name" onChange={onChangeCustomer} />
                </Form.Group>

                {formErrors.last_name && <p style={{ color: "red" }}>{formErrors.last_name}</p>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Last Name</Form.Label>
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
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Disabled ? </Form.Label>

                    <Checkbox
                        checked={customer.disabled === 0 ? false : true}
                        onChange={onChangePaymentTypedisabled}
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
        </div>
    )
}

export default EditCustomer
