import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import SupplierServiceService from "../Supplier/SupplierService.service";
import OrderSupplierTransactionService from "./OrderSupplierTransaction.service";
const EditOrderSupplierTransaction = () => {


    const { id } = useParams();
    const [supplierList, setSupplierList] = useState([]);

    useEffect(() => {
        fetchSupplierList();
        fetchOrderSupplierTransaction(id);
    }, []);

    const [orderSupplierTransaction, setOrderSupplierTransaction] = useState({
        id: 0,
        supplier_name: '',
        suppplier_id: 0,
        withTax: 0,
        total_transaction_price: 0,
        order_date: '',
        created_at: '',
        updated_at: ''
    });

    const [isChecked, setChecked] = useState(false);

    const [message, setMessage] = useState(false);

    // const onChangeBrand = (e) => {
    //     setBrand({ ...brand, brand_name: e.target.value });
    // }

    const onChangeInput = (e) => {
        e.persist();
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setOrderSupplierTransaction({ ...orderSupplierTransaction, withTax: 1 });
            } else {
                setOrderSupplierTransaction({ ...orderSupplierTransaction, withTax: 0 });
            }
        } else {
            setOrderSupplierTransaction({ ...orderSupplierTransaction, [e.target.name]: e.target.value });
        }
    }

    const saveOrderTransaction = () => {
        OrderSupplierTransactionService.update(orderSupplierTransaction.id, orderSupplierTransaction)
            .then(response => {
                setOrderSupplierTransaction(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchSupplierList = () => {
        SupplierServiceService.getAll()
            .then(response => {
                setSupplierList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchOrderSupplierTransaction = async (id) => {
        await OrderSupplierTransactionService.get(id)
            .then(response => {
                setOrderSupplierTransaction(response.data);
                setChecked(response.data.withTax === 1 ? true : false);
            })
            .catch(e => {
                console.log("error", e)
            });
        console.log("", orderSupplierTransaction)
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
                {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Supplier Name</Form.Label>
                    <Form.Control type="text" value={orderSupplierTransaction.supplier_name} name="supplier_name" placeholder="Enter Supplier" onChange={onChangeInput} />
                </Form.Group> */}

                <div class="form-floating">
                    <Form.Select aria-label="Default select example" id="floatingCategory" name="supplier_id" defaultValue={orderSupplierTransaction.suppplier_id} className="w-25 mb-3" onChange={onChangeInput} >
                        {
                            supplierList.map((supplier, index) => (
                                supplier.id === orderSupplierTransaction.supplier_id ? <option selected key={supplier.id} value={supplier.id}>{supplier.supplier_name}</option> :
                                    <option key={supplier.id} value={supplier.id}>{supplier.supplier_name}</option>
                            ))
                        }
                    </Form.Select>
                    <label for="floatingCategory">Supplier</label>
                </div>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>With Tax </Form.Label>
                    <Form.Check type="checkbox" name="withTax" value={orderSupplierTransaction.withTax} defaultChecked={orderSupplierTransaction.withTax === 1 ? true : false} onChange={onChangeInput} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" value={orderSupplierTransaction.order_date} name="order_date" onChange={onChangeInput} />
                </Form.Group>

                <Button variant="primary" onClick={saveOrderTransaction}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditOrderSupplierTransaction



