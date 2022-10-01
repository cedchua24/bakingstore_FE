import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import SupplierServiceService from "./SupplierService.service";

const AddSupplier = (props) => {

    const [supplier, setSupplier] = useState({
        id: 0,
        supplier_name: '',
        address: '',
        contact_number: '',
        email: '',
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangeInput = (e) => {
        e.persist();
        setSupplier({ ...supplier, [e.target.name]: e.target.value });
    }

    const saveSupplier = () => {
        SupplierServiceService.sanctum().then(response => {
            SupplierServiceService.create(supplier)
                .then(response => {
                    props.onSaveSupplierData(response.data);
                    setMessage(true);
                    setSupplier({
                        supplier_name: '',
                        brand_name: '',
                        address: '',
                        contact_number: '',
                        email: ''
                    });
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
                    <Form.Label>Supplier Name</Form.Label>
                    <Form.Control type="text" value={supplier.supplier_name} name="supplier_name" placeholder="Enter Supplier" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" value={supplier.address} name="address" placeholder="Enter Address" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control type="text" value={supplier.contact_number} name="contact_number" placeholder="Enter Contact Number" onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={supplier.email} name="email" placeholder="Enter Email" onChange={onChangeInput} />
                </Form.Group>

                <Button variant="primary" onClick={saveSupplier}>
                    Submit
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddSupplier
