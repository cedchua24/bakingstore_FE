import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import PaymentTypeService from "./PaymentTypeService";

const EditPaymentType = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchPaymentType(id);
    }, []);

    const [paymentType, setPaymentType] = useState({
        id: 0,
        payment_type: '',
        payment_type_description: '',
        status: 0,
        created_at: '',
        updated_at: ''
    });

    const [message, setMessage] = useState(false);

    const onChangePaymentType = (e) => {
        setPaymentType({ ...paymentType, [e.target.name]: e.target.value });
    }

    const onChangePaymentTypeStatus = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setPaymentType({ ...paymentType, status: 1 });
            } else {
                setPaymentType({ ...paymentType, status: 0 });
            }
        } else {
            setPaymentType({ ...paymentType, [e.target.name]: e.target.value });
        }
    }




    const savePaymentType = () => {
        PaymentTypeService.update(paymentType.id, paymentType)
            .then(response => {
                setPaymentType(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchPaymentType = (id) => {
        PaymentTypeService.get(id)
            .then(response => {
                setPaymentType(response.data);
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
                    <Form.Label>Payment Type</Form.Label>
                    <Form.Control type="text" name="payment_type" value={paymentType.payment_type} placeholder="Enter Payment Type" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        ..
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Payment Type Description</Form.Label>
                    <Form.Control type="text" name="payment_type_description" value={paymentType.payment_type_description} placeholder="Enter Payment Type" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        ..
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enabled ? </Form.Label>

                    <Checkbox
                        checked={paymentType.status === 0 ? false : true}
                        onChange={onChangePaymentTypeStatus}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Form.Group>



                <Button variant="primary" onClick={savePaymentType}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditPaymentType
