import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import CustomerServiceService from "./CustomerService";

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

    const onChangeCustomer = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    }

    const saveCustomer = () => {
        console.log(customer);
        CustomerServiceService.sanctum().then(response => {
            CustomerServiceService.create(customer)
                .then(response => {
                    props.onSaveCustomerData(response.data);
                    setMessage(true);
                })
                .catch(e => {
                    console.log(e);
                });
        });
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
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control type="text" value={customer.first_name} name="first_name" placeholder="Enter First Name" onChange={onChangeCustomer} />

                </Form.Group>
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

                <Button variant="primary" onClick={saveCustomer}>
                    Submit
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddCustomer
