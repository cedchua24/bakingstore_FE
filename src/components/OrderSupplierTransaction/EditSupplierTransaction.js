import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Dropdown, FloatingLabel } from 'react-bootstrap';
import ProductServiceService from "../Product/ProductService.service";
import BrandServiceService from "../Brand/BrandService.service";
import CategoryServiceService from "../Category/CategoryService.service";
import OrderSupplierTransactionService from "./OrderSupplierTransactionService";
import Checkbox from '@mui/material/Checkbox';

const EditSupplierTransaction = () => {

    const { id } = useParams();

    useEffect(() => {
        fetchProduct(id);
        fetchOrderTransactionList(id);
        fetchBrandList();
        fetchCategoryList();
    }, []);

    const [product, setProduct] = useState({
        id: 0,
        category_id: 0,
        category_name: '',
        brand_id: 0,
        brand_name: '',
        product_name: "",
        price: 0,
        sale_price: 0,
        stock: 0,
        weight: 0,
        quantity: 0,
        stock_warning: 0,
        disabled: 0
    });

    const [orderTransaction, setorderTransaction] = useState({
        id: 0,
        supplier_id: 0,
        supplier_name: 0,
        withTax: 0,
        total_transaction_price: 0,
        order_date: '',
        invoice_number: '',
        status: 'PENDING',
        created_at: '',
        updated_at: ''
    });

    const [brandList, setBrandList] = useState([]);
    const [categeryList, setCategoryList] = useState([]);

    const [message, setMessage] = useState(false);

    const onChangePaymentTypedisabled = (e) => {

        console.log("error", e.target.checked)
        if (e.target.type === 'checkbox') {
            if (e.target.checked === true) {
                setProduct({ ...product, disabled: 1 });
            } else {
                setProduct({ ...product, disabled: 0 });
            }
        } else {
            setProduct({ ...product, disabled: e.target.value });
        }
    }

    const onChange = (e) => {
        setorderTransaction({ ...orderTransaction, [e.target.name]: e.target.value });
    }

    const updateProduct = () => {
        console.log(product);
        OrderSupplierTransactionService.update(orderTransaction.id, orderTransaction)
            .then(response => {
                // setProduct(response.data);
                setMessage(true);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const fetchProduct = (id) => {
        ProductServiceService.get(id)
            .then(response => {
                setProduct(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchOrderTransactionList = (id) => {
        OrderSupplierTransactionService.get(id)
            .then(response => {
                setorderTransaction(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchBrandList = () => {
        BrandServiceService.getAll()
            .then(response => {
                setBrandList(response.data);
            })
            .catch(e => {
                console.log("error", e)
            });
    }

    const fetchCategoryList = () => {
        CategoryServiceService.getAll()
            .then(response => {
                setCategoryList(response.data);
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

                <FloatingLabel
                    controlId="floatingInput"
                    label="Invoice Number"
                    className="w-25 mb-3"
                >
                    <Form.Control type="text" value={orderTransaction.invoice_number} name="invoice_number" onChange={onChange} />
                </FloatingLabel>


                <Button variant="primary" className="mb-3" onClick={updateProduct}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default EditSupplierTransaction
