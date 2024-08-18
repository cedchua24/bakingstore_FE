import React, { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap';
import PaymentTypeService from "./PaymentTypeService";

const AddPaymentType = (props) => {

    const [paymentType, setPaymentType] = useState({
        id: 0,
        payment_type: '',
        payment_type_description: '',
        status: 1,
        type: 2,
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangePaymentType = (e) => {
        setPaymentType({ ...paymentType, [e.target.name]: e.target.value });
    }

    const savePaymentType = () => {
        PaymentTypeService.sanctum().then(response => {
            PaymentTypeService.create(paymentType)
                .then(response => {
                    props.onSavePaymentTypeData(response.data);
                    setMessage(true);
                    setPaymentType({
                        payment_type: ''
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
                    <Form.Label>Payment Type Name</Form.Label>
                    <Form.Control type="text" value={paymentType.payment_type} name="payment_type" placeholder="Enter Payment Type Name" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        ..
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control type="text" value={paymentType.payment_type_description} name="payment_type_description" placeholder="Enter Account Number" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        ..
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" onClick={savePaymentType}>
                    Submit
                </Button>
            </Form>
            <br></br>

        </div>
    )
}

export default AddPaymentType
