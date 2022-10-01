import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import SupplierServiceService from "./SupplierService.service";
const EditSupplier = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchSupplier(id);
    }, []);

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

    // const onChangeBrand = (e) => {
    //     setBrand({ ...brand, brand_name: e.target.value });
    // }

    const onChangeInput = (e) => {
        e.persist();
        setSupplier({ ...supplier, [e.target.name]: e.target.value });
    }

    const saveSupplier = () => {
        SupplierServiceService.update(supplier.id, supplier)
            .then(response => {
                setSupplier(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchSupplier = (id) => {
        SupplierServiceService.get(id)
            .then(response => {
                setSupplier(response.data);
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
        </div>
    )
}

export default EditSupplier
