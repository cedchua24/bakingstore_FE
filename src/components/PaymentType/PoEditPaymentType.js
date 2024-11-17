import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import Checkbox from '@mui/material/Checkbox';
import PaymentTypePoService from "../OtherService/PaymentTypePoService";

const PoEditPaymentType = () => {


    const { id } = useParams();

    useEffect(() => {
        fetchPaymentType(id);
    }, []);

    const [paymentType, setPaymentType] = useState({
        id: 0,
        payment_term_id: 0,
        bank_id: 0,
        account_number: 0,
        account_name: '',
        account_description: '',
        due_date: 0,
        credit_limit: 0,
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
        PaymentTypePoService.update(paymentType.id, paymentType)
            .then(response => {
                setPaymentType(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchPaymentType = (id) => {
        PaymentTypePoService.get(id)
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
                    <Form.Label>Acoount Name</Form.Label>
                    <Form.Control type="text" value={paymentType.account_name} name="account_name" placeholder="Enter Account Name" onChange={onChangePaymentType} />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Acoount Description</Form.Label>
                    <Form.Control type="text" value={paymentType.account_description} name="account_description" placeholder="Enter Account Description" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        Ex. Platinum
                    </Form.Text>
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Account Number</Form.Label>
                    <Form.Control type="text" value={paymentType.account_number} name="account_number" placeholder="Enter Account Last 4 Digit Number" onChange={onChangePaymentType} />
                    <Form.Text className="text-muted"  >
                        Last 4 Digit Number
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control type="number" value={paymentType.due_date} name="due_date" placeholder="Enter Due Date" onChange={onChangePaymentType} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Credit Limit</Form.Label>
                    <Form.Control type="number" value={paymentType.credit_limit} name="credit_limit" placeholder="Enter Credit Limit" onChange={onChangePaymentType} />
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

export default PoEditPaymentType
